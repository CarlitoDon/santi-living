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

interface CreateQrisChargeInput {
  order_id: string;
  gross_amount: number;
  customer_details?: {
    first_name: string;
    last_name?: string;
    email?: string;
    phone?: string;
  };
}

/**
 * Create QRIS charge using Core API
 * This bypasses Snap to force QR display on mobile
 */
export const createQrisCharge = async (
  _input: CreateQrisChargeInput,
): Promise<{
  qrCodeUrl: string;
  qrString: string;
  transactionId: string;
  orderId: string;
  expiryTime: string;
}> => {
  getMidtransCredentials();

  throw new Error(
    "QRIS Core API is currently disabled in Production. Please use Snap.",
  );
  /* 
  // DEPRECATED: Disabled because it requires manual activation by Midtrans support.
  // We are using Snap fallback instead.
  
  const parameter = {
    payment_type: "qris",
    transaction_details: {
      order_id: input.order_id,
      gross_amount: input.gross_amount,
    },
    // qris: {
    //   acquirer: "gopay", // Removed to allow default Midtrans acquirer routing
    // },
    custom_expiry: {
      expiry_duration: 15,
      unit: "minute",
    },
  };

  console.log("[Midtrans Core API] Creating QRIS charge:", parameter);

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = (await coreApi.charge(parameter)) as QrisChargeResponse;
    console.log("[Midtrans Core API] QRIS charge response:", response);

    // Find the QR code URL from actions
    const qrAction = response.actions?.find(
      (a) => a.name === "generate-qr-code",
    );
    const qrCodeUrl = qrAction?.url || "";

    // Calculate expiry time (15 minutes from now)
    const expiryTime = new Date(Date.now() + 15 * 60 * 1000).toISOString();

    return {
      qrCodeUrl,
      qrString: response.qr_string,
      transactionId: response.transaction_id,
      orderId: response.order_id,
      expiryTime,
    };
  } catch (error) {
    console.error("[Midtrans Core API] Failed to create QRIS charge:", error);
    throw error;
  }
  */
};
