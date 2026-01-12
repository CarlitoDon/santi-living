import type { Request, Response } from "express";
import { CreateOrderSchema } from "../types/order";
import { createRentalOrder, findOrCreatePartner } from "../services/erp-client";

// Default company ID for Santi Living
const SANTI_LIVING_COMPANY_ID =
  process.env.SANTI_LIVING_COMPANY_ID || "santi-living-company-id";

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

    // 3. Map items to rental items
    // TODO: Create proper product mapping between santi-living and sync-erp
    const rentalItems = input.items.map((item) => ({
      rentalItemId: item.name, // Placeholder - needs mapping logic
      quantity: item.quantity,
    }));

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
    const baseUrl = process.env.PUBLIC_BASE_URL || "https://santi-living.com";
    const orderUrl = `${baseUrl}/sewa-kasur/pesanan/${order.publicToken}`;

    // 6. Return response with token and URL
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
