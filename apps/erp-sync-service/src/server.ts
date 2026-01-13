import express from "express";
import cors from "cors";
import { authMiddleware } from "./middleware/auth";
import { createOrder } from "./api/create-order";
import { getOrder } from "./api/get-order";
import { notifyCustomer } from "./api/notify-customer";
import { confirmPayment } from "./api/confirm-payment";
import { notifyPaymentStatus } from "./api/notify-payment-status";
import { notifyAdmin } from "./api/notify-admin";

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

  // Confirm payment - called by frontend
  app.post("/api/orders/:token/confirm", authMiddleware, confirmPayment);

  // Notify payment status - called by sync-erp webhook
  app.post(
    "/api/orders/:token/notify-payment",
    authMiddleware,
    notifyPaymentStatus
  );

  // Notify admin - called by sync-erp webhook
  app.post("/api/orders/:token/notify-admin", authMiddleware, notifyAdmin);

  return app;
}
