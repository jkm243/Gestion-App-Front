import { apiClient } from './client';
import { Product, PaginatedResponse, CreateProductRequest, UpdateProductRequest } from '../../types';

/**
 * Product API Service
 * Maps to /api/products/ endpoints per OpenAPI spec
 */
export const productService = {
  /**
   * GET /api/products/all/
   * List all products (supports search param)
   */
  async getAllProducts(search?: string): Promise<Product[]> {
    try {
      const response = await apiClient.get('/products/all/', {
        params: search ? { search } : {},
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * GET /api/products/all-pagination/
   * Get paginated product list with advanced filtering
   * Supports: page, page_size, search, category, supplier, min_price, max_price, ordering
   */
  async getProductsPaginated(params?: {
    page?: number;
    page_size?: number;
    search?: string;
    category?: string;
    supplier?: string;
    min_price?: number;
    max_price?: number;
    ordering?: string;
  }): Promise<PaginatedResponse<Product>> {
    try {
      const response = await apiClient.get('/products/all-pagination/', {
        params,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * GET /api/products/{product_id}/
   * Get specific product by ID (UUID)
   */
  async getProductById(productId: string): Promise<Product> {
    try {
      const response = await apiClient.get(`/products/${productId}/`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * POST /api/products/create/
   * Create new product (admin only)
   * Requires: { sku?, name?, description?, category?, supplier (uuid), unit_cost?, unit_price?, is_active? }
   */
  async createProduct(productData: CreateProductRequest): Promise<Product> {
    try {
      const response = await apiClient.post('/products/create/', productData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * PUT /api/products/update/{product_id}/
   * Update product
   */
  async updateProduct(productId: string, productData: UpdateProductRequest): Promise<Product> {
    try {
      const response = await apiClient.put(`/products/update/${productId}/`, productData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * DELETE /api/products/delete/{product_id}/
   * Delete product (admin only)
   */
  async deleteProduct(productId: string): Promise<void> {
    try {
      await apiClient.delete(`/products/delete/${productId}/`);
    } catch (error) {
      throw error;
    }
  },
};
