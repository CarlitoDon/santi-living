import midtransClient from "midtrans-client";

const isProduction = process.env.MIDTRANS_IS_PRODUCTION === "true";

const getMidtransCredentials = () => {
  const serverKey = process.env.MIDTRANS_SERVER_KEY || "";
  const clientKey = process.env.MIDTRANS_CLIENT_KEY || "";

  if (!serverKey) {
    throw new Error("MIDTRANS_SERVER_KEY is missing");
  }

  if (!clientKey) {
    throw new Error("MIDTRANS_CLIENT_KEY is missing");
  }

  return { serverKey, clientKey };
};

const createSnapClient = () => {
  const { serverKey, clientKey } = getMidtransCredentials();

  return new midtransClient.Snap({
    isProduction,
    serverKey,
    clientKey,
  });
};

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

interface ItemDetails {
  id?: string;
  name: string;
  price: number;
  quantity: number;
}

interface CreateSnapTokenInput {
  transaction_details: SnapTransactionDetails;
  customer_details: CustomerDetails;
  item_details?: ItemDetails[];
  paymentMethod?: "qris" | "gopay" | "transfer";
}

export const createSnapToken = async (input: CreateSnapTokenInput) => {
  const snap = createSnapClient();
  // Determine enabled payments based on payment method from order
  let enabledPayments: string[];

  if (input.paymentMethod === "gopay") {
    enabledPayments = ["gopay"]; // GoPay - shows deeplink on mobile, QR on desktop
  } else if (input.paymentMethod === "qris") {
    enabledPayments = ["other_qris"]; // Explicitly requested by user
  } else {
    // Default: both options for transfer or unknown
    enabledPayments = ["qris", "gopay", "bank_transfer"];
  }

  const parameter = {
    transaction_details: input.transaction_details,
    credit_card: {
      secure: true,
    },
    customer_details: input.customer_details,
    item_details: input.item_details,
    enabled_payments: enabledPayments,
    expiry: {
      unit: "minutes",
      duration: 15,
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
