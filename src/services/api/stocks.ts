import { apiClient } from './client';
import { Stock, CreateStockRequest, UpdateStockRequest } from '../../types';

/**
 * Stock API Service
 * Maps to /api/stocks/ endpoints per OpenAPI spec
 */
export const stockService = {
  /**
   * GET /api/stocks/stocks/
   * List all stocks
   */
  async getAllStocks(): Promise<Stock[]> {
    const response = await apiClient.get('/stocks/stocks/');
    return response.data;
  },

  /**
   * GET /api/stocks/stocks/{stock_id}/
   * Get specific stock by ID (UUID)
   */
  async getStockById(stockId: string): Promise<Stock> {
    const response = await apiClient.get(`/stocks/stocks/${stockId}/`);
    return response.data;
  },

  /**
   * POST /api/stocks/stocks/create/
   * Create new stock
   * Requires: { product (uuid), location (uuid), quantity_on_hand, quantity_reserved, min_threshold, critical_threshold }
   */
  async createStock(stockData: CreateStockRequest): Promise<Stock> {
    const response = await apiClient.post('/stocks/stocks/create/', stockData);
    return response.data;
  },

  /**
   * PUT /api/stocks/stocks/update/{stock_id}/
   * Update stock
   */
  async updateStock(stockId: string, stockData: UpdateStockRequest): Promise<Stock> {
    const response = await apiClient.put(`/stocks/stocks/update/${stockId}/`, stockData);
    return response.data;
  },

  /**
   * DELETE /api/stocks/stocks/delete/{stock_id}/
   * Delete stock
   */
  async deleteStock(stockId: string): Promise<void> {
    await apiClient.delete(`/stocks/stocks/delete/${stockId}/`);
  },
};
