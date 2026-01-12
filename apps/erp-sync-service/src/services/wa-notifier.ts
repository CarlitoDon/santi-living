interface WaNotifyPayload {
  customerWhatsapp: string;
  orderNumber: string;
  orderUrl: string;
  customerName: string;
}

const getBotServiceUrl = () => {
  return process.env.BOT_SERVICE_URL || "http://localhost:3000";
};

const getBotApiKey = () => {
  return process.env.BOT_SERVICE_API_KEY || "";
};

export async function sendOrderConfirmation(payload: WaNotifyPayload) {
  const baseUrl = getBotServiceUrl();
  const apiKey = getBotApiKey();

  const message = `Halo ${payload.customerName}! 👋

Pesanan sewa kasur Anda telah kami terima dengan nomor: *${payload.orderNumber}*

Anda dapat melihat status pesanan di:
${payload.orderUrl}

Tim kami akan segera menghubungi Anda untuk konfirmasi.

Terima kasih telah memilih Santi Living! 🙏`;

  const response = await fetch(`${baseUrl}/send-message`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      phone: payload.customerWhatsapp,
      message,
    }),
  });

  if (!response.ok) {
    const errorData = (await response.json()) as { message?: string };
    throw new Error(errorData.message || "Failed to send WA notification");
  }

  return response.json();
}

// For admin-triggered notifications with order link
export async function sendOrderLinkToCustomer(payload: WaNotifyPayload) {
  const baseUrl = getBotServiceUrl();
  const apiKey = getBotApiKey();

  const message = `Halo ${payload.customerName}! 👋

Ini link untuk melihat status pesanan Anda:
${payload.orderUrl}

Pesanan: *${payload.orderNumber}*

Anda bisa akses halaman ini kapan saja untuk melihat status pengiriman dan pembayaran.

Terima kasih! 🙏`;

  const response = await fetch(`${baseUrl}/send-message`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      phone: payload.customerWhatsapp,
      message,
    }),
  });

  if (!response.ok) {
    const errorData = (await response.json()) as { message?: string };
    throw new Error(errorData.message || "Failed to send WA notification");
  }

  return response.json();
}
