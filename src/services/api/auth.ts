import { apiClient } from './client';
import { User, AuthTokens, LoginFormData } from '../../types';

export const authService = {
  async login(credentials: LoginFormData): Promise<AuthTokens & { user: User }> {
    try {
      const response = await apiClient.post('/users/login/', credentials);
      const data = response.data;
      
      // Store tokens
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      
      return {
        access_token: data.access,
        refresh_token: data.refresh,
        user: data.user,
      };
    } catch (error) {
      throw error;
    }
  },

  async getCurrentUser(): Promise<User> {
    try {
      const response = await apiClient.get('/users/me/');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },

  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    try {
      await apiClient.post('/users/change-password/', {
        old_password: oldPassword,
        new_password: newPassword,
      });
    } catch (error) {
      throw error;
    }
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
    return !!localStorage.getItem('access_token');
  },
};
