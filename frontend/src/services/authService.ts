/**
 * Authentication API services
 * Handles all auth-related HTTP requests
 */

import { API_ENDPOINTS } from "@/constants";
import type {
  LoginRequest,
  LoginSuccessResponse,
  RefreshTokenResponse,
} from "@/types/auth";
import { httpPost } from "@/utils/httpClient";

export const authService = {
  // Login user with email and password
  login: async (credentials: LoginRequest): Promise<LoginSuccessResponse> => {
    return httpPost<LoginSuccessResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials,
    );
  },

  // Refresh access token using refresh token
  refresh: async (refreshToken: string): Promise<RefreshTokenResponse> => {
    return httpPost<RefreshTokenResponse>(API_ENDPOINTS.AUTH.REFRESH, {
      refreshToken,
    });
  },
};
