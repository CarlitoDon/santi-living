import type { OrderPayload } from "@/types/order";
import config from "@/data/config.json";

export type { OrderPayload };

export async function submitOrder(payload: OrderPayload) {
  // Call local proxy (which adds the API key and forwards to ERP)
  const response = await fetch("/api/submit-order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.message || errorData.error || "Gagal mengirim pesanan",
    );
  }

  return await response.json();
}

export async function getBotStatus() {
  const baseUrl = import.meta.env.PUBLIC_BOT_API_URL || config.botApi.baseUrl;
  const response = await fetch(`${baseUrl}/status`);
  if (!response.ok) throw new Error("Gagal mengambil status bot");
  return await response.json();
}
