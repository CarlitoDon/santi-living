/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_PROXY_URL?: string;
  readonly SANTI_PROXY_URL?: string;
  readonly PROXY_API_SECRET?: string;
  readonly PROXY_API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare global {
  interface Window {
    __CALCULATOR_EDIT_MODE__?: boolean;
  }
}
