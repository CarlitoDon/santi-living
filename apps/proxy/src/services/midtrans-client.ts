import midtransClient from "midtrans-client";

const isProduction = process.env.MIDTRANS_IS_PRODUCTION === "true";

// Initialize Snap API client
const serverKey = process.env.MIDTRANS_SERVER_KEY || "";
const clientKey = process.env.MIDTRANS_CLIENT_KEY || "";

if (!serverKey) {
  console.error("❌ [Midtrans Client] MIDTRANS_SERVER_KEY is missing!");
  process.exit(1); // Fail fast
}

if (!clientKey) {
  console.error("❌ [Midtrans Client] MIDTRANS_CLIENT_KEY is missing!");
  process.exit(1); // Fail fast
}

const snap = new midtransClient.Snap({
  isProduction,
  serverKey,
  clientKey,
});

interface SnapTransactionDetails {
  order_id: string;
  gross_amount: number;
}

interface CustomerDetails {
  first_name: string;
  last_name?: string;
  email: string;
  phone: string;
}

interface CreateSnapTokenInput {
  transaction_details: SnapTransactionDetails;
  customer_details: CustomerDetails;
  item_details?: any[];
}

export const createSnapToken = async (input: CreateSnapTokenInput) => {
  // Configured specifically for Dynamic QRIS (GoPay/QRIS)
  const parameter = {
    transaction_details: input.transaction_details,
    credit_card: {
      secure: true,
    },
    customer_details: input.customer_details,
    item_details: input.item_details,
    // Enable only QRIS and GoPay to force QR/Deeplink flow
    enabled_payments: ["gopay", "qris"],
    expiry: {
      unit: "minutes",
      duration: 15, // Short expiry for dynamic QR
    },
  };

  try {
    const transaction = await snap.createTransaction(parameter);
    return transaction.token;
  } catch (error) {
    console.error("[Midtrans] Failed to create Snap token:", error);
    throw error;
  }
};
