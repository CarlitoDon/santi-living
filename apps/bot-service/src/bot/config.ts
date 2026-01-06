import { Client, LocalAuth } from "whatsapp-web.js";
import path from "path";

// Define session path inside the app directory
const SESSION_PATH = path.resolve(__dirname, "../../.wwebjs_auth");

export const createClient = (): Client => {
  const redisUrl = process.env.REDIS_URL || process.env.REDISPRIVATEURL;
  let authStrategy;

  if (redisUrl) {
    const { RemoteAuth } = require("whatsapp-web.js");
    const { RedisStore } = require("./redis-store");
    const Redis = require("ioredis");

    const store = new RedisStore(new Redis(redisUrl));
    authStrategy = new RemoteAuth({
      store: store,
      backupSyncIntervalMs: 300000, // 5 minutes
    });
    console.log("Using RemoteAuth with Redis");
  } else {
    authStrategy = new LocalAuth({
      dataPath: SESSION_PATH,
    });
    console.log("Using LocalAuth");
  }

  return new Client({
    authStrategy,
    puppeteer: {
      headless: true,
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--no-first-run",
        "--no-zygote",
        "--disable-gpu",
      ],
    },
  });
};
