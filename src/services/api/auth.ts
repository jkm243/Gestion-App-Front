import { apiClient } from './client';
import { User, AuthTokens, LoginFormData } from '../../types';

export const authService = {
  async login(credentials: LoginFormData): Promise<AuthTokens & { user: User }> {
    const response = await apiClient.post('/users/login/', credentials);
    const data = response.data;

    // the backend nests tokens inside `token` object per OpenAPI spec
    const accessToken = data.token?.access || '';
    const refreshToken = data.token?.refresh || '';

    // persist tokens so the request interceptor can attach them
    if (accessToken) {
      localStorage.setItem('access_token', accessToken);
    }
    if (refreshToken) {
      localStorage.setItem('refresh_token', refreshToken);
    }

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user: data.user,
    };
  },

  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get('/users/me/');
    return response.data;
  },

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },

  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    await apiClient.post('/users/change-password/', {
      old_password: oldPassword,
      new_password: newPassword,
    });
  },

  getStoredTokens(): AuthTokens | null {
    const accessToken = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');
    
    if (accessToken && refreshToken) {
      return {
        access_token: accessToken,
        refresh_token: refreshToken,
      };
    }
    
    return null;
  },

  isAuthenticated(): boolean {
    return this.getStoredTokens() !== null;
  },
};
