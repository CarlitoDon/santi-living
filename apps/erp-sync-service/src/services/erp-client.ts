/**
 * ERP Client
 *
 * HTTP client to communicate with sync-erp publicRental API.
 * Since we don't share types between repos, we use plain fetch.
 */

const getBaseUrl = () => {
  return process.env.SYNC_ERP_API_URL || "http://localhost:3001/api/trpc";
};

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
    components?: string[]; // Bundle component labels: ["kasur busa", "sprei", "bantal", "selimut"]
  }>;
  notes?: string;

  // Santi Living integration fields (all separate)
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

export interface PartnerResponse {
  id: string;
  name: string;
  phone: string;
}

export interface OrderByTokenResponse extends BaseAddressFields {
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
  // Address fields inherited from BaseAddressFields (allowing null)
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
  } & BaseAddressFields;
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
  // tRPC v11+ batch format: {"0": {"json": input}}
  const url = `${baseUrl}/${procedure}?batch=1&input=${encodeURIComponent(
    JSON.stringify({ 0: { json: input } })
  )}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = (await response.json()) as TrpcErrorResponse[];

  // Check for tRPC error in response
  if (data[0]?.error) {
    const errorMsg =
      data[0].error.json?.message ||
      data[0].error.json?.data?.code ||
      "tRPC query failed";
    throw new Error(errorMsg);
  }

  if (!response.ok) {
    throw new Error("tRPC request failed with status " + response.status);
  }

  // tRPC v11+ wraps result in {json: ...}
  const result = (data[0] as { result: { data: { json: T } } }).result.data;
  return result.json ?? (result as unknown as T);
}

interface TrpcErrorResponse {
  error?: {
    json?: {
      message?: string;
      code?: number;
      data?: {
        code?: string;
      };
    };
  };
  result?: {
    data: unknown;
  };
}

async function trpcMutate<T>(procedure: string, input: unknown): Promise<T> {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}/${procedure}?batch=1`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    // tRPC batch format: {"0": {"json": input}}
    body: JSON.stringify({ 0: { json: input } }),
  });

  const data = (await response.json()) as TrpcErrorResponse[];

  // Check for tRPC error in response
  if (data[0]?.error) {
    const errorMsg =
      data[0].error.json?.message ||
      data[0].error.json?.data?.code ||
      "tRPC mutation failed";
    throw new Error(errorMsg);
  }

  if (!response.ok) {
    throw new Error("tRPC request failed with status " + response.status);
  }

  // tRPC v11+ wraps result in {json: ...}
  const result = (data[0] as { result: { data: { json: T } } }).result.data;
  return result.json ?? (result as unknown as T);
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
