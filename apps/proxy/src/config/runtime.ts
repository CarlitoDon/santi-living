const readFirstEnv = (...keys: string[]) => {
  for (const key of keys) {
    const value = process.env[key];
    if (value && value.trim().length > 0) {
      return value.trim();
    }
  }

  return "";
};

const normalizeBaseUrl = (url: string) => url.replace(/\/$/, "");

export const parseBearerToken = (header?: string | null) => {
  if (!header || !header.startsWith("Bearer ")) {
    return null;
  }

  const token = header.slice(7).trim();
  return token.length > 0 ? token : null;
};

export const parseCompanyScopeHeader = (
  header?: string | string[]
) => {
  const rawValue = Array.isArray(header) ? header[0] : header;

  if (!rawValue) {
    return null;
  }

  const companyId = rawValue.trim();
  return companyId.length > 0 ? companyId : null;
};

export const getProxyApiSecret = () => {
  return readFirstEnv("PROXY_API_SECRET", "PROXY_API_KEY");
};

export const requireProxyApiSecret = () => {
  const secret = getProxyApiSecret();

  if (!secret) {
    throw new Error("PROXY_API_SECRET is required");
  }

  return secret;
};

export const requireSantiLivingCompanyId = () => {
  const companyId = readFirstEnv("SANTI_LIVING_COMPANY_ID");

  if (!companyId) {
    throw new Error("SANTI_LIVING_COMPANY_ID is required");
  }

  return companyId;
};

export const getSyncErpApiPublicRentalUrl = () => {
  const baseUrl = readFirstEnv("SYNC_ERP_API_URL") || "http://localhost:3001/api/trpc";
  const normalizedBaseUrl = normalizeBaseUrl(baseUrl);

  if (normalizedBaseUrl.endsWith("/api/trpc/publicRental")) {
    return normalizedBaseUrl;
  }

  if (normalizedBaseUrl.endsWith("/api/trpc")) {
    return `${normalizedBaseUrl}/publicRental`;
  }

  return normalizedBaseUrl;
};

export const getSyncErpBotTrpcUrl = () => {
  const baseUrl = readFirstEnv("SYNC_ERP_BOT_URL") || "http://localhost:3000";
  return `${normalizeBaseUrl(baseUrl)}/api/trpc`;
};
