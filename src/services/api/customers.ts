import { apiClient } from './client';
import { Customer, CreateCustomerRequest, UpdateCustomerRequest } from '../../types';

/**
 * Customer API Service
 * Maps to /api/customers/ endpoints per OpenAPI spec
 */
export const customerService = {
  /**
   * GET /api/customers/all/
   * List all customers
   */
  async getAllCustomers(): Promise<Customer[]> {
    try {
      const response = await apiClient.get('/customers/all/');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * GET /api/customers/{customer_id}/
   * Get specific customer by ID (UUID)
   */
  async getCustomerById(customerId: string): Promise<Customer> {
    try {
      const response = await apiClient.get(`/customers/${customerId}/`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * POST /api/customers/create/
   * Create new customer (admin only)
   * Requires: { name?, email?, phone?, address?, is_active? }
   */
  async createCustomer(customerData: CreateCustomerRequest): Promise<Customer> {
    try {
      const response = await apiClient.post('/customers/create/', customerData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * PUT /api/customers/update/{customer_id}/
   * Update customer
   */
  async updateCustomer(customerId: string, customerData: UpdateCustomerRequest): Promise<Customer> {
    try {
      const response = await apiClient.put(`/customers/update/${customerId}/`, customerData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * PATCH /api/customers/activate-deactivate/{customer_id}/?is_active=true|false
   * Toggle customer active/inactive status
   */
  async toggleCustomerStatus(customerId: string, isActive: boolean): Promise<Customer> {
    try {
      const response = await apiClient.patch(`/customers/activate-deactivate/${customerId}/`, null, {
        params: { is_active: isActive },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * DELETE /api/customers/delete/{customer_id}/
   * Delete customer (admin only)
   */
  async deleteCustomer(customerId: string): Promise<void> {
    try {
      await apiClient.delete(`/customers/delete/${customerId}/`);
    } catch (error) {
      throw error;
    }
  },
};
