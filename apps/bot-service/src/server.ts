import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
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
app.get("/status", getStatus);

import { sendOrder } from "./api/send-order";
import { authenticateApiKey } from "./middleware/auth";

app.post("/send-order", authenticateApiKey, sendOrder);

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
