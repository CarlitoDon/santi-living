import { OrderPayload } from "../types/order";

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(val);
};

export const formatOrderMessage = (data: OrderPayload): string => {
  const packageLabel = data.isPackage
    ? "Paket (Kasur + Bantal + Selimut)"
    : "Kasur Saja";

  let message = `Halo, saya mau sewa *${packageLabel}*:\n\n`;

  // List items
  message += `Kasur:\n`;
  data.items.forEach((item) => {
    message += `• ${item.quantity}x ${item.name} @ ${formatCurrency(
      item.pricePerDay
    )}/hari\n`;
  });

  const totalQuantity = data.items.reduce((sum, i) => sum + i.quantity, 0);

  message += `\nTotal: ${totalQuantity} unit\n`;
  message += `Tanggal: ${data.orderDate} (${data.duration} hari)\n`;
  message += `Biaya Sewa: ${formatCurrency(
    data.totalPrice - data.deliveryFee
  )}\n`;

  if (data.deliveryFee > 0) {
    message += `Ongkir: ${formatCurrency(data.deliveryFee)}\n`;
  } else {
    message += `Ongkir: Gratis\n`;
  }

  message += `Total Biaya: ${formatCurrency(data.totalPrice)}\n\n`;
  message += `- Nama: ${data.customerName}\n`;
  message += `- Alamat: ${data.deliveryAddress}\n`;

  if (data.notes && data.notes.trim()) {
    message += `- Catatan: ${data.notes}\n`;
  }

  message += `\nMohon konfirmasi ketersediaan. Terima kasih!`;

  return message;
};
