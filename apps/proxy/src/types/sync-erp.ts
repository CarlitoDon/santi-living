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

export interface CreatePartnerInput {
  companyId: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  street?: string;
  kelurahan?: string;
  kecamatan?: string;
  kota?: string;
  provinsi?: string;
  zip?: string;
  latitude?: number;
  longitude?: number;
}

export interface PartnerResponse {
  id: string;
  companyId?: string;
  type?: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  street: string | null;
  kelurahan: string | null;
  kecamatan: string | null;
  kota: string | null;
  provinsi: string | null;
  zip: string | null;
  latitude: number | null;
  longitude: number | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface CreateOrderInput {
  companyId: string;
  partnerId: string;
  rentalStartDate: Date;
  rentalEndDate: Date;
  items: Array<{
    rentalItemId?: string;
    rentalBundleId?: string;
    quantity: number;
    name?: string;
    pricePerDay?: number;
    category?: "package" | "mattress" | "accessory";
    components?: string[];
  }>;
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
  paymentMethod?: "qris" | "transfer" | "gopay";
  discountAmount?: number;
  discountLabel?: string;
  externalId?: string;
  externalSource?: string;
  metadata?: Record<string, unknown>;
}

export interface OrderResponse {
  id: string;
  orderNumber: string;
  publicToken: string;
  status: OrderStatusType;
  rentalPaymentStatus?: RentalPaymentStatus;
  totalAmount?: number;
  createdAt: string | Date;
  orderUrl?: string;
}

export interface OrderByTokenResponse {
  id: string;
  orderNumber: string;
  status: OrderStatusType;
  publicToken: string;
  rentalStartDate: string | Date;
  rentalEndDate: string | Date;
  subtotal: number | null;
  totalAmount: number | null;
  depositAmount: number | null;
  notes: string | null;
  createdAt: string | Date;
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
  paymentClaimedAt: string | Date | null;
  paymentConfirmedAt: string | Date | null;
  paymentReference: string | null;
  paymentFailedAt: string | Date | null;
  paymentFailReason: string | null;
  partner: {
    name: string;
    phone: string | null;
    address: string | null;
    street: string | null;
    kelurahan: string | null;
    kecamatan: string | null;
    kota: string | null;
    provinsi: string | null;
    zip: string | null;
    latitude: number | null;
    longitude: number | null;
  };
  items: Array<{
    rentalItemId?: string | null;
    rentalBundleId?: string | null;
    name: string;
    quantity: number;
    unitPrice: number | null;
    subtotal: number | null;
  }>;
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
  paymentMethod?: "qris" | "transfer" | "gopay";
  discountAmount?: number;
  discountLabel?: string;
  items?: CreateOrderInput["items"];
}

export interface UpdateOrderResponse {
  id: string;
  orderNumber: string;
  publicToken: string;
  status: OrderStatusType;
  totalAmount?: number;
}

export interface ConfirmPaymentInput {
  token: string;
  paymentMethod: "qris" | "transfer" | "gopay";
  reference?: string;
}

export interface ConfirmPaymentResponse {
  success: boolean;
  orderNumber: string;
  rentalPaymentStatus: RentalPaymentStatus;
  paymentClaimedAt: string | Date | null;
}
