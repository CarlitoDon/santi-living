/**
 * App-facing aliases for the local publicRental contract snapshot.
 *
 * Keep this file thin: infer from public-rental.ts so there is only one local
 * source of truth for sync-erp request/response shapes.
 */
import type {
  inferRouterInputs,
  inferRouterOutputs,
} from "@trpc/server";
import type { PublicRentalRouter } from "./public-rental";

type PublicRentalInputs = inferRouterInputs<PublicRentalRouter>;
type PublicRentalOutputs = inferRouterOutputs<PublicRentalRouter>;

export type CreateOrderInput = PublicRentalInputs["createOrder"];
export type CreatePartnerInput = PublicRentalInputs["findOrCreatePartner"];
export type ConfirmPaymentInput = PublicRentalInputs["confirmPayment"];
export type UpdateOrderInput = PublicRentalInputs["updateOrder"];

export type OrderResponse = PublicRentalOutputs["createOrder"];
export type PartnerResponse = PublicRentalOutputs["findOrCreatePartner"];
export type ConfirmPaymentResponse = PublicRentalOutputs["confirmPayment"];
export type UpdateOrderResponse = PublicRentalOutputs["updateOrder"];
export type OrderByTokenResponse = PublicRentalOutputs["getByToken"];

export const RentalPaymentStatusConst = {
  PENDING: "PENDING",
  AWAITING_CONFIRM: "AWAITING_CONFIRM",
  CONFIRMED: "CONFIRMED",
  FAILED: "FAILED",
} as const;

export type RentalPaymentStatus =
  (typeof RentalPaymentStatusConst)[keyof typeof RentalPaymentStatusConst];

export const OrderStatusConst = {
  DRAFT: "DRAFT",
  CONFIRMED: "CONFIRMED",
  ACTIVE: "ACTIVE",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
} as const;

export type OrderStatusType =
  (typeof OrderStatusConst)[keyof typeof OrderStatusConst];
