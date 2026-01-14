import express from "express";
import cors from "cors";
import * as trpcExpress from "@trpc/server/adapters/express";
import { appRouter } from "./trpc";
import type { Context } from "./trpc/trpc";
import { midtransWebhook } from "./webhooks/midtrans";

export function createServer() {
  const app = express();

  // Middleware
  const allowedOrigins = (
    process.env.CORS_ORIGINS || "http://localhost:4321,http://localhost:3000"
  ).split(",");

  app.use(
    cors({
      origin: allowedOrigins,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );
  app.use(express.json());

  // Health check (public)
  app.get("/health", (req, res) => {
    res.json({ status: "ok", service: "erp-service" });
  });

  // Webhooks
  app.post("/api/webhooks/midtrans", midtransWebhook);

  // TRPC Endpoints
  app.use(
    "/api/trpc",
    trpcExpress.createExpressMiddleware({
      router: appRouter,
      createContext: ({ req, res }): Context => ({ req, res }),
    })
  );

  return app;
}
