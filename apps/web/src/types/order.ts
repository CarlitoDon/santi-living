/**
 * Order Types - Single Source of Truth
 * Consolidated from api.ts, erp-api.ts, and checkout.ts
 */

/**
 * Address fields for delivery
 */
export interface AddressFields {
  street?: string;
  kelurahan?: string;
  kelurahanKode?: string;
  kecamatan?: string;
  kecamatanKode?: string;
  kota?: string;
  kotaKode?: string;
  provinsi?: string;
  provinsiKode?: string;
  zip?: string;
  lat?: string;
  lng?: string;
}

/**
 * Individual order item
 */
export interface OrderItem {
  id: string;
  name: string;
  category: "package" | "mattress" | "accessory";
  quantity: number;
  pricePerDay: number;
  includes?: string[]; // Bundle components: ["kasur busa", "sprei", "bantal", "selimut"]
}

/**
 * Complete order payload for API submission
 */
export interface OrderPayload {
  orderId?: string;
  customerName: string;
  customerWhatsapp: string;
  deliveryAddress: string;
  addressFields?: AddressFields;
  items: OrderItem[];
  totalPrice: number;
  orderDate: string;
  endDate?: string;
  duration: number;
  deliveryFee: number;
  paymentMethod: "qris" | "transfer" | "gopay";
  notes?: string;
  volumeDiscountAmount?: number;
  volumeDiscountLabel?: string;
  orderUrl?: string; // Link to order tracking page
}

/**
 * Order data stored in session (for checkout flow)
 */
export interface OrderData extends Omit<OrderPayload, "orderId"> {
  orderId?: string;
}

/**
 * ERP Order Response
 */
export interface ErpOrderResponse {
  id: string;
  orderNumber: string;
  publicToken: string;
  status: string;
  createdAt: string;
  orderUrl: string;
}
