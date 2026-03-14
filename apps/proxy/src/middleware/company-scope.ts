import type { NextFunction, Request, Response } from "express";
import { parseCompanyScopeHeader, requireSantiLivingCompanyId } from "../config/runtime";
import { sendHttpError } from "../utils/http-error";

export const companyScopeMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let configuredCompanyId = "";

  try {
    configuredCompanyId = requireSantiLivingCompanyId();
  } catch (error) {
    return sendHttpError(
      res,
      503,
      "SERVICE_UNAVAILABLE",
      error instanceof Error
        ? error.message
        : "Company scope is not configured",
    );
  }

  const requestedCompanyId = parseCompanyScopeHeader(req.headers["x-company-id"]);

  if (!requestedCompanyId) {
    return sendHttpError(
      res,
      400,
      "BAD_REQUEST",
      "Missing required header: X-Company-Id",
    );
  }

  if (requestedCompanyId !== configuredCompanyId) {
    return sendHttpError(res, 403, "FORBIDDEN", "Company scope mismatch");
  }

  next();
};
