// 1. Tipos para los tokens recibidos de Django (Simple JWT)
export interface AuthTokens {
    access: string;
    refresh: string;
}

export interface RegistrationResponse {
    success: boolean;
    message?: string;
}

// 2. User type from backend
export interface User {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    is_active: boolean;
    is_staff: boolean;
    date_joined: string;
    profile: {
        bio: string;
        organization: string;
        position: string;
        date_of_birth: string | null;
        photo: string | null;
        updated_at: string;
        role: 'administrator' | 'volunteer';
    };
}

// 3. Tipos para el estado global del AuthContext
export interface AuthContextType {
    user: User | null;
    authToken: AuthTokens | null;
    loginUser: (username: string, password: string) => Promise<boolean>;
    registerUser: (email: string, password: string, password2: string) => Promise<RegistrationResponse>;
    requestMagicLink: (email: string, invite_token?: string) => Promise<{ success: boolean; message?: string }>;
    authenticateMagicLink: (token: string) => Promise<boolean>;
    refreshAuthToken: () => Promise<boolean>;
    getValidAccessToken: () => Promise<string | null>;
    logoutUser: () => void;
    fetchUser: () => Promise<void>;
    isLoading: boolean;
}

// 3. Tipos para la data de una Nota (si tu modelo solo tiene título y contenido)
export interface Nota {
    id: number;
    tittle: string;
    content: string;
    // Añade el campo de usuario si lo devuelves
    user: number; 
}