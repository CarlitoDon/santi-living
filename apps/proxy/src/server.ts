import express from "express";
import cors from "cors";
import * as trpcExpress from "@trpc/server/adapters/express";
import { appRouter } from "./trpc";
import type { Context } from "./trpc/trpc";
import { midtransWebhook } from "./webhooks/midtrans";
import {
  notifyAdminWebhook,
  notifyPaymentStatusWebhook,
} from "./webhooks/notify";
import { authMiddleware } from "./middleware/auth";
import { companyScopeMiddleware } from "./middleware/company-scope";
import { webhookIdempotencyMiddleware } from "./middleware/webhook-idempotency";

export function createServer() {
  const app = express();

  // Middleware
  const allowedOrigins = (
    process.env.CORS_ALLOWED_ORIGINS ||
    "http://localhost:4321,http://localhost:3000"
  ).split(",");

  app.use(
    cors({
      origin: allowedOrigins,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: [
        "Content-Type",
        "Authorization",
        "X-Company-Id",
        "X-Correlation-Id",
        "Idempotency-Key",
        "X-Attribution-Source",
        "X-Attribution-Medium",
        "X-Attribution-Campaign",
        "X-Attribution-Gclid",
        "X-Attribution-Fbclid",
        "X-Attribution-Wbraid",
        "X-Attribution-Gbraid",
      ],
    }),
  );
  app.use(express.json());

  // Health check (public)
  app.get("/health", (_req, res) => {
    res.json({ status: "ok", service: "proxy" });
  });

  // Webhooks

  // Webhooks
  app.post("/api/webhooks/midtrans", midtransWebhook);
  app.post(
    "/api/orders/:token/notify-admin",
    authMiddleware,
    companyScopeMiddleware,
    webhookIdempotencyMiddleware,
    notifyAdminWebhook,
  );
  app.post(
    "/api/orders/:token/notify-payment",
    authMiddleware,
    companyScopeMiddleware,
    webhookIdempotencyMiddleware,
    notifyPaymentStatusWebhook,
  );

  // TRPC Endpoints
  app.use(
    "/api/trpc",
    trpcExpress.createExpressMiddleware({
      router: appRouter,
      createContext: ({ req, res }): Context => ({ req, res }),
    }),
  );

  return app;
}
