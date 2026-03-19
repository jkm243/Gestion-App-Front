import { LoginFormData, User } from '../../types';
import {
  AUTH_REFRESH_ENDPOINT,
  AUTH_LOGOUT_ENDPOINT,
  AUTH_SESSION_DURATION_DAYS,
  AUTH_USE_CREDENTIALS,
  clearAuthTokens,
  getAccessToken,
  clearStoredAuthUser,
  getRefreshToken,
  getStoredAuthUser,
  hasStoredAuthTokens,
  persistAuthUser,
  persistAuthTokens,
} from '../../features/auth';
import { logAuthEvent } from '../../features/auth/authLogger';
import { apiClient } from './client';

interface LoginResult {
  user: User;
  hasCookie: boolean;
  sessionDurationDays: number;
}

function extractTokenValue(
  data: Record<string, any>,
  type: 'access' | 'refresh'
) {
  return data.token?.[type] || data[type] || '';
}

function extractErrorStatus(error: unknown) {
  return (error as { response?: { status?: number } })?.response?.status;
}

function extractErrorMessage(error: unknown) {
  return (
    (error as { response?: { data?: { message?: string } } })?.response?.data
      ?.message ||
    (error as Error | undefined)?.message ||
    'Session introuvable ou expirée'
  );
}

function decodeJwtPayload(token: string) {
  try {
    const payload = token.split('.')[1];

    if (!payload) {
      return null;
    }

    const normalizedPayload = payload.replace(/-/g, '+').replace(/_/g, '/');
    const decodedPayload = atob(normalizedPayload);
    return JSON.parse(decodedPayload) as { exp?: number };
  } catch {
    return null;
  }
}

function isTokenExpired(token: string | undefined) {
  if (!token) {
    return true;
  }

  const payload = decodeJwtPayload(token);

  if (!payload?.exp) {
    return false;
  }

  return payload.exp * 1000 <= Date.now();
}

export const authService = {
  async login(credentials: LoginFormData): Promise<LoginResult> {
    const response = await apiClient.post('/users/login/', credentials);
    const data = response.data;
    const accessToken = extractTokenValue(data, 'access');
    const refreshToken = extractTokenValue(data, 'refresh');
    const hasCookie = persistAuthTokens({
      access_token: accessToken,
      refresh_token: refreshToken,
    });
    const user = data.user || (await this.getCurrentUser());
    persistAuthUser(user);

    logAuthEvent('[AUTH_LOGIN_SUCCESS]', {
      userId: user.id,
      hasCookie,
      sessionDurationDays: AUTH_SESSION_DURATION_DAYS,
    });

    return {
      user,
      hasCookie,
      sessionDurationDays: AUTH_SESSION_DURATION_DAYS,
    };
  },

  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get('/users/me/');
    persistAuthUser(response.data);
    return response.data;
  },

  async restoreSession(): Promise<User> {
    const cachedUser = this.getStoredUser();
    const accessToken = getAccessToken();
    const refreshToken = getRefreshToken();

    if (cachedUser && accessToken && !isTokenExpired(accessToken)) {
      return cachedUser;
    }

    if (!AUTH_USE_CREDENTIALS && refreshToken && !isTokenExpired(refreshToken)) {
      try {
        await this.refreshAccessToken();

        if (cachedUser && this.hasStoredSession()) {
          return cachedUser;
        }
      } catch (error) {
        logAuthEvent(
          '[AUTH_REFRESH_BEFORE_RESTORE_FAILED]',
          {
            reason: extractErrorMessage(error),
          },
          'warn'
        );
      }
    }

    try {
      return await this.getCurrentUser();
    } catch (error) {
      if (
        cachedUser &&
        this.hasStoredSession() &&
        this.isRecoverableRestoreFailure(error)
      ) {
        logAuthEvent(
          '[AUTH_SESSION_RESTORE_FALLBACK]',
          {
            userId: cachedUser.id,
            reason: extractErrorMessage(error),
            isAuthenticated: true,
          },
          'warn'
        );

        return cachedUser;
      }

      throw error;
    }
  },

  async logout(): Promise<void> {
    try {
      if (AUTH_LOGOUT_ENDPOINT) {
        await apiClient.post(AUTH_LOGOUT_ENDPOINT, {});
      }
    } finally {
      this.clearSession();
    }
  },

  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    await apiClient.post('/users/change-password/', {
      old_password: oldPassword,
      new_password: newPassword,
    });
  },

  clearSession(): void {
    clearAuthTokens();
    clearStoredAuthUser();
  },

  hasStoredSession(): boolean {
    return hasStoredAuthTokens();
  },

  hasRefreshToken(): boolean {
    return Boolean(getRefreshToken());
  },

  getStoredUser(): User | null {
    return getStoredAuthUser();
  },

  isRecoverableRestoreFailure(error: unknown): boolean {
    const status = extractErrorStatus(error);
    return typeof status === 'number' && status >= 500;
  },

  async refreshAccessToken(): Promise<void> {
    const refreshToken = getRefreshToken();

    if (!refreshToken) {
      return;
    }

    const response = await apiClient.post(
      AUTH_REFRESH_ENDPOINT,
      { refresh: refreshToken },
      { skipAuthRefresh: true } as any
    );

    const accessToken = extractTokenValue(response.data, 'access');
    const nextRefreshToken =
      extractTokenValue(response.data, 'refresh') || refreshToken;

    if (accessToken || nextRefreshToken) {
      persistAuthTokens({
        access_token: accessToken,
        refresh_token: nextRefreshToken,
      });
    }
  },

  canRestoreSession(): boolean {
    return AUTH_USE_CREDENTIALS || this.hasStoredSession();
  },

  isAuthenticated(): boolean {
    return this.hasStoredSession();
  },
};
