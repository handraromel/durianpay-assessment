export interface LoginRequest {
  email: string;
  password: string;
}

export type UserRole = "cs" | "operation";

export interface User {
  email: string;
  role: UserRole;
}

export interface LoginSuccessResponse {
  email?: string;
  role?: string;
  token?: string;
  refreshToken?: string;
}

export interface RefreshTokenResponse {
  token?: string;
  refreshToken?: string;
}

export interface AuthError {
  code: string;
  message: string;
}
