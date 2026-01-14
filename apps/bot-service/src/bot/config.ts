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

  // Debugging Environment
  console.log("--- DEBUG PUPPETEER CONFIG ---");
  console.log(
    "ENV PUPPETEER_EXECUTABLE_PATH:",
    process.env.PUPPETEER_EXECUTABLE_PATH
  );

  let executablePath = process.env.PUPPETEER_EXECUTABLE_PATH;

  // Try to find chromium dynamically if not set
  if (!executablePath) {
    try {
      const { execSync } = require("child_process");
      const whichChromium = execSync("which chromium").toString().trim();
      if (whichChromium) {
        console.log("Found chromium at:", whichChromium);
        executablePath = whichChromium;
      }
    } catch (e) {
      console.log("Could not find chromium in PATH");
    }
  }

  return new Client({
    authStrategy,
    puppeteer: {
      headless: true,
      executablePath: executablePath || undefined,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--no-first-run",
        "--no-zygote",
        "--disable-gpu",
      ],
      bypassCSP: true, // Needed for some injections
    },
    webVersionCache: {
      type: "remote",
      remotePath:
        "https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html",
    },
  });
};
