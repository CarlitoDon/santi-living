import { createTRPCClient, httpBatchLink, type TRPCClient } from "@trpc/client";
import superjson from "superjson";
import type { AppRouter } from "../types/bot-router";
import { getSyncErpBotTrpcUrl } from "../config/runtime";

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
      url: getSyncErpBotTrpcUrl(),
      transformer: superjson,
      headers: () => ({
        Authorization: `Bearer ${getBotSecret()}`,
      }),
    }),
  ],
});
