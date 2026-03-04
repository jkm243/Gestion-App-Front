import { apiClient } from './client';
import { Sale, CreateSaleRequest, AddSaleItemRequest, PaginatedResponse } from '../../types';

/**
 * Sale API Service
 * Maps to /api/sales/ endpoints per OpenAPI spec
 */
export const saleService = {
  /**
   * POST /api/sales/
   * Create new sale with items_data array
   * Requires: { customer (uuid), tax_amount?, discount_amount?, notes?, items_data: [{ product, location?, quantity, unit_price, discount_amount? }] }
   */
  async createSale(saleData: CreateSaleRequest): Promise<Sale> {
    try {
      const response = await apiClient.post('/sales/', saleData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * GET /api/sales/list/
   * List all sales with optional filtering by status and customer
   */
  async getAllSales(params?: {
    status?: 'pending' | 'completed' | 'cancelled' | 'refunded';
    customer?: string; // UUID
    page?: number;
    page_size?: number;
  }): Promise<PaginatedResponse<Sale>> {
    try {
      const response = await apiClient.get('/sales/list/', {
        params,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * GET /api/sales/{sale_id}/
   * Get specific sale by ID (UUID)
   */
  async getSaleById(saleId: string): Promise<Sale> {
    try {
      const response = await apiClient.get(`/sales/${saleId}/`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * POST /api/sales/{sale_id}/add-item/
   * Add item to pending sale
   */
  async addSaleItem(saleId: string, itemData: AddSaleItemRequest): Promise<Sale> {
    try {
      const response = await apiClient.post(`/sales/${saleId}/add-item/`, itemData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * POST /api/sales/{sale_id}/complete/
   * Mark sale as completed
   */
  async completeSale(saleId: string): Promise<Sale> {
    try {
      const response = await apiClient.post(`/sales/${saleId}/complete/`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * POST /api/sales/{sale_id}/cancel/
   * Cancel sale (only if pending)
   */
  async cancelSale(saleId: string): Promise<Sale> {
    try {
      const response = await apiClient.post(`/sales/${saleId}/cancel/`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * POST /api/sales/{sale_id}/refund/
   * Refund completed sale
   */
  async refundSale(saleId: string): Promise<Sale> {
    try {
      const response = await apiClient.post(`/sales/${saleId}/refund/`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * DELETE /api/sales/{sale_id}/delete/
   * Delete pending sale
   */
  async deleteSale(saleId: string): Promise<void> {
    try {
      await apiClient.delete(`/sales/${saleId}/delete/`);
    } catch (error) {
      throw error;
    }
  },
};
