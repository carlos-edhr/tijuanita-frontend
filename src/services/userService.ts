// User-related API calls
import { API_BASE_URL } from "../config";
import { authenticatedFetch } from "./apiClient";

export interface UserProfileData {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  is_active: boolean
  is_staff: boolean
  date_joined: string
  profile: {
    bio: string
    organization: string
    position: string
    date_of_birth: string | null
    photo: string | null
    updated_at: string
  }
}

export interface UpdateProfileData {
  first_name?: string
  last_name?: string
  email?: string
  profile?: {
    bio?: string
    organization?: string
    position?: string
    date_of_birth?: string
    photo?: string | null
  }
}

export const userService = {
  async getProfile(): Promise<UserProfileData> {
    const response = await authenticatedFetch(`${API_BASE_URL}/account/me/`, {
      method: 'GET',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.detail || errorData.message || 'Failed to fetch profile'
      );
    }

    return response.json();
  },

  async updateProfile(
    data: UpdateProfileData
  ): Promise<UserProfileData> {
    const response = await authenticatedFetch(`${API_BASE_URL}/account/me/update/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.detail || errorData.message || 'Failed to update profile'
      );
    }

    return response.json();
  },

  async uploadProfilePhoto(
    photoFile: File
  ): Promise<UserProfileData> {
    const formData = new FormData();
    
    // Use consistent field name that matches backend expectation
    formData.append('photo', photoFile);

    const response = await authenticatedFetch(`${API_BASE_URL}/account/me/update/`, {
      method: 'PATCH',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.detail || errorData.message || 'Failed to upload photo'
      );
    }

    return response.json();
  },

  async removeProfilePhoto(): Promise<UserProfileData> {
    const response = await authenticatedFetch(`${API_BASE_URL}/account/me/update/`, {
      method: 'PATCH',
      body: JSON.stringify({
        photo: null,  // Send null to clear the photo
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.detail || errorData.message || 'Failed to remove photo'
      );
    }

    return response.json();
  },

  async changePassword(
    currentPassword: string,
    newPassword: string,
    confirmPassword: string
  ): Promise<{ message: string }> {
    const response = await authenticatedFetch(`${API_BASE_URL}/account/change-password/`, {
      method: 'POST',
      body: JSON.stringify({
        current_password: currentPassword,
        new_password: newPassword,
        new_password2: confirmPassword,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.detail || errorData.message || 'Failed to change password'
      );
    }

    return response.json();
  },

  async getUserProfile(username: string): Promise<UserProfileData> {
    const response = await authenticatedFetch(`${API_BASE_URL}/account/users/${username}/`, {
      method: 'GET',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.detail || errorData.message || 'Failed to fetch user profile'
      );
    }

    return response.json();
  },
};