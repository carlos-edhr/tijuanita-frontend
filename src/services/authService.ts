// Authentication-related API calls
import { API_BASE_URL } from "../config";
import { getValidAccessToken } from "./apiClient";

interface PasswordResetConfirm {
  token: string
  password: string
  password2: string
}

interface LoginCredentials {
  username: string
  password: string
}

interface RegistrationCredentials {
  email: string
  password: string
  password2: string
}

interface TokenResponse {
  access: string
  refresh: string
}

interface RegistrationResponse {
  success: boolean
  access?: string
  refresh?: string
  user?: {
    id: number;
    email: string;
    username: string;
  }
  message?: string
}

interface MagicLinkRequest {
  email: string
  invite_token?: string
}

interface MagicLinkResponse {
  success: boolean
  message?: string
}

// In-memory token store (for notificationsService and other services)
// Tokens are set by AuthProvider after successful authentication
let storedTokens: TokenResponse | null = null;

export const setStoredTokens = (tokens: TokenResponse | null) => {
  storedTokens = tokens;
};

export const getStoredTokens = (): TokenResponse | null => {
  return storedTokens;
};

// Generate random particle positions (outside of render)
const generateParticlePositions = (count: number) => {
  return Array.from({ length: count }, () => ({
    left: Math.random() * 100,
    top: Math.random() * 100
  }));
};


export const authService = {
  async login(credentials: LoginCredentials): Promise<TokenResponse> {
    const response = await fetch(`${API_BASE_URL}/token/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || errorData.message || 'Login failed');
    }

    return response.json();
  },

  async register(credentials: RegistrationCredentials): Promise<RegistrationResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/account/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (response.status === 201) {
        const data = await response.json();
        return {
          success: true,
          access: data.access,
          refresh: data.refresh,
          user: data.user
        };
      } else if (response.status === 400) {
        const errorData = await response.json();
        let errorMessage = 'Registration failed';
        
        // Handle different error formats from Django
        if (errorData.email) errorMessage = errorData.email[0];
        else if (errorData.password) errorMessage = errorData.password[0];
        else if (errorData.non_field_errors) errorMessage = errorData.non_field_errors[0];
        
        return {
          success: false,
          message: errorMessage
        };
      } else {
        return {
          success: false,
          message: 'Registration failed. Please try again.'
        };
      }
    } catch (error) {
      return {
        success: false,
        message: 'Network error. Please check your connection.'
      };
    }
  },

  async refreshToken(refreshToken: string): Promise<TokenResponse> {
    const response = await fetch(`${API_BASE_URL}/token/refresh/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || errorData.message || 'Token refresh failed');
    }

    return response.json();
  },

  async requestPasswordReset(email: string): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/account/password-reset/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        return { success: true, message: 'Password reset link sent to your email' }
      } else {
        const errorData = await response.json()
        return { 
          success: false, 
          message: errorData.detail || errorData.message || 'Failed to send reset link' 
        }
      }
    } catch (error) {
      return { 
        success: false, 
        message: 'Network error. Please check your connection.' 
      }
    }
  },

  async confirmPasswordReset(credentials: PasswordResetConfirm): Promise<RegistrationResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/account/password-reset/confirm/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      })

      if (response.ok) {
        const data = await response.json()
        return {
          success: true,
          access: data.access,
          refresh: data.refresh,
          user: data.user,
          message: data.message
        }
      } else {
        const errorData = await response.json()
        return {
          success: false,
          message: errorData.error || errorData.message || 'Password reset failed'
        }
      }
    } catch (error) {
      return {
        success: false,
        message: 'Network error. Please check your connection.'
      }
    }
  },

  async requestMagicLink(email: string, invite_token?: string): Promise<MagicLinkResponse> {
    try {
      const requestData: MagicLinkRequest = { email }
      if (invite_token) {
        requestData.invite_token = invite_token
      }
      const response = await fetch(`${API_BASE_URL}/account/magic-link/request/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      })

      if (response.ok) {
        return { 
          success: true, 
          message: 'Magic link sent to your email. Please check your inbox.' 
        }
      } else {
        const errorData = await response.json()
        return { 
          success: false, 
          message: errorData.detail || errorData.message || 'Failed to send magic link' 
        }
      }
    } catch (error) {
      return { 
        success: false, 
        message: 'Network error. Please check your connection.' 
      }
    }
  },

  async authenticateMagicLink(token: string): Promise<TokenResponse> {
    const response = await fetch(`${API_BASE_URL}/account/magic-link/authenticate/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.detail || errorData.message || 'Magic link authentication failed')
    }

    const data = await response.json()
    return data
  },

  async logout(refreshToken: string): Promise<{ success: boolean; message?: string }> {
    try {
      const accessToken = await getValidAccessToken();
      const response = await fetch(`${API_BASE_URL}/account/logout/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (response.ok) {
        return { success: true, message: 'Successfully logged out' };
      } else {
        const errorData = await response.json().catch(() => ({}));
        return { 
          success: false, 
          message: errorData.error || errorData.message || 'Logout failed' 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        message: 'Network error during logout' 
      };
    }
  },

  // Get current stored tokens (for notifications service)
  getToken: (): TokenResponse | null => {
    return storedTokens;
  },

  // Utility function for particle positions
  generateParticlePositions
};
