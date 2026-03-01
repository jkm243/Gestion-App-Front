import { apiClient } from './client';
import { User, PaginatedResponse } from '../../types';

export const userService = {
  async getAllUsers(page: number = 1, limit: number = 50): Promise<PaginatedResponse<User>> {
    try {
      const response = await apiClient.get('/users/all/', {
        params: { page, limit },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getUserById(id: number): Promise<User> {
    try {
      const response = await apiClient.get(`/users/${id}/`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async updateUser(id: number, userData: Partial<User>): Promise<User> {
    try {
      const response = await apiClient.put(`/users/update/`, userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async toggleUserStatus(id: number): Promise<User> {
    try {
      const response = await apiClient.put(`/users/deactivate-activate/${id}/`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async createUser(userData: any): Promise<User> {
    try {
      const response = await apiClient.post('/users/signup/', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async deleteUser(id: number): Promise<void> {
    try {
      await apiClient.delete(`/users/${id}/`);
    } catch (error) {
      throw error;
    }
  },
};
