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

  let message = `Halo Kak *${data.customerName}*! 👋\n`;
  message += `Terima kasih sudah memesan di *Sewa Kasur Jogja by Santi Mebel*.\n\n`;
  message += `Pesanan Anda untuk *${packageLabel}* telah kami terima dengan rincian berikut:\n\n`;

  // List items
  message += `*Daftar Barang:*\n`;
  data.items.forEach((item) => {
    message += `• ${item.quantity}x ${item.name} @ ${formatCurrency(
      item.pricePerDay
    )}/hari\n`;
  });

  const totalQuantity = data.items.reduce((sum, i) => sum + i.quantity, 0);

  message += `\n*Detail Sewa:*\n`;
  message += `- Total Kasur: ${totalQuantity} unit\n`;
  message += `- Tanggal Mulai: ${data.orderDate}\n`;
  message += `- Durasi: ${data.duration} hari\n`;
  message += `- Biaya Sewa: ${formatCurrency(
    data.totalPrice - data.deliveryFee
  )}\n`;

  if (data.deliveryFee > 0) {
    message += `- Ongkir: ${formatCurrency(data.deliveryFee)}\n`;
  } else {
    message += `- Ongkir: Gratis (Free)\n`;
  }

  message += `- *Total Pembayaran: ${formatCurrency(data.totalPrice)}*\n\n`;

  message += `*Detail Pengiriman:*\n`;
  message += `- Nama: ${data.customerName}\n`;
  message += `- Alamat: ${data.deliveryAddress}\n`;

  if (data.notes && data.notes.trim()) {
    message += `- Catatan: ${data.notes}\n`;
  }

  message += `\nAdmin kami akan segera menghubungi Kakak kembali untuk konfirmasi pengiriman. Terima kasih! 🙏`;

  return message;
};
