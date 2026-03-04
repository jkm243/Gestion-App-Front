import { apiClient } from './client';
import { Supplier, CreateSupplierRequest, UpdateSupplierRequest } from '../../types';

/**
 * Supplier API Service
 * Maps to /api/suppliers/ endpoints per OpenAPI spec
 */
export const supplierService = {
  /**
   * GET /api/suppliers/all/
   * List all suppliers
   */
  async getAllSuppliers(): Promise<Supplier[]> {
    const response = await apiClient.get('/suppliers/all/');
    return response.data;
  },

  /**
   * GET /api/suppliers/{supplier_id}/
   * Get specific supplier by ID (UUID)
   */
  async getSupplierById(supplierId: string): Promise<Supplier> {
    const response = await apiClient.get(`/suppliers/${supplierId}/`);
    return response.data;
  },

  /**
   * POST /api/suppliers/create/
   * Create new supplier (admin only)
   * Requires: { name?, contact_email?, contact_phone?, address?, is_active? }
   */
  async createSupplier(supplierData: CreateSupplierRequest): Promise<Supplier> {
    const response = await apiClient.post('/suppliers/create/', supplierData);
    return response.data;
  },

  /**
   * PUT /api/suppliers/update/{supplier_id}/
   * Update supplier
   */
  async updateSupplier(supplierId: string, supplierData: UpdateSupplierRequest): Promise<Supplier> {
    const response = await apiClient.put(`/suppliers/update/${supplierId}/`, supplierData);
    return response.data;
  },

  /**
   * DELETE /api/suppliers/delete/{supplier_id}/
   * Delete supplier (admin only)
   */
  async deleteSupplier(supplierId: string): Promise<void> {
    await apiClient.delete(`/suppliers/delete/${supplierId}/`);
  },
};
