import { apiClient } from './client';
import { Sale, Invoice, PaginatedResponse } from '../../types';

export const saleService = {
  async getAllSales(page: number = 1, limit: number = 50, filters?: any): Promise<PaginatedResponse<Sale>> {
    try {
      const response = await apiClient.get('/sales/', {
        params: { page, limit, ...filters },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getSaleById(id: number): Promise<Sale> {
    try {
      const response = await apiClient.get(`/sales/${id}/`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async createSale(saleData: any): Promise<Sale> {
    try {
      const response = await apiClient.post('/sales/', saleData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async updateSale(id: number, saleData: Partial<Sale>): Promise<Sale> {
    try {
      const response = await apiClient.put(`/sales/${id}/`, saleData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async deleteSale(id: number): Promise<void> {
    try {
      await apiClient.delete(`/sales/${id}/`);
    } catch (error) {
      throw error;
    }
  },

  async getSalesByUser(userId: number): Promise<Sale[]> {
    try {
      const response = await apiClient.get(`/sales/?user_id=${userId}`);
      return response.data.results || response.data;
    } catch (error) {
      throw error;
    }
  },
};

export const invoiceService = {
  async getAllInvoices(page: number = 1, limit: number = 50): Promise<PaginatedResponse<Invoice>> {
    try {
      const response = await apiClient.get('/invoices/', {
        params: { page, limit },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getInvoiceById(id: number): Promise<Invoice> {
    try {
      const response = await apiClient.get(`/invoices/${id}/`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async createInvoice(saleId: number): Promise<Invoice> {
    try {
      const response = await apiClient.post('/invoices/', { sale_id: saleId });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async generateInvoicePDF(invoiceId: number): Promise<Blob> {
    try {
      const response = await apiClient.get(`/invoices/${invoiceId}/pdf/`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async updateInvoiceStatus(id: number, status: string): Promise<Invoice> {
    try {
      const response = await apiClient.patch(`/invoices/${id}/`, { status });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
