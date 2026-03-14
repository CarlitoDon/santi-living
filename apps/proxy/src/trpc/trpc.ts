/**
 * TRPC Initialization
 *
 * Base setup for TRPC server in santi-living proxy.
 * Uses standardized env: PROXY_API_SECRET
 */
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import type { Request, Response } from "express";
import {
  parseBearerToken,
  parseCompanyScopeHeader,
  requireProxyApiSecret,
} from "../config/runtime";

// Context passed to every procedure
export interface Context {
  req: Request;
  res: Response;
}

// Initialize TRPC with superjson transformer
const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

// Base router and procedure
export const router = t.router;
export const publicProcedure = t.procedure;

// Auth middleware - validates API key
const isAuthed = t.middleware(({ ctx, next }) => {
  const authHeader = ctx.req.headers.authorization;
  let apiSecret = "";

  try {
    apiSecret = requireProxyApiSecret();
  } catch (error) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message:
        error instanceof Error ? error.message : "Proxy auth is not configured",
    });
  }

  const token = parseBearerToken(authHeader);

  if (!token) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Missing authorization header",
    });
  }

  if (token !== apiSecret) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Invalid API key",
    });
  }

  const configuredCompanyId = process.env.SANTI_LIVING_COMPANY_ID?.trim();
  const requestedCompanyId = parseCompanyScopeHeader(
    ctx.req.headers["x-company-id"],
  );

  if (
    configuredCompanyId &&
    requestedCompanyId &&
    requestedCompanyId !== configuredCompanyId
  ) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Company scope mismatch",
    });
  }

  return next({ ctx });
});

// Protected procedure - requires valid API key
export const protectedProcedure = t.procedure.use(isAuthed);
