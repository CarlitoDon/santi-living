/**
 * ERP Client
 *
 * HTTP client to communicate with sync-erp publicRental API.
 * Since we don't share types between repos, we use plain fetch.
 */

const getBaseUrl = () => {
  return process.env.SYNC_ERP_API_URL || "http://localhost:4000/trpc";
};

export interface CreateOrderInput {
  companyId: string;
  partnerId: string;
  rentalStartDate: Date;
  rentalEndDate: Date;
  items: Array<{ rentalItemId: string; quantity: number }>;
  notes?: string;

  // Santi Living integration fields (all separate)
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
}

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

export interface OrderResponse {
  id: string;
  orderNumber: string;
  publicToken: string;
  status: string;
  createdAt: string;
}

export interface PartnerResponse {
  id: string;
  name: string;
  phone: string;
}

export interface OrderByTokenResponse {
  orderNumber: string;
  status: string;
  rentalStartDate: string;
  rentalEndDate: string;
  subtotal: number;
  totalAmount: number;
  depositAmount: number;

  // Santi Living fields (all separate)
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

  partner: {
    name: string;
    phone: string;
    address?: string;
    street?: string;
    kelurahan?: string;
    kecamatan?: string;
    kota?: string;
    provinsi?: string;
    zip?: string;
  };
  items: Array<{
    name: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
  }>;
}

// Helper for tRPC batch calls
async function trpcQuery<T>(procedure: string, input: unknown): Promise<T> {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}/${procedure}?batch=1&input=${encodeURIComponent(
    JSON.stringify({ 0: input })
  )}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = (await response.json()) as { message?: string };
    throw new Error(errorData.message || "tRPC query failed");
  }

  const data = (await response.json()) as Array<{ result: { data: T } }>;
  return data[0].result.data;
}

async function trpcMutate<T>(procedure: string, input: unknown): Promise<T> {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}/${procedure}?batch=1`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ 0: input }),
  });

  if (!response.ok) {
    const errorData = (await response.json()) as { message?: string };
    throw new Error(errorData.message || "tRPC mutation failed");
  }

  const data = (await response.json()) as Array<{ result: { data: T } }>;
  return data[0].result.data;
}

// Typed wrapper functions for rental operations
export async function createRentalOrder(
  input: CreateOrderInput
): Promise<OrderResponse> {
  return trpcMutate<OrderResponse>("publicRental.createOrder", input);
}

export async function getOrderByToken(
  token: string
): Promise<OrderByTokenResponse> {
  return trpcQuery<OrderByTokenResponse>("publicRental.getByToken", { token });
}

export async function findOrCreatePartner(
  input: CreatePartnerInput
): Promise<PartnerResponse> {
  return trpcMutate<PartnerResponse>("publicRental.findOrCreatePartner", input);
}
