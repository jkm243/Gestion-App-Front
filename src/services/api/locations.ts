import { apiClient } from './client';
import { Location, CreateLocationRequest, UpdateLocationRequest } from '../../types';

/**
 * Location API Service
 * Maps to /api/locations/ endpoints per OpenAPI spec
 */
export const locationService = {
  /**
   * GET /api/locations/all/
   * List all locations
   */
  async getAllLocations(): Promise<Location[]> {
    try {
      const response = await apiClient.get('/locations/all/');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * GET /api/locations/{location_id}/
   * Get specific location by ID (UUID)
   */
  async getLocationById(locationId: string): Promise<Location> {
    try {
      const response = await apiClient.get(`/locations/${locationId}/`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * POST /api/locations/create/
   * Create new location
   * Requires: { name?, description?, is_active? }
   */
  async createLocation(locationData: CreateLocationRequest): Promise<Location> {
    try {
      const response = await apiClient.post('/locations/create/', locationData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * PUT /api/locations/update/{location_id}/
   * Update location
   */
  async updateLocation(locationId: string, locationData: UpdateLocationRequest): Promise<Location> {
    try {
      const response = await apiClient.put(`/locations/update/${locationId}/`, locationData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * PATCH /api/locations/activate-deactivate/{location_id}/?is_active=true|false
   * Toggle location active/inactive status
   */
  async toggleLocationStatus(locationId: string, isActive: boolean): Promise<Location> {
    try {
      const response = await apiClient.patch(`/locations/activate-deactivate/${locationId}/`, null, {
        params: { is_active: isActive },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * DELETE /api/locations/delete/{location_id}/
   * Delete location
   */
  async deleteLocation(locationId: string): Promise<void> {
    try {
      await apiClient.delete(`/locations/delete/${locationId}/`);
    } catch (error) {
      throw error;
    }
  },
};
