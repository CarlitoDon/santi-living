import type { Request, Response } from "express";
import { CreateOrderSchema } from "../types/order";
import { createRentalOrder, findOrCreatePartner } from "../services/erp-client";
import { sendOrderConfirmation, notifyAdminNewOrder } from "../services/wa-notifier";

// Default company ID for Santi Living (maps to Demo Rental in dev)
const SANTI_LIVING_COMPANY_ID =
  process.env.SANTI_LIVING_COMPANY_ID || "demo-company-rental";

export const createOrder = async (req: Request, res: Response) => {
  // 1. Validate input
  const result = CreateOrderSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      error: "Validation Error",
      details: result.error.issues,
    });
  }

  const input = result.data;
  const addressFields = input.addressFields || {};

  try {
    // 2. Find or create partner in sync-erp with all address fields
    const partner = await findOrCreatePartner({
      companyId: SANTI_LIVING_COMPANY_ID,
      name: input.customerName,
      phone: input.customerWhatsapp,
      address: input.deliveryAddress,
      street: addressFields.street,
      kelurahan: addressFields.kelurahan,
      kecamatan: addressFields.kecamatan,
      kota: addressFields.kota,
      provinsi: addressFields.provinsi,
      zip: addressFields.zip,
      latitude: addressFields.lat ? parseFloat(addressFields.lat) : undefined,
      longitude: addressFields.lng ? parseFloat(addressFields.lng) : undefined,
    });

    // 3. Map items to rental items/bundles with metadata for auto-creation
    const rentalItems = input.items.map((item) => {
      console.log(
        `[DEBUG] Processing item: id=${item.id}, category=${item.category}, includes=${item.includes?.join(", ")}`
      );

      // Include metadata for auto-creation in sync-erp
      const baseItem = {
        quantity: item.quantity,
        name: item.name,
        pricePerDay: item.pricePerDay,
        category: item.category,
        components: item.includes, // Pass bundle components for auto-creation
      };

      // Package items use rentalBundleId, others use rentalItemId
      if (item.category === "package") {
        return {
          ...baseItem,
          rentalBundleId: item.id,
        };
      } else {
        return {
          ...baseItem,
          rentalItemId: item.id,
        };
      }
    });

    // 4. Create rental order in sync-erp with ALL separate fields
    const order = await createRentalOrder({
      companyId: SANTI_LIVING_COMPANY_ID,
      partnerId: partner.id,
      rentalStartDate: new Date(input.orderDate),
      rentalEndDate: new Date(input.endDate),
      items: rentalItems,
      notes: input.notes,

      // All address fields separate
      deliveryFee: input.deliveryFee,
      deliveryAddress: input.deliveryAddress,
      street: addressFields.street,
      kelurahan: addressFields.kelurahan,
      kecamatan: addressFields.kecamatan,
      kota: addressFields.kota,
      provinsi: addressFields.provinsi,
      zip: addressFields.zip,
      latitude: addressFields.lat ? parseFloat(addressFields.lat) : undefined,
      longitude: addressFields.lng ? parseFloat(addressFields.lng) : undefined,
      paymentMethod: input.paymentMethod,
      discountAmount: input.volumeDiscountAmount,
      discountLabel: input.volumeDiscountLabel,
    });

    // 5. Generate public URL for customer
    // In dev: use localhost:4321 (Astro), in prod: use santiliving.com
    const isDev = process.env.NODE_ENV !== "production";
    const baseUrl =
      process.env.PUBLIC_BASE_URL ||
      (isDev ? "http://localhost:4321" : "https://santiliving.com");
    const orderUrl = `${baseUrl}/sewa-kasur/pesanan/${order.publicToken}`;

    // 6. Send WhatsApp Notification with FULL order details (uses detailed template)
    try {
      await sendOrderConfirmation({
        orderId: order.orderNumber,
        customerName: input.customerName,
        customerWhatsapp: input.customerWhatsapp,
        deliveryAddress: input.deliveryAddress,
        addressFields: {
          street: addressFields.street,
          kelurahan: addressFields.kelurahan,
          kecamatan: addressFields.kecamatan,
          kota: addressFields.kota,
          provinsi: addressFields.provinsi,
          zip: addressFields.zip,
          lat: addressFields.lat,
          lng: addressFields.lng,
        },
        items: input.items.map((item) => ({
          name: item.name,
          category: item.category,
          quantity: item.quantity,
          pricePerDay: item.pricePerDay,
        })),
        totalPrice: input.totalPrice,
        orderDate: input.orderDate,
        endDate: input.endDate,
        duration: input.duration,
        deliveryFee: input.deliveryFee,
        paymentMethod: input.paymentMethod,
        notes: input.notes,
        volumeDiscountAmount: input.volumeDiscountAmount,
        volumeDiscountLabel: input.volumeDiscountLabel,
        orderUrl,
      });
      console.log(`[WA Notify] Sent confirmation to ${input.customerWhatsapp}`);
    } catch (err) {
      console.error("[WA Notify] Failed to send order confirmation:", err);
    }

    // 6b. Send WhatsApp Notification to ADMIN about new order
    const adminWhatsapp = process.env.ADMIN_WHATSAPP;
    if (adminWhatsapp) {
      try {
        await notifyAdminNewOrder({
          adminWhatsapp,
          orderNumber: order.orderNumber,
          customerName: input.customerName,
          customerPhone: input.customerWhatsapp,
          totalAmount: input.totalPrice,
          orderUrl,
          erpOrderId: order.id,
        });
        console.log(`[WA Notify] Sent admin notification to ${adminWhatsapp}`);
      } catch (err) {
        console.error("[WA Notify] Failed to send admin notification:", err);
      }
    }

    // 7. Return response with token and URL
    return res.status(201).json({
      id: order.id,
      orderNumber: order.orderNumber,
      publicToken: order.publicToken,
      status: order.status,
      createdAt: order.createdAt,
      orderUrl,
    });
  } catch (error: unknown) {
    console.error("Failed to create order:", error);
    const message =
      error instanceof Error ? error.message : "Gagal membuat pesanan";
    return res.status(500).json({
      error: "Order Creation Failed",
      message,
    });
  }
};
