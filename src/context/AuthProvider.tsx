import React, { useState, useEffect, createContext } from 'react';
import type { AuthContextType, AuthTokens, User } from '@/types/auth';
import { authService, setStoredTokens } from '@/services/authService';
import { userService } from '@/services/userService';
import { tokenManager, getValidAccessToken } from '@/services/tokenManager';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [authToken, setAuthToken] = useState<AuthTokens | null>(() => {
        return tokenManager.getTokens();
    });

    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = tokenManager.addListener(() => {
            setAuthToken(tokenManager.getTokens());
        });
        return unsubscribe;
    }, []);

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (authToken?.access) {
                try {
                    const userData = await userService.getProfile();
                    setUser(userData);
                } catch (error) {
                    console.error('Failed to fetch user profile:', error);
                    setUser(null);
                }
            } else {
                setUser(null);
            }
            setIsLoading(false);
        };

        fetchUserProfile();
    }, [authToken]);

    const loginUser = async (username: string, password: string): Promise<boolean> => {
        try {
            const tokens = await authService.login({ username, password });
            if (tokens.access && tokens.refresh) {
                const newAuthToken = { access: tokens.access, refresh: tokens.refresh };
                tokenManager.setTokens(newAuthToken);
                setStoredTokens(newAuthToken);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Login error:', error);
            return false;
        }
    };

    const registerUser = async (email: string, password: string, password2: string) => {
        const result = await authService.register({ email, password, password2 });
        
        if (result.success && result.access && result.refresh) {
            const newAuthToken = { access: result.access, refresh: result.refresh };
            tokenManager.setTokens(newAuthToken);
            setStoredTokens(newAuthToken);
            
            if (result.user) {
                setUser(result.user);
            }
        }
        
        return result;
    };

    const requestMagicLink = async (email: string, invite_token?: string): Promise<{ success: boolean; message?: string }> => {
        return await authService.requestMagicLink(email, invite_token);
    };

    const authenticateMagicLink = async (token: string): Promise<boolean> => {
        try {
            const tokens = await authService.authenticateMagicLink(token);
            
            if (tokens.access && tokens.refresh) {
                const newAuthToken = { access: tokens.access, refresh: tokens.refresh };
                tokenManager.setTokens(newAuthToken);
                setStoredTokens(newAuthToken);
                return true;
            }
            
            console.error('No tokens in response:', tokens);
            return false;
        } catch (error) {
            console.error('Magic link authentication error:', error);
            return false;
        }
    };

    const logoutUser = async () => {
        const tokens = tokenManager.getTokens();
        if (tokens?.refresh) {
            try {
                await authService.logout(tokens.refresh);
            } catch (error) {
                console.error('Logout error:', error);
            }
        }
        
        tokenManager.clearTokens();
        setStoredTokens(null);
        setUser(null);
    };

    const refreshAuthToken = async (): Promise<boolean> => {
        const result = await tokenManager.refreshToken();
        return result !== null;
    };

    const fetchUser = async () => {
        try {
            const userData = await userService.getProfile();
            setUser(userData);
        } catch (error) {
            console.error('Failed to fetch user profile:', error);
        }
    };

    const contextData: AuthContextType = { 
        user, 
        authToken, 
        loginUser, 
        registerUser,
        requestMagicLink,
        authenticateMagicLink,
        logoutUser,
        getValidAccessToken,
        refreshAuthToken,
        fetchUser,
        isLoading,
    };

    return (
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
