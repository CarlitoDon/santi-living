/**
 * TRPC Client for proxy
 *
 * Type-safe API client to communicate with proxy.
 * Runtime env reading for Vercel SSR compatibility.
 */
import { createTRPCClient, httpBatchLink, type TRPCClient } from "@trpc/client";
import superjson from "superjson";
import type { AppRouter } from "@/types/proxy-router-contract";
import { getProxyApiSecret, getProxyTrpcUrl } from "./proxy-config";

type ProxyClientRequestHeaders = {
  correlationId?: string;
  idempotencyKey?: string;
  companyId?: string;
  attributionSource?: string;
  attributionMedium?: string;
  attributionCampaign?: string;
  attributionGclid?: string;
  attributionFbclid?: string;
  attributionWbraid?: string;
  attributionGbraid?: string;
};

export class ProxyTransportError extends Error {
  readonly status: number | null;

  constructor(message: string, status: number | null = null, cause?: unknown) {
    super(message);
    this.name = "ProxyTransportError";
    this.status = status;
    Object.defineProperty(this, "cause", {
      configurable: true,
      enumerable: false,
      value: cause,
      writable: false,
    });
    Object.setPrototypeOf(this, ProxyTransportError.prototype);
  }
}

export function isProxyTransportError(
  error: unknown,
): error is ProxyTransportError {
  if (error instanceof ProxyTransportError) {
    return true;
  }

  if (!error || typeof error !== "object" || !("cause" in error)) {
    return false;
  }

  const cause = (error as { cause?: unknown }).cause;
  return cause !== error && isProxyTransportError(cause);
}

export async function fetchProxyResponse(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  let response: Response;

  try {
    response = await fetch(input, init);
  } catch (error) {
    throw new ProxyTransportError(
      "Proxy request failed before receiving a response",
      null,
      error,
    );
  }

  const contentType = response.headers.get("content-type")?.toLowerCase() ?? "";
  if (!contentType.includes("application/json")) {
    throw new ProxyTransportError(
      `Proxy returned a non-JSON response (HTTP ${response.status})`,
      response.status,
    );
  }

  return response;
}

// Get service URL from environment at RUNTIME (not build time)
const getServiceUrl = () => {
  const trpcUrl = getProxyTrpcUrl();
  return trpcUrl.replace(/\/api\/trpc$/, "");
};

// Get API key from environment at RUNTIME
const getApiKey = () => {
  if (typeof window === "undefined") {
    const apiKey = getProxyApiSecret();

    if (!apiKey && process.env.NODE_ENV === "production") {
      throw new Error(
        "[trpc-client] PROXY_API_SECRET environment variable is required in production",
      );
    }

    return apiKey;
  }
  return "";
};

/**
 * Create a TRPC client instance
 * Note: This should be called on the server-side (API routes/SSR) only
 */
export function createProxyClient(
  requestHeaders: ProxyClientRequestHeaders = {},
): TRPCClient<AppRouter> {
  const serviceUrl = getServiceUrl();
  const apiKey = getApiKey();

  return createTRPCClient<AppRouter>({
    links: [
      httpBatchLink({
        url: `${serviceUrl}/api/trpc`,
        fetch: fetchProxyResponse,
        transformer: superjson,
        headers: () => ({
          Authorization: `Bearer ${apiKey}`,
          ...(requestHeaders.correlationId
            ? { "X-Correlation-Id": requestHeaders.correlationId }
            : {}),
          ...(requestHeaders.idempotencyKey
            ? { "Idempotency-Key": requestHeaders.idempotencyKey }
            : {}),
          ...(requestHeaders.companyId
            ? { "X-Company-Id": requestHeaders.companyId }
            : {}),
          ...(requestHeaders.attributionSource
            ? { "X-Attribution-Source": requestHeaders.attributionSource }
            : {}),
          ...(requestHeaders.attributionMedium
            ? { "X-Attribution-Medium": requestHeaders.attributionMedium }
            : {}),
          ...(requestHeaders.attributionCampaign
            ? { "X-Attribution-Campaign": requestHeaders.attributionCampaign }
            : {}),
          ...(requestHeaders.attributionGclid
            ? { "X-Attribution-Gclid": requestHeaders.attributionGclid }
            : {}),
          ...(requestHeaders.attributionFbclid
            ? { "X-Attribution-Fbclid": requestHeaders.attributionFbclid }
            : {}),
          ...(requestHeaders.attributionWbraid
            ? { "X-Attribution-Wbraid": requestHeaders.attributionWbraid }
            : {}),
          ...(requestHeaders.attributionGbraid
            ? { "X-Attribution-Gbraid": requestHeaders.attributionGbraid }
            : {}),
        }),
      }),
    ],
  });
}

// Create client lazily (at runtime, not module load time)
let _proxyClient: TRPCClient<AppRouter> | null = null;

export const getProxyClient = (): TRPCClient<AppRouter> => {
  if (!_proxyClient) {
    _proxyClient = createProxyClient();
  }
  return _proxyClient;
};

// Backward compatibility export
// export const proxyClient: TRPCClient<AppRouter> = createProxyClient();
