import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '@/api/auth';
import { getApiError } from '@/api/client';
import toast from 'react-hot-toast';
import type { AuthResponse } from '@/types';

export function useMfaSetup() {
  return useMutation({
    mutationFn: () => authApi.mfaSetup(),
    onError: (error) => {
      toast.error(getApiError(error));
    },
  });
}

export function useMfaVerifySetup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ secret, code }: { secret: string; code: string }) =>
      authApi.mfaVerifySetup(secret, code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      toast.success('MFA enabled successfully!');
    },
    onError: (error) => {
      toast.error(getApiError(error));
    },
  });
}

export function useMfaDisable() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (code: string) => authApi.mfaDisable(code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      toast.success('MFA has been disabled');
    },
    onError: (error) => {
      toast.error(getApiError(error));
    },
  });
}

export function useMfaRegenerateRecoveryCodes() {
  return useMutation({
    mutationFn: (code: string) => authApi.mfaRegenerateRecoveryCodes(code),
    onError: (error) => {
      toast.error(getApiError(error));
    },
  });
}

export function useMfaLogin() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { mfaToken: string; code: string }) =>
      authApi.mfaVerify(data),
    onSuccess: (response) => {
      const authData: AuthResponse = response.data.data;
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

export function useMfaRecoveryLogin() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { mfaToken: string; recoveryCode: string }) =>
      authApi.mfaRecovery(data),
    onSuccess: (response) => {
      const authData: AuthResponse = response.data.data;
      if (authData.accessToken) {
        localStorage.setItem('access_token', authData.accessToken);
        queryClient.invalidateQueries({ queryKey: ['currentUser'] });
        toast.success('Logged in with recovery code');
        navigate('/dashboard');
      }
    },
    onError: (error) => {
      toast.error(getApiError(error));
    },
  });
}
