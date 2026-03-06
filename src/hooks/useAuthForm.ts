import { useState, useCallback } from 'react';
import { useAuth } from '@/context/useAuth';
import { useSearchParams } from 'react-router-dom';

interface UseAuthFormReturn {
  email: string;
  setEmail: (email: string) => void;
  mode: 'login' | 'create';
  setMode: (mode: 'login' | 'create') => void;
  isLoading: boolean;
  error: string | null;
  success: string | null;
  emailValid: boolean | null;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  clearMessages: () => void;
}

const useAuthForm = (): UseAuthFormReturn => {
  const { requestMagicLink } = useAuth();
  const [searchParams] = useSearchParams();
  
  const [email, setEmail] = useState('');
  const [mode, setMode] = useState<'login' | 'create'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Email validation
  const emailValid = email.length === 0 ? null : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Extract invite_token from URL and store in sessionStorage
  const inviteToken = searchParams.get('invite_token');
  if (inviteToken) {
    sessionStorage.setItem('invite_token', inviteToken);
    // Try to decode and store email from invitation token
    const decodeInvitationToken = async () => {
      try {
        const { jwtDecode } = await import('jwt-decode');
        interface InvitationTokenPayload {
          email: string;
          organization_id: number;
          inviter_id: number;
          token_id: string;
          type: string;
          exp: number;
        }
        const decoded = jwtDecode<InvitationTokenPayload>(inviteToken);
        sessionStorage.setItem('invitation_email', decoded.email);
      } catch (error) {
        console.error('Failed to decode invitation token:', error);
      }
    };
    decodeInvitationToken();
  }

  const clearMessages = useCallback(() => {
    setError(null);
    setSuccess(null);
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    // Get invite_token from sessionStorage or URL
    const inviteToken = sessionStorage.getItem('invite_token') || searchParams.get('invite_token');
    const result = await requestMagicLink(email, inviteToken || undefined);

    if (result.success) {
      setSuccess(result.message || 'Magic link sent! Please check your email.');
      setIsLoading(false);
      // Clear form after successful submission
      setTimeout(() => {
        setEmail('');
      }, 1000);
    } else {
      setIsLoading(false);
      setError(result.message || 'Failed to send magic link. Please try again.');
    }
  }, [email, requestMagicLink, searchParams]);

  return {
    email,
    setEmail,
    mode,
    setMode,
    isLoading,
    error,
    success,
    emailValid,
    handleSubmit,
    clearMessages,
  };
};

export default useAuthForm;
