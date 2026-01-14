/**
 * TRPC Initialization
 *
 * Base setup for TRPC server in erp-sync-service.
 */
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import type { Request, Response } from "express";

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
  const apiKey = process.env.API_KEY || "santi_rental_secret_2026";

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Missing authorization header",
    });
  }

  const token = authHeader.substring(7);
  if (token !== apiKey) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Invalid API key",
    });
  }

  return next({ ctx });
});

// Protected procedure - requires valid API key
export const protectedProcedure = t.procedure.use(isAuthed);
