const sessionDurationValue = Number(import.meta.env.VITE_AUTH_SESSION_DAYS ?? '7');

export const AUTH_SESSION_DURATION_DAYS =
  Number.isFinite(sessionDurationValue) && sessionDurationValue > 0
    ? sessionDurationValue
    : 7;

export const AUTH_ACCESS_COOKIE_NAME = 'gestion_access_token';
export const AUTH_REFRESH_COOKIE_NAME = 'gestion_refresh_token';
export const AUTH_USER_COOKIE_NAME = 'gestion_auth_user';
export const AUTH_SESSION_EXPIRED_EVENT = 'auth:session-expired';
export const AUTH_REFRESH_ENDPOINT =
  import.meta.env.VITE_AUTH_REFRESH_ENDPOINT || '/auth/refresh/';
export const AUTH_LOGOUT_ENDPOINT =
  import.meta.env.VITE_AUTH_LOGOUT_ENDPOINT || '';
export const AUTH_USE_CREDENTIALS =
  import.meta.env.VITE_AUTH_USE_CREDENTIALS === 'true';

export const AUTH_BYPASS_401_ENDPOINTS = [
  '/users/login/',
  '/users/signup/',
  AUTH_REFRESH_ENDPOINT,
];
