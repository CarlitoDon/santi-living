/**
 * TRPC App Router
 *
 * Merges all routers and exports the AppRouter type.
 */
import { router } from "./trpc";
import { orderRouter } from "./routers/order.router";
import { notificationRouter } from "./routers/notification.router";

// Merge all routers
export const appRouter = router({
  order: orderRouter,
  notification: notificationRouter,
});

// Export type for client consumption
export type AppRouter = typeof appRouter;
