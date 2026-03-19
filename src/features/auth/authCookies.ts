import { AuthTokens, User } from '../../types';
import {
  AUTH_ACCESS_COOKIE_NAME,
  AUTH_REFRESH_COOKIE_NAME,
  AUTH_SESSION_DURATION_DAYS,
  AUTH_USER_COOKIE_NAME,
} from './constants';

type CookieSameSite = 'Lax' | 'Strict' | 'None';

type StoredAuthTokens = Partial<AuthTokens>;

function isBrowser() {
  return typeof document !== 'undefined';
}

function resolveSameSite(): CookieSameSite {
  const value = import.meta.env.VITE_AUTH_COOKIE_SAME_SITE?.toLowerCase();

  if (value === 'strict') {
    return 'Strict';
  }

  if (value === 'none') {
    return 'None';
  }

  return 'Lax';
}

function shouldUseSecureCookie(sameSite: CookieSameSite) {
  const explicit = import.meta.env.VITE_AUTH_COOKIE_SECURE;
  if (explicit === 'true') {
    return true;
  }

  if (explicit === 'false') {
    return false;
  }

  if (sameSite === 'None') {
    return true;
  }

  return typeof window !== 'undefined' && window.location.protocol === 'https:';
}

function readCookie(name: string) {
  if (!isBrowser()) {
    return undefined;
  }

  const prefix = `${encodeURIComponent(name)}=`;
  const cookie = document.cookie
    .split('; ')
    .find((item) => item.startsWith(prefix));

  return cookie ? decodeURIComponent(cookie.slice(prefix.length)) : undefined;
}

function writeCookie(name: string, value: string, days = AUTH_SESSION_DURATION_DAYS) {
  if (!isBrowser()) {
    return;
  }

  const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  const sameSite = resolveSameSite();
  const secure = shouldUseSecureCookie(sameSite);

  let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; Expires=${expiresAt.toUTCString()}; Path=/; SameSite=${sameSite}`;

  if (secure) {
    cookie += '; Secure';
  }

  document.cookie = cookie;
}

function removeCookie(name: string) {
  if (!isBrowser()) {
    return;
  }

  const sameSite = resolveSameSite();
  const secure = shouldUseSecureCookie(sameSite);

  let cookie = `${encodeURIComponent(name)}=; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/; SameSite=${sameSite}`;

  if (secure) {
    cookie += '; Secure';
  }

  document.cookie = cookie;
}

export function persistAuthTokens(tokens: StoredAuthTokens) {
  let hasStoredToken = false;

  if (tokens.access_token) {
    writeCookie(AUTH_ACCESS_COOKIE_NAME, tokens.access_token);
    hasStoredToken = true;
  }

  if (tokens.refresh_token) {
    writeCookie(AUTH_REFRESH_COOKIE_NAME, tokens.refresh_token);
    hasStoredToken = true;
  }

  return hasStoredToken;
}

export function getAccessToken() {
  return readCookie(AUTH_ACCESS_COOKIE_NAME);
}

export function getRefreshToken() {
  return readCookie(AUTH_REFRESH_COOKIE_NAME);
}

export function getStoredAuthTokens(): StoredAuthTokens | null {
  const accessToken = getAccessToken();
  const refreshToken = getRefreshToken();

  if (!accessToken && !refreshToken) {
    return null;
  }

  return {
    access_token: accessToken,
    refresh_token: refreshToken,
  };
}

export function hasStoredAuthTokens() {
  return Boolean(getAccessToken() || getRefreshToken());
}

export function clearAuthTokens() {
  removeCookie(AUTH_ACCESS_COOKIE_NAME);
  removeCookie(AUTH_REFRESH_COOKIE_NAME);
}

export function persistAuthUser(user: User) {
  writeCookie(AUTH_USER_COOKIE_NAME, JSON.stringify(user));
}

export function getStoredAuthUser(): User | null {
  const serializedUser = readCookie(AUTH_USER_COOKIE_NAME);

  if (!serializedUser) {
    return null;
  }

  try {
    return JSON.parse(serializedUser) as User;
  } catch {
    removeCookie(AUTH_USER_COOKIE_NAME);
    return null;
  }
}

export function clearStoredAuthUser() {
  removeCookie(AUTH_USER_COOKIE_NAME);
}
