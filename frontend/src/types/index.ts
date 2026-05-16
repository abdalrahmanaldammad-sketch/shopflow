export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  emailVerified: boolean;
  mfaEnabled: boolean;
  authProvider: string;
  roles: string[];
  createdAt: string;
}

export interface AuthResponse {
  accessToken: string | null;
  tokenType: string | null;
  expiresIn: number | null;
  user: User | null;
  mfaRequired: boolean | null;
  mfaToken: string | null;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export interface ErrorResponse {
  status: number;
  error: string;
  message: string;
  path: string;
  validationErrors?: Record<string, string>;
}

export interface Session {
  id: string;
  ipAddress: string;
  browser: string;
  operatingSystem: string;
  deviceType: string;
  createdAt: string;
  lastUsedAt: string;
  expiresAt: string;
  current: boolean;
}

export interface MfaSetupResponse {
  secret: string | null;
  qrCodeUri: string | null;
  recoveryCodes: string[] | null;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface MfaLoginRequest {
  mfaToken: string;
  code: string;
}

export interface MfaRecoveryRequest {
  mfaToken: string;
  recoveryCode: string;
}
