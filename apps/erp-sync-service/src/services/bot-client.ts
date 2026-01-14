import { createTRPCClient, httpBatchLink, type TRPCClient } from "@trpc/client";
import superjson from "superjson";
import type { AppRouter } from "../../../bot-service/dist/trpc";

// Helper to get Bot Service URL
const getBotServiceUrl = () => {
  return process.env.BOT_SERVICE_URL || "http://localhost:3000";
};

// Helper to get API Key for Bot Service
// Ideally this matches the API_SECRET in bot-service
const getApiKey = () => {
  return process.env.BOT_SERVICE_API_KEY || process.env.API_SECRET || "";
};

export const botClient: TRPCClient<AppRouter> = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${getBotServiceUrl()}/api/trpc`,
      transformer: superjson,
      headers: () => ({
        Authorization: `Bearer ${getApiKey()}`,
      }),
    }),
  ],
});
