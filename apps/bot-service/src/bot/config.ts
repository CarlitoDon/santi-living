import { Client, LocalAuth } from "whatsapp-web.js";
import path from "path";

// Define session path inside the app directory
const SESSION_PATH = path.resolve(__dirname, "../../.wwebjs_auth");

export const createClient = (): Client => {
  return new Client({
    authStrategy: new LocalAuth({
      dataPath: SESSION_PATH,
    }),
    puppeteer: {
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    },
  });
};
