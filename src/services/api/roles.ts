import { apiClient } from './client';
import { Role } from '../../types';

export const roleService = {
  async getAllRoles(): Promise<Role[]> {
    try {
      const response = await apiClient.get('/role/all/');
      // normaliser les noms en majuscules pour éviter les problèmes de casse
      const roles: Role[] = (response.data || []).map((r: any) => ({
        ...r,
        name: String(r.name).toUpperCase(),
      }));
      return roles;
    } catch (error) {
      throw error;
    }
  },
};
