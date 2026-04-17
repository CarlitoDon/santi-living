import { z } from 'zod';

// ─── Config Schema ──────────────────────────────────────────────────────────

const VolumeDiscountSchema = z.object({
  minQty: z.number(),
  maxQty: z.number(),
  discount: z.number(),
  label: z.string(),
});

const StoreLocationSchema = z.object({
  lat: z.number(),
  lng: z.number(),
  name: z.string(),
});

const DeliveryZoneSchema = z.object({
  maxDistance: z.number(),
  price: z.number(),
});

const PaymentBcaSchema = z.object({
  bank: z.string(),
  accountName: z.string(),
  accountNumber: z.string(),
});

const PaymentQrisSchema = z.object({
  merchantName: z.string(),
  nmid: z.string(),
  imagePath: z.string(),
});

const PaymentSchema = z.object({
  bca: PaymentBcaSchema,
  qris: PaymentQrisSchema,
});

export const ConfigSchema = z.object({
  businessName: z.string(),
  tagline: z.string(),
  whatsappNumber: z.string(),
  whatsappDisplay: z.string(),
  city: z.string(),
  minDuration: z.number(),
  maxDuration: z.number(),
  minQuantity: z.number(),
  maxQuantity: z.number(),
  minBookingDays: z.number(),
  volumeDiscounts: z.array(VolumeDiscountSchema),
  operatingHours: z.string(),
  cutoffHour: z.number(),
  priceRange: z.string(),
  siteUrl: z.string(),
  socialLinks: z.array(z.string()),
  storeLocation: StoreLocationSchema,
  deliveryZones: z.array(DeliveryZoneSchema),
  deliveryPricePerKm: z.number(),
  minDeliveryPrice: z.number(),
  botApi: z.object({
    baseUrl: z.string(),
    apiKey: z.string(),
  }),
  payment: PaymentSchema,
});

export type Config = z.infer<typeof ConfigSchema>;
export type VolumeDiscount = z.infer<typeof VolumeDiscountSchema>;
export type DeliveryZone = z.infer<typeof DeliveryZoneSchema>;
