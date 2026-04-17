const normalizeUrl = (url: string) => url.replace(/\/$/, '');

export const getProxyBaseUrl = () => {
  if (typeof window === 'undefined') {
    // Server-side: read from process.env
    return normalizeUrl(
      process.env.SANTI_PROXY_URL ||
        process.env.PUBLIC_PROXY_URL ||
        'http://localhost:3002',
    );
  }

  // Client-side: use public env var
  return normalizeUrl(
    process.env.NEXT_PUBLIC_PROXY_URL || 'http://localhost:3002',
  );
};

export const getProxyTrpcUrl = () => `${getProxyBaseUrl()}/api/trpc`;

export const getProxyApiSecret = () => {
  if (typeof window !== 'undefined') {
    return '';
  }

  return process.env.PROXY_API_SECRET || process.env.PROXY_API_KEY || '';
};
