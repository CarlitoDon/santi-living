import type { Request, Response, NextFunction } from "express";
import { parseBearerToken, requireProxyApiSecret } from "../config/runtime";
import { sendHttpError } from "../utils/http-error";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let apiKey = "";

  try {
    apiKey = requireProxyApiSecret();
  } catch (error) {
    return sendHttpError(
      res,
      503,
      "SERVICE_UNAVAILABLE",
      error instanceof Error
        ? error.message
        : "Proxy auth is not configured",
    );
  }

  const authHeader = req.headers.authorization;

  const token = parseBearerToken(authHeader);

  if (!token) {
    return sendHttpError(
      res,
      401,
      "UNAUTHORIZED",
      "Missing authorization header",
    );
  }

  if (token !== apiKey) {
    return sendHttpError(res, 403, "FORBIDDEN", "Invalid API key");
  }

  next();
};
