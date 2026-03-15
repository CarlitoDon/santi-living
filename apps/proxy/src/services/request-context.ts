import { AsyncLocalStorage } from "node:async_hooks";

export type OutboundRequestContext = {
  correlationId?: string;
  idempotencyKey?: string;
  companyId?: string;
  attributionSource?: string;
  attributionMedium?: string;
  attributionCampaign?: string;
  attributionGclid?: string;
  attributionFbclid?: string;
  attributionWbraid?: string;
  attributionGbraid?: string;
};

const outboundRequestContextStorage =
  new AsyncLocalStorage<OutboundRequestContext>();

export const runWithOutboundRequestContext = async <T>(
  context: OutboundRequestContext,
  work: () => Promise<T>,
): Promise<T> => {
  return outboundRequestContextStorage.run(context, work);
};

export const getOutboundRequestContext = (): OutboundRequestContext => {
  return outboundRequestContextStorage.getStore() || {};
};
