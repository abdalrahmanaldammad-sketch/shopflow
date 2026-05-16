import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '@/api/auth';
import { getApiError } from '@/api/client';
import toast from 'react-hot-toast';
import type { LoginRequest, RegisterRequest, AuthResponse } from '@/types';

export function useCurrentUser() {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const { data } = await authApi.me();
      return data.data;
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
    enabled: !!localStorage.getItem('access_token'),
  });
}

export function useRegister() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: RegisterRequest) => authApi.register(data),
    onSuccess: (response) => {
      toast.success(response.data.message);
      navigate('/login', {
        state: { message: 'Please check your email to verify your account.' },
      });
    },
    onError: (error) => {
      toast.error(getApiError(error));
    },
  });
}

export function useLogin() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: (response) => {
      const authData: AuthResponse = response.data.data;

      if (authData.mfaRequired) {
        navigate('/mfa-verify', {
          state: { mfaToken: authData.mfaToken },
        });
        return;
      }

      if (authData.accessToken) {
        localStorage.setItem('access_token', authData.accessToken);
        queryClient.invalidateQueries({ queryKey: ['currentUser'] });
        toast.success('Welcome back!');
        navigate('/dashboard');
      }
    },
    onError: (error) => {
      toast.error(getApiError(error));
    },
  });
}

export function useLogout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      localStorage.removeItem('access_token');
      queryClient.clear();
      toast.success('Logged out successfully');
      navigate('/login');
    },
    onError: () => {
      // Even on error, clean up client state
      localStorage.removeItem('access_token');
      queryClient.clear();
      navigate('/login');
    },
  });
}

export function useLogoutAll() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authApi.logoutAll(),
    onSuccess: () => {
      localStorage.removeItem('access_token');
      queryClient.clear();
      toast.success('All sessions terminated');
      navigate('/login');
    },
    onError: (error) => {
      // Clean up client state even on error
      localStorage.removeItem('access_token');
      queryClient.clear();
      toast.error(getApiError(error));
      navigate('/login');
    },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (email: string) => authApi.forgotPassword({ email }),
    onSuccess: () => {
      toast.success(
        'If an account with that email exists, a reset link has been sent.'
      );
    },
    onError: (error) => {
      toast.error(getApiError(error));
    },
  });
}

export function useResetPassword() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: { token: string; newPassword: string }) =>
      authApi.resetPassword(data),
    onSuccess: () => {
      toast.success('Password reset successfully. Please login.');
      navigate('/login');
    },
    onError: (error) => {
      toast.error(getApiError(error));
    },
  });
}

export function useVerifyEmail() {
  return useMutation({
    mutationFn: (token: string) => authApi.verifyEmail(token),
  });
}

export function useResendVerification() {
  return useMutation({
    mutationFn: (email: string) => authApi.resendVerification(email),
    onSuccess: () => {
      toast.success('Verification email sent. Check your inbox.');
    },
    onError: (error) => {
      toast.error(getApiError(error));
    },
  });
}
