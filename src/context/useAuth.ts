
import { useContext } from 'react';
import { AuthContext } from './AuthProvider';
import type { AuthContextType } from '@/types/auth';


// Tipamos la función useAuth
export const useAuth = (): AuthContextType => useContext(AuthContext);