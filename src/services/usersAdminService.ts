import { API_BASE_URL } from '../config';
import { getValidAccessToken } from './apiClient';

export type UserRole = 'administrator' | 'volunteer';

export interface UserListItem {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  is_staff: boolean;
  date_joined: string;
  role: UserRole;
}

export interface CreateUserData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  is_staff?: boolean;
}

export interface UpdateUserData {
  first_name?: string;
  last_name?: string;
  is_active?: boolean;
  is_staff?: boolean;
  role?: UserRole;
}

export interface UsersListResponse {
  count: number;
  total_pages: number;
  current_page: number;
  results: UserListItem[];
}

export interface UsersListParams {
  page?: number;
  page_size?: number;
  search?: string;
  is_active?: boolean;
  is_staff?: boolean;
  role?: UserRole;
}

async function getHeaders() {
  const access = await getValidAccessToken();
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${access}`,
  };
}

export const usersAdminService = {
  async getUsers(params?: UsersListParams): Promise<UsersListResponse> {
    const headers = await getHeaders();
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.page_size) queryParams.append('page_size', params.page_size.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.is_active !== undefined) queryParams.append('is_active', params.is_active.toString());
    if (params?.is_staff !== undefined) queryParams.append('is_staff', params.is_staff.toString());
    if (params?.role) queryParams.append('role', params.role);
    
    const response = await fetch(
      `${API_BASE_URL}/account/users/?${queryParams}`,
      { headers }
    );
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to fetch users');
    }
    return response.json();
  },

  async getUser(id: number): Promise<UserListItem> {
    const headers = await getHeaders();
    const response = await fetch(
      `${API_BASE_URL}/account/users/${id}/`,
      { headers }
    );
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to fetch user');
    }
    return response.json();
  },

  async createUser(data: CreateUserData): Promise<UserListItem> {
    const headers = await getHeaders();
    const response = await fetch(
      `${API_BASE_URL}/account/users/create/`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      }
    );
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || errorData.email?.[0] || 'Failed to create user');
    }
    return response.json();
  },

  async updateUser(id: number, data: UpdateUserData): Promise<UserListItem> {
    const headers = await getHeaders();
    const response = await fetch(
      `${API_BASE_URL}/account/users/${id}/`,
      {
        method: 'PATCH',
        headers,
        body: JSON.stringify(data),
      }
    );
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to update user');
    }
    return response.json();
  },

  async deleteUser(id: number): Promise<void> {
    const headers = await getHeaders();
    const response = await fetch(
      `${API_BASE_URL}/account/users/${id}/`,
      {
        method: 'DELETE',
        headers,
      }
    );
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to deactivate user');
    }
  },

  async toggleUserActive(id: number, isActive: boolean): Promise<UserListItem> {
    return this.updateUser(id, { is_active: isActive });
  },
};
