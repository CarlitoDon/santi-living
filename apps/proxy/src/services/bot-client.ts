import { createTRPCClient, httpBatchLink, type TRPCClient } from "@trpc/client";
import superjson from "superjson";
import type { AppRouter } from "../types/bot-router";

const getBotServiceUrl = () => {
  const url = process.env.SYNC_ERP_BOT_URL || "http://localhost:3000";
  return url.replace(/\/$/, "");
};

const getBotSecret = () => {
  const secret = process.env.SYNC_ERP_BOT_SECRET || "";
  if (!secret) {
    console.warn(`⚠️  [Bot Client] SYNC_ERP_BOT_SECRET NOT SET!`);
  }
  return secret;
};

export const botClient: TRPCClient<AppRouter> = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${getBotServiceUrl()}/api/trpc`,
      transformer: superjson,
      headers: () => ({
        Authorization: `Bearer ${getBotSecret()}`,
      }),
    }),
  ],
});
