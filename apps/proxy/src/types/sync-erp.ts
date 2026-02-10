/**
 * Sync ERP Local Contract
 * matches @sync-erp/api/src/trpc/router.tsAppRouter logic
 */

import type { AnyRouter } from "@trpc/server";

export interface BaseAddressFields {
  street?: string | null;
  kelurahan?: string | null;
  kecamatan?: string | null;
  kota?: string | null;
  provinsi?: string | null;
  zip?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}

export interface CreateOrderInput extends BaseAddressFields {
  companyId: string;
  partnerId: string;
  rentalStartDate: Date;
  rentalEndDate: Date;
  items: Array<{
    rentalItemId?: string; // For single items
    rentalBundleId?: string; // For package bundles
    quantity: number;
    // Metadata for auto-creation
    name?: string;
    pricePerDay?: number;
    category?: "package" | "mattress" | "accessory";
    components?: string[];
  }>;
  notes?: string;
  deliveryFee?: number;
  deliveryAddress?: string;
  paymentMethod?: string;
  discountAmount?: number;
  discountLabel?: string;
}

export interface CreatePartnerInput extends BaseAddressFields {
  companyId: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
}

export interface OrderResponse {
  id: string;
  orderNumber: string;
  publicToken: string;
  status: string;
  createdAt: string;
}

export interface UpdateOrderInput {
  token: string;
  customerName?: string;
  customerPhone?: string;
  rentalStartDate?: Date;
  rentalEndDate?: Date;
  notes?: string;
  deliveryFee?: number;
  deliveryAddress?: string;
  street?: string;
  kelurahan?: string;
  kecamatan?: string;
  kota?: string;
  provinsi?: string;
  zip?: string;
  latitude?: number;
  longitude?: number;
  paymentMethod?: string;
  discountAmount?: number;
  discountLabel?: string;
  items?: Array<{
    rentalItemId?: string;
    rentalBundleId?: string;
    quantity: number;
    name?: string;
    pricePerDay?: number;
    category?: 'package' | 'mattress' | 'accessory';
    components?: string[];
  }>;
}

export interface UpdateOrderResponse {
  id: string;
  orderNumber: string;
  publicToken: string;
  status: string;
  totalAmount: number;
}

export interface PartnerResponse {
  id: string;
  name: string;
  phone: string;
}

export interface ConfirmPaymentInput {
  token: string;
  paymentMethod: "qris" | "transfer" | "gopay";
  reference?: string;
}

export interface ConfirmPaymentResponse {
  success: boolean;
  orderNumber: string;
  rentalPaymentStatus: string;
  paymentClaimedAt: Date;
}

export type RentalPaymentStatus =
  | "PENDING"
  | "AWAITING_CONFIRM"
  | "CONFIRMED"
  | "FAILED";
export type OrderStatusType =
  | "DRAFT"
  | "CONFIRMED"
  | "ACTIVE"
  | "COMPLETED"
  | "CANCELLED";

export interface OrderByTokenResponse extends BaseAddressFields {
  id: string;
  orderNumber: string;
  status: OrderStatusType;
  rentalStartDate: string;
  rentalEndDate: string;
  subtotal: number;
  totalAmount: number;
  depositAmount: number;
  deliveryFee: number | null;
  deliveryAddress: string | null;
  street: string | null;
  kelurahan: string | null;
  kecamatan: string | null;
  kota: string | null;
  provinsi: string | null;
  zip: string | null;
  latitude: number | null;
  longitude: number | null;
  paymentMethod: string | null;
  discountAmount: number | null;
  discountLabel: string | null;
  orderSource: string | null;
  rentalPaymentStatus: RentalPaymentStatus;
  paymentClaimedAt: string | null;
  paymentConfirmedAt: string | null;
  paymentReference: string | null;
  paymentFailedAt: string | null;
  paymentFailReason: string | null;
  partner: {
    name: string;
    phone: string;
    address?: string;
  } & BaseAddressFields;
  items: Array<{
    name: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
    rentalItemId?: string | null;
    rentalBundleId?: string | null;
  }>;
}

// ----------------------------------------------------
// The Router Contract
// ----------------------------------------------------
export type SyncErpRouter = AnyRouter & {
  publicRental: {
    getByToken: {
      query: (input: { token: string }) => Promise<OrderByTokenResponse>;
    };
    createOrder: {
      mutation: (input: CreateOrderInput) => Promise<OrderResponse>;
    };
    findOrCreatePartner: {
      mutation: (input: CreatePartnerInput) => Promise<PartnerResponse>;
    };
    confirmPayment: {
      mutation: (input: ConfirmPaymentInput) => Promise<ConfirmPaymentResponse>;
    };
    confirmPaymentByOrderNumber: {
      mutation: (input: {
        orderNumber: string;
        paymentMethod: string;
        transactionId?: string;
        amount?: number;
      }) => Promise<{
        success: boolean;
        orderNumber: string;
        status: string;
      }>;
    };
    updateOrder: {
      mutation: (input: UpdateOrderInput) => Promise<UpdateOrderResponse>;
    };
    deleteOrder: {
      mutation: (input: { id: string }) => Promise<{ success: boolean }>;
    };
  };
};
