import path from "path";
import dotenv from "dotenv";

// Load environment-specific .env file
const envFile =
  process.env.NODE_ENV === "production" ? ".env.production" : ".env";

const envPath = path.resolve(process.cwd(), envFile);
const result = dotenv.config({ path: envPath });

if (result.error) {
  console.warn(`[proxy] Warning: Failed to load ${envFile}`);
} else {
  console.log(`[proxy] Loaded environment from ${envFile}`);
}
import { createServer } from "./server";

// Global error handlers (MUST be at top)
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});

console.log("[proxy] Starting up...");

const PORT = process.env.PORT || 3002;

const app = createServer();

const server = app.listen(PORT, () => {
  console.log(`🚀 proxy running on port ${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/health`);
  console.log(`   API:    http://localhost:${PORT}/api/orders`);
});

// Graceful shutdown to prevent zombie processes
const gracefulShutdown = (signal: string) => {
  console.log(`\n[${signal}] Shutting down gracefully...`);
  server.close(() => {
    console.log("[proxy] Server closed successfully.");
    process.exit(0);
  });
  // Force exit after 5s if server doesn't close
  setTimeout(() => process.exit(1), 5000);
};

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});
