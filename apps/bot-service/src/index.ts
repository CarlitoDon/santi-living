import { startServer } from "./server";
import { BotSession } from "./bot/session";
import { createClient } from "./bot/config";
import { attachHandlers } from "./bot/handlers";

// Start Express Server
startServer();

// Start Bot
const bot = BotSession.getInstance();
bot.initialize(createClient, attachHandlers);
