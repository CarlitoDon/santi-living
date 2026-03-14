import type { Request, Response, NextFunction } from "express";

type ProcessedDelivery = {
  expiresAt: number;
};

const processedDeliveries = new Map<string, ProcessedDelivery>();
const inFlightDeliveries = new Set<string>();

const DEFAULT_TTL_MS = 10 * 60 * 1000;

const readPositiveInt = (value: string | undefined, fallback: number) => {
  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback;
  }

  return Math.floor(parsed);
};

const getTtlMs = () => {
  return readPositiveInt(process.env.WEBHOOK_IDEMPOTENCY_TTL_MS, DEFAULT_TTL_MS);
};

const cleanupExpired = (now: number) => {
  for (const [key, value] of processedDeliveries.entries()) {
    if (value.expiresAt <= now) {
      processedDeliveries.delete(key);
    }
  }
};

const getDeliveryKey = (req: Request) => {
  const deliveryIdHeader = req.header("x-webhook-delivery-id");
  if (deliveryIdHeader) {
    return deliveryIdHeader;
  }

  const idempotencyKeyHeader = req.header("idempotency-key");
  if (idempotencyKeyHeader) {
    return idempotencyKeyHeader;
  }

  return undefined;
};

export const webhookIdempotencyMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const deliveryKey = getDeliveryKey(req);

  if (!deliveryKey) {
    next();
    return;
  }

  const now = Date.now();
  cleanupExpired(now);

  const existing = processedDeliveries.get(deliveryKey);
  if (existing && existing.expiresAt > now) {
    res.status(200).json({
      success: true,
      duplicate: true,
      deliveryId: deliveryKey,
    });
    return;
  }

  if (inFlightDeliveries.has(deliveryKey)) {
    res.status(202).json({
      success: true,
      duplicate: true,
      inFlight: true,
      deliveryId: deliveryKey,
    });
    return;
  }

  inFlightDeliveries.add(deliveryKey);

  res.on("finish", () => {
    inFlightDeliveries.delete(deliveryKey);

    if (res.statusCode >= 200 && res.statusCode < 300) {
      processedDeliveries.set(deliveryKey, {
        expiresAt: Date.now() + getTtlMs(),
      });
    }
  });

  next();
};

export const __webhookIdempotencyInternals = {
  processedDeliveries,
  inFlightDeliveries,
  cleanupExpired,
  getDeliveryKey,
};
