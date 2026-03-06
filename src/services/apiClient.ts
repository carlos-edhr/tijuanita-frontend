// API client with automatic token refresh
import { tokenManager, getValidAccessToken } from './tokenManager';

export { getValidAccessToken };

// Authenticated fetch wrapper
export const authenticatedFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const accessToken = await getValidAccessToken();
  if (!accessToken) {
    throw new Error('No valid access token available');
  }
  
  const headers = new Headers(options.headers);
  headers.set('Authorization', `Bearer ${accessToken}`);
  
  // Only set Content-Type if not FormData and not already set
  if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  
  const response = await fetch(url, {
    ...options,
    headers,
  });
  
  if (response.status === 401) {
    tokenManager.clearTokens();
    throw new Error('Authentication failed');
  }
  
  return response;
};

// Helper to create authenticated request options
export const getAuthHeaders = async (): Promise<Record<string, string>> => {
  const accessToken = await getValidAccessToken();
  if (!accessToken) {
    throw new Error('No valid access token available');
  }
  return {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  };
};

// Public fetch wrapper (no authentication required)
export const publicFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const headers = new Headers(options.headers);
  
  // Only set Content-Type if not FormData and not already set
  if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  
  const response = await fetch(url, {
    ...options,
    headers,
  });
  
  return response;
};
