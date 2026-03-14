type ImportMetaEnvLike = {
  PUBLIC_PROXY_URL?: string;
  SANTI_PROXY_URL?: string;
  PROXY_API_SECRET?: string;
  PROXY_API_KEY?: string;
};

const readImportMetaEnv = (): ImportMetaEnvLike => {
  return ((import.meta as unknown as { env?: ImportMetaEnvLike }).env || {});
};

const normalizeUrl = (url: string) => url.replace(/\/$/, "");

export const getProxyBaseUrl = () => {
  const importEnv = readImportMetaEnv();

  if (typeof window === "undefined") {
    return normalizeUrl(
      process.env.SANTI_PROXY_URL ||
        process.env.PUBLIC_PROXY_URL ||
        importEnv.PUBLIC_PROXY_URL ||
        importEnv.SANTI_PROXY_URL ||
        "http://localhost:3002",
    );
  }

  return normalizeUrl(importEnv.PUBLIC_PROXY_URL || "http://localhost:3002");
};

export const getProxyTrpcUrl = () => `${getProxyBaseUrl()}/api/trpc`;

export const getProxyApiSecret = () => {
  if (typeof window !== "undefined") {
    return "";
  }

  const importEnv = readImportMetaEnv();
  return (
    process.env.PROXY_API_SECRET ||
    process.env.PROXY_API_KEY ||
    importEnv.PROXY_API_SECRET ||
    importEnv.PROXY_API_KEY ||
    ""
  );
};
