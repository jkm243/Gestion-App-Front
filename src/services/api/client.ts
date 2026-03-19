import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import {
  AUTH_BYPASS_401_ENDPOINTS,
  AUTH_REFRESH_ENDPOINT,
  AUTH_SESSION_EXPIRED_EVENT,
  AUTH_USE_CREDENTIALS,
  clearAuthTokens,
  getAccessToken,
  getRefreshToken,
  persistAuthTokens,
} from '../../features/auth';
import { logAuthEvent } from '../../features/auth/authLogger';

// During normal Vite build `import.meta.env` is populated. When running
// standalone scripts (ts-node/tsx) `import.meta.env` may be undefined, so
// fall back to process.env and finally to a hardcoded default.
const processEnv =
  (
    globalThis as typeof globalThis & {
      process?: { env?: Record<string, string | undefined> };
    }
  ).process?.env;

const API_BASE_URL =
  (typeof import.meta !== 'undefined' &&
    import.meta.env &&
    import.meta.env.VITE_API_BASE_URL) ||
  processEnv?.VITE_API_BASE_URL ||
  'https://gestion-app-4ls9.onrender.com/api';

interface RequestConfigWithRetry extends AxiosRequestConfig {
  _retry?: boolean;
  skipAuthRefresh?: boolean;
}

interface RefreshResult {
  failed: boolean;
  token?: string;
}

class ApiClient {
  private client: AxiosInstance;
  private isRefreshing = false;
  private refreshSubscribers: Array<(result: RefreshResult) => void> = [];

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      withCredentials: AUTH_USE_CREDENTIALS,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.client.interceptors.request.use(
      (config) => {
        const token = getAccessToken();

        if (token) {
          config.headers = config.headers ?? {};
          config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = (error.config || {}) as RequestConfigWithRetry;
        const requestUrl = originalRequest.url || '';
        const shouldBypassRefresh = AUTH_BYPASS_401_ENDPOINTS.some((endpoint) =>
          requestUrl.includes(endpoint)
        );

        if (
          error.response?.status === 401 &&
          !originalRequest._retry &&
          !originalRequest.skipAuthRefresh &&
          !shouldBypassRefresh
        ) {
          if (this.isRefreshing) {
            return new Promise((resolve, reject) => {
              this.refreshSubscribers.push((result) => {
                if (result.failed) {
                  reject(error);
                  return;
                }

                if (result.token && originalRequest.headers) {
                  originalRequest.headers.Authorization = `Bearer ${result.token}`;
                }

                this.client(originalRequest).then(resolve).catch(reject);
              });
            });
          }

          this.isRefreshing = true;
          originalRequest._retry = true;

          try {
            const refreshedAccessToken = await this.refreshSession();
            this.isRefreshing = false;
            this.notifyRefreshSubscribers({
              failed: false,
              token: refreshedAccessToken,
            });

            if (refreshedAccessToken && originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${refreshedAccessToken}`;
            }

            return this.client(originalRequest);
          } catch (refreshError) {
            this.isRefreshing = false;
            clearAuthTokens();
            this.notifyRefreshSubscribers({ failed: true });
            if (typeof window !== 'undefined') {
              window.dispatchEvent(
                new CustomEvent(AUTH_SESSION_EXPIRED_EVENT)
              );
            }
            logAuthEvent(
              '[AUTH_SESSION_RESTORE_FAILED]',
              {
                reason: 'refresh-failed',
                isAuthenticated: false,
              },
              'warn'
            );
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private async refreshSession() {
    const refreshToken = getRefreshToken();
    const payload = refreshToken ? { refresh: refreshToken } : {};
    const response = await this.client.post(
      AUTH_REFRESH_ENDPOINT,
      payload,
      {
        skipAuthRefresh: true,
      } as RequestConfigWithRetry
    );
    const refreshedAccessToken =
      response.data?.token?.access || response.data?.access;
    const refreshedRefreshToken =
      response.data?.token?.refresh || response.data?.refresh || refreshToken;

    if (refreshedAccessToken || refreshedRefreshToken) {
      persistAuthTokens({
        access_token: refreshedAccessToken,
        refresh_token: refreshedRefreshToken,
      });
    }

    return refreshedAccessToken;
  }

  private notifyRefreshSubscribers(result: RefreshResult) {
    this.refreshSubscribers.forEach((callback) => callback(result));
    this.refreshSubscribers = [];
  }

  public getClient() {
    return this.client;
  }
}

export const apiClient = new ApiClient().getClient();
