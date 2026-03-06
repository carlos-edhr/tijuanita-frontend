import { jwtDecode } from 'jwt-decode';
import { authService } from './authService';

export interface AuthTokens {
  access: string;
  refresh: string;
}

interface CustomJwtPayload {
  exp?: number;
  user_id?: number;
  username?: string;
  email?: string;
}

const STORAGE_KEY = 'authToken';

const isTokenExpired = (token: string): boolean => {
  try {
    const decodedToken = jwtDecode<CustomJwtPayload>(token);
    const currentTime = Date.now() / 1000;
    return decodedToken.exp ? decodedToken.exp < currentTime : true;
  } catch {
    return true;
  }
};

const readTokensFromStorage = (): AuthTokens | null => {
  const tokenString = localStorage.getItem(STORAGE_KEY);
  if (!tokenString) return null;
  try {
    return JSON.parse(tokenString) as AuthTokens;
  } catch {
    return null;
  }
};

const writeTokensToStorage = (tokens: AuthTokens): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tokens));
};

const clearTokensFromStorage = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};

let refreshPromise: Promise<string | null> | null = null;
const tokenListeners: Set<() => void> = new Set();

const notifyListeners = () => {
  tokenListeners.forEach(listener => listener());
};

export const tokenManager = {
  getTokens: (): AuthTokens | null => {
    return readTokensFromStorage();
  },

  setTokens: (tokens: AuthTokens): void => {
    writeTokensToStorage(tokens);
    notifyListeners();
  },

  clearTokens: (): void => {
    clearTokensFromStorage();
    notifyListeners();
  },

  getAccessToken: (): string | null => {
    const tokens = readTokensFromStorage();
    return tokens?.access || null;
  },

  isAccessTokenExpired: (): boolean => {
    const tokens = readTokensFromStorage();
    if (!tokens?.access) return true;
    return isTokenExpired(tokens.access);
  },

  refreshToken: async (): Promise<string | null> => {
    const tokens = readTokensFromStorage();
    
    if (!tokens?.refresh) {
      clearTokensFromStorage();
      return null;
    }

    if (refreshPromise) {
      return refreshPromise;
    }

    refreshPromise = (async () => {
      try {
        const newTokens = await authService.refreshToken(tokens.refresh);
        writeTokensToStorage(newTokens);
        notifyListeners();
        return newTokens.access;
      } catch (error) {
        console.error('Token refresh failed:', error);
        clearTokensFromStorage();
        notifyListeners();
        return null;
      } finally {
        refreshPromise = null;
      }
    })();

    return refreshPromise;
  },

  getValidAccessToken: async (): Promise<string | null> => {
    const tokens = readTokensFromStorage();
    
    if (!tokens?.access) {
      return null;
    }

    if (!isTokenExpired(tokens.access)) {
      return tokens.access;
    }

    return tokenManager.refreshToken();
  },

  addListener: (listener: () => void): (() => void) => {
    tokenListeners.add(listener);
    return () => {
      tokenListeners.delete(listener);
    };
  },
};

export const getValidAccessToken = tokenManager.getValidAccessToken;
