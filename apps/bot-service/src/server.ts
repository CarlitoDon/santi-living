import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
const allowedOrigins = [
  "https://santiliving.com",
  "https://www.santiliving.com",
  "http://localhost:4321", // Frontend Dev
  "http://localhost:3000", // Backend Dev
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        // Optional: Allow Railway internal domains or previews if needed
        // For now, strict whitelist
        const msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(bodyParser.json());

// Helper to determine start time
const startTime = new Date();

// Health check endpoint
// Health check endpoint
app.get("/", (req, res) => {
  res.status(200).send("Bot is running!");
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    startedAt: startTime.toISOString(),
    service: "santi-living-bot",
  });
});

import { getStatus } from "./api/status";
import * as trpcExpress from "@trpc/server/adapters/express";
import { appRouter } from "./trpc";
import { createContext } from "./trpc/trpc";

app.use(
  "/api/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

app.get("/status", getStatus);

import { sendOrder } from "./api/send-order";
import { sendMessage } from "./api/send-message";
import { authenticateApiKey } from "./middleware/auth";

app.post("/send-order", authenticateApiKey, sendOrder);
app.post("/send-message", authenticateApiKey, sendMessage);

// Start server function (to be called from index.ts)
export const startServer = () => {
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);

    // Initialize Bot
    // We import dynamically or normally here, but we need circular dep handling
    // For now, let's assume index.ts handles the wiring or we do it here if deps are clean
  });
  return app;
};

export default app;
