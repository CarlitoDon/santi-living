import express from "express";
import cors from "cors";
import { authMiddleware } from "./middleware/auth";
import { createOrder } from "./api/create-order";
import { getOrder } from "./api/get-order";
import { notifyCustomer } from "./api/notify-customer";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());

  // Health check (public)
  app.get("/health", (req, res) => {
    res.json({ status: "ok", service: "erp-sync-service" });
  });

  // Public endpoints (no auth required)
  // Customer order tracking page needs this
  app.get("/api/orders/:token", getOrder);

  // Protected endpoints (require API key)
  // Create order - called by frontend
  app.post("/api/orders", authMiddleware, createOrder);

  // Notify customer - called by admin
  app.post("/api/orders/:token/notify", authMiddleware, notifyCustomer);

  return app;
}
