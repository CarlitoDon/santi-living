import type { ApiErrorCode } from "./http-error";

type UpstreamApiError = {
  status: number;
  code: ApiErrorCode;
  message: string;
};

const normalizeMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }

  if (typeof error === "string" && error.trim().length > 0) {
    return error;
  }

  return fallback;
};

const readHttpStatus = (error: unknown) => {
  if (!error || typeof error !== "object") {
    return null;
  }

  const maybeData = error as { data?: { httpStatus?: number } };
  if (typeof maybeData.data?.httpStatus === "number") {
    return maybeData.data.httpStatus;
  }

  return null;
};

const guessStatusFromMessage = (message: string) => {
  const lower = message.toLowerCase();

  if (
    lower.includes("invalid") ||
    lower.includes("validation") ||
    lower.includes("zod") ||
    lower.includes("not found") ||
    lower.includes("bad request") ||
    lower.includes("draft")
  ) {
    return 400;
  }

  if (lower.includes("forbidden") || lower.includes("scope mismatch")) {
    return 403;
  }

  if (lower.includes("unauthorized") || lower.includes("authentication")) {
    return 401;
  }

  return 500;
};

const mapStatusToCode = (status: number): ApiErrorCode => {
  if (status === 403) {
    return "FORBIDDEN";
  }

  if (status >= 400 && status < 500) {
    return "BAD_REQUEST";
  }

  return "UPSTREAM_ERROR";
};

export const mapUpstreamError = (
  error: unknown,
  fallbackMessage: string,
): UpstreamApiError => {
  const message = normalizeMessage(error, fallbackMessage);
  const status = readHttpStatus(error) || guessStatusFromMessage(message);

  return {
    status,
    code: mapStatusToCode(status),
    message,
  };
};
