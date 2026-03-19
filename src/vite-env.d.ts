/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_AUTH_COOKIE_SAME_SITE?: string;
  readonly VITE_AUTH_COOKIE_SECURE?: string;
  readonly VITE_AUTH_LOGOUT_ENDPOINT?: string;
  readonly VITE_AUTH_REFRESH_ENDPOINT?: string;
  readonly VITE_AUTH_SESSION_DAYS?: string;
  readonly VITE_AUTH_USE_CREDENTIALS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
