import { apiClient } from './client';
import { User, SignupRequest, UpdateUserRequest } from '../../types';

/**
 * User API Service
 * Maps to /api/users/ endpoints per OpenAPI spec
 */
export const userService = {
  /**
   * GET /api/users/all/
   * List all users (admin only)
   */
  async getAllUsers(): Promise<User[]> {
    const response = await apiClient.get('/users/all/');
    return response.data;
  },

  /**
   * GET /api/users/user/{user_id}/
   * Get specific user by ID (UUID)
   */
  async getUserById(userId: string): Promise<User> {
    const response = await apiClient.get(`/users/user/${userId}/`);
    return response.data;
  },

  /**
   * GET /api/users/me/
   * Get current authenticated user
   */
  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get('/users/me/');
    return response.data;
  },

  /**
   * POST /api/users/signup/
   * Create new user (admin only)
   * Requires: { email, password1, password2, username, fullname?, role? }
   */
  async createUser(userData: SignupRequest): Promise<User> {
    const response = await apiClient.post('/users/signup/', userData);
    return response.data;
  },

  /**
   * PUT /api/users/users/update-by-id/{user_id}/
   * Update user (admin only)
   * Note: API path uses double 'users' prefix
   */
  async updateUser(userId: string, updateData: UpdateUserRequest): Promise<User> {
    const response = await apiClient.put(`/users/users/update-by-id/${userId}/`, updateData);
    return response.data;
  },

  /**
   * PUT /api/users/deactivate-activate/{user_id}/
   * Toggle user active/inactive status
   */
  async toggleUserStatus(userId: string): Promise<User> {
    const response = await apiClient.put(`/users/deactivate-activate/${userId}/`);
    return response.data;
  },

  /**
   * DELETE /api/users/delete/{user_id}/
   * Delete user (admin only)
   */
  async deleteUser(userId: string): Promise<void> {
    await apiClient.delete(`/users/delete/${userId}/`);
  },

  /**
   * POST /api/users/change-password/
   * Change password for current user
   */
  async changePassword(currentPassword: string, newPassword1: string, newPassword2: string): Promise<void> {
    const response = await apiClient.post('/users/change-password/', {
      current_password: currentPassword,
      new_password1: newPassword1,
      new_password2: newPassword2,
    });
    return response.data;
  },
};
