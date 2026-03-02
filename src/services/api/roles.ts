import { apiClient } from './client';
import { Role } from '../../types';

export const roleService = {
  async getAllRoles(): Promise<Role[]> {
    try {
      const response = await apiClient.get('/role/all/');
      return response.data || [];
    } catch (error) {
      throw error;
    }
  },
};
