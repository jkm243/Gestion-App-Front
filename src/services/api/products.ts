import { apiClient } from './client';
import { Product, PaginatedResponse } from '../../types';

export const productService = {
  async getAllProducts(page: number = 1, limit: number = 50, filters?: any): Promise<PaginatedResponse<Product>> {
    try {
      const response = await apiClient.get('/products/', {
        params: { page, limit, ...filters },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getProductById(id: number): Promise<Product> {
    try {
      const response = await apiClient.get(`/products/${id}/`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async searchProducts(query: string): Promise<Product[]> {
    try {
      const response = await apiClient.get('/products/', {
        params: { search: query },
      });
      return response.data.results || response.data;
    } catch (error) {
      throw error;
    }
  },

  async searchByBarcode(barcode: string): Promise<Product | null> {
    try {
      const response = await apiClient.get('/products/', {
        params: { barcode },
      });
      const products = response.data.results || response.data;
      return products.length > 0 ? products[0] : null;
    } catch (error) {
      throw error;
    }
  },

  async createProduct(productData: FormData): Promise<Product> {
    try {
      const response = await apiClient.post('/products/', productData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async updateProduct(id: number, productData: FormData | Partial<Product>): Promise<Product> {
    try {
      const response = await apiClient.put(`/products/${id}/`, productData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async deleteProduct(id: number): Promise<void> {
    try {
      await apiClient.delete(`/products/${id}/`);
    } catch (error) {
      throw error;
    }
  },

  async toggleProductStatus(id: number): Promise<Product> {
    try {
      const response = await apiClient.patch(`/products/${id}/toggle/`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
