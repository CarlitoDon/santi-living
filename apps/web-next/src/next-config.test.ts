import { describe, expect, it } from 'vitest';
import nextConfig from '../next.config';

describe('next.config CSP headers', () => {
  it('includes required GA4 and Google Ads directives in CSP', async () => {
    expect(nextConfig.headers).toBeDefined();
    if (!nextConfig.headers) return;

    const headersConfig = await nextConfig.headers();
    const globalHeader = headersConfig.find((h) => h.source === '/(.*)');
    expect(globalHeader).toBeDefined();

    const cspObj = globalHeader?.headers.find((h) => h.key === 'Content-Security-Policy');
    expect(cspObj).toBeDefined();
    const csp = cspObj?.value as string;

    // Directives
    const directives = Object.fromEntries(
      csp
        .split(';')
        .map((part) => part.trim())
        .filter(Boolean)
        .map((part) => {
          const [directive, ...sources] = part.split(/\s+/);
          return [directive, sources];
        })
    );

    // 1. connect-src checks
    const expectedConnectSrc = [
      'https://*.google-analytics.com',
      'https://*.analytics.google.com',
      'https://analytics.google.com',
      'https://www.google-analytics.com',
      'https://region1.google-analytics.com',
      'https://*.googletagmanager.com',
      'https://www.googletagmanager.com',
      'https://*.google.com',
      'https://www.google.com',
      'https://*.google.co.id',
      'https://www.google.co.id',
      'https://*.doubleclick.net',
      'https://ad.doubleclick.net',
      'https://*.googleadservices.com',
      'https://googleads.g.doubleclick.net',
    ];

    for (const src of expectedConnectSrc) {
      expect(directives['connect-src']).toContain(src);
    }

    // 2. script-src checks
    const expectedScriptSrc = [
      'https://*.googleadservices.com',
      'https://googleads.g.doubleclick.net',
      'https://*.doubleclick.net',
      'https://ad.doubleclick.net',
    ];

    for (const src of expectedScriptSrc) {
      expect(directives['script-src']).toContain(src);
    }

    // 3. img-src checks
    expect(directives['img-src']).toContain('data:');
    expect(directives['img-src']).toContain('blob:');
    expect(directives['img-src']).toContain('https:');
  });
});
