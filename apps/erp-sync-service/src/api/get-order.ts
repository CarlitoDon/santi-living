import type { Request, Response } from "express";
import { getOrderByToken } from "../services/erp-client";
import type { OrderStatus } from "../types/order";

export const getOrder = async (req: Request, res: Response) => {
  const token = req.params.token as string;

  if (!token || token.length < 10) {
    return res.status(400).json({
      error: "Invalid token",
      message: "Token pesanan tidak valid",
    });
  }

  try {
    const order = await getOrderByToken(token);

    if (!order) {
      return res.status(404).json({
        error: "Not Found",
        message: "Pesanan tidak ditemukan",
      });
    }

    // Map to public-safe response with all separate address fields
    const response: OrderStatus = {
      orderNumber: order.orderNumber,
      status: order.status as OrderStatus["status"],
      customerName: order.partner.name,
      items: order.items.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        pricePerDay: item.unitPrice,
      })),
      rentalStartDate: order.rentalStartDate,
      rentalEndDate: order.rentalEndDate,
      subtotal: order.subtotal,
      totalAmount: order.totalAmount,
      depositAmount: order.depositAmount,

      // Separate address fields
      deliveryFee: order.deliveryFee,
      deliveryAddress: order.deliveryAddress,
      street: order.street,
      kelurahan: order.kelurahan,
      kecamatan: order.kecamatan,
      kota: order.kota,
      provinsi: order.provinsi,
      zip: order.zip,
      latitude: order.latitude,
      longitude: order.longitude,
      paymentMethod: order.paymentMethod,
      discountAmount: order.discountAmount,
      discountLabel: order.discountLabel,

      createdAt: new Date().toISOString(),
    };

    return res.status(200).json(response);
  } catch (error: unknown) {
    console.error("Failed to get order:", error);
    const message =
      error instanceof Error ? error.message : "Gagal mengambil data pesanan";
    return res.status(500).json({
      error: "Failed to fetch order",
      message,
    });
  }
};
