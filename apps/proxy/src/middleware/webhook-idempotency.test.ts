import { afterEach, describe, expect, it, vi } from "vitest";
import type { Request, Response, NextFunction } from "express";
import {
  webhookIdempotencyMiddleware,
  __webhookIdempotencyInternals,
} from "./webhook-idempotency";

const buildReq = (headers: Record<string, string>): Request => {
  const lowered = Object.fromEntries(
    Object.entries(headers).map(([key, value]) => [key.toLowerCase(), value]),
  );

  return {
    header: (name: string) => lowered[name.toLowerCase()],
  } as unknown as Request;
};

const buildRes = () => {
  let statusCode = 200;
  let finishListener: (() => void) | undefined;

  const res = {
    status: vi.fn((code: number) => {
      statusCode = code;
      return res;
    }),
    json: vi.fn(() => res),
    on: vi.fn((event: string, listener: () => void) => {
      if (event === "finish") {
        finishListener = listener;
      }
      return res;
    }),
    get statusCode() {
      return statusCode;
    },
    set statusCode(code: number) {
      statusCode = code;
    },
    triggerFinish: () => {
      finishListener?.();
    },
  } as unknown as Response & { triggerFinish: () => void };

  return res;
};

afterEach(() => {
  __webhookIdempotencyInternals.processedDeliveries.clear();
  __webhookIdempotencyInternals.inFlightDeliveries.clear();
  delete process.env.WEBHOOK_IDEMPOTENCY_TTL_MS;
});

describe("webhookIdempotencyMiddleware", () => {
  it("passes through when idempotency headers are missing", () => {
    const req = buildReq({});
    const res = buildRes();
    const next = vi.fn() as NextFunction;

    webhookIdempotencyMiddleware(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });

  it("returns duplicate response after a successful delivery was processed", () => {
    process.env.WEBHOOK_IDEMPOTENCY_TTL_MS = "600000";
    const req = buildReq({ "x-webhook-delivery-id": "delivery-1" });
    const firstRes = buildRes();
    const firstNext = vi.fn() as NextFunction;

    webhookIdempotencyMiddleware(req, firstRes, firstNext);
    expect(firstNext).toHaveBeenCalledTimes(1);

    firstRes.statusCode = 200;
    firstRes.triggerFinish();

    const secondRes = buildRes();
    const secondNext = vi.fn() as NextFunction;

    webhookIdempotencyMiddleware(req, secondRes, secondNext);

    expect(secondNext).not.toHaveBeenCalled();
    expect(secondRes.status).toHaveBeenCalledWith(200);
    expect(secondRes.json).toHaveBeenCalledWith({
      success: true,
      duplicate: true,
      deliveryId: "delivery-1",
    });
  });

  it("returns in-flight duplicate response while first request is still processing", () => {
    const req = buildReq({ "idempotency-key": "delivery-2" });
    const firstRes = buildRes();
    const firstNext = vi.fn() as NextFunction;

    webhookIdempotencyMiddleware(req, firstRes, firstNext);
    expect(firstNext).toHaveBeenCalledTimes(1);

    const secondRes = buildRes();
    const secondNext = vi.fn() as NextFunction;

    webhookIdempotencyMiddleware(req, secondRes, secondNext);

    expect(secondNext).not.toHaveBeenCalled();
    expect(secondRes.status).toHaveBeenCalledWith(202);
    expect(secondRes.json).toHaveBeenCalledWith({
      success: true,
      duplicate: true,
      inFlight: true,
      deliveryId: "delivery-2",
    });
  });
});
