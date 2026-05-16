import api from './client';
import type {
  ApiResponse,
  AuthResponse,
  RegisterRequest,
  LoginRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  MfaLoginRequest,
  MfaRecoveryRequest,
  MfaSetupResponse,
  User,
} from '@/types';

export const authApi = {
  register: (data: RegisterRequest) =>
    api.post<ApiResponse<null>>('/auth/register', data),

  login: (data: LoginRequest) =>
    api.post<ApiResponse<AuthResponse>>('/auth/login', data),

  refresh: () => api.post<ApiResponse<AuthResponse>>('/auth/refresh'),

  logout: () => api.post<ApiResponse<null>>('/auth/logout'),

  logoutAll: () => api.post<ApiResponse<null>>('/auth/logout-all'),

  verifyEmail: (token: string) =>
    api.get<ApiResponse<null>>(`/auth/verify-email?token=${token}`),

  resendVerification: (email: string) =>
    api.post<ApiResponse<null>>(`/auth/resend-verification?email=${email}`),

  forgotPassword: (data: ForgotPasswordRequest) =>
    api.post<ApiResponse<null>>('/auth/forgot-password', data),

  resetPassword: (data: ResetPasswordRequest) =>
    api.post<ApiResponse<null>>('/auth/reset-password', data),

  // MFA during login (public endpoints)
  mfaVerify: (data: MfaLoginRequest) =>
    api.post<ApiResponse<AuthResponse>>('/auth/mfa/verify', data),

  mfaRecovery: (data: MfaRecoveryRequest) =>
    api.post<ApiResponse<AuthResponse>>('/auth/mfa/recovery', data),

  // MFA management (authenticated endpoints)
  mfaSetup: () => api.post<ApiResponse<MfaSetupResponse>>('/auth/mfa/setup'),

  mfaVerifySetup: (secret: string, code: string) =>
    api.post<ApiResponse<MfaSetupResponse>>(
      `/auth/mfa/verify-setup?secret=${encodeURIComponent(secret)}`,
      { code }
    ),

  mfaDisable: (code: string) =>
    api.post<ApiResponse<null>>('/auth/mfa/disable', { code }),

  mfaRegenerateRecoveryCodes: (code: string) =>
    api.post<ApiResponse<string[]>>(
      '/auth/mfa/recovery-codes/regenerate',
      { code }
    ),

  me: () => api.get<ApiResponse<User>>('/me'),
};
