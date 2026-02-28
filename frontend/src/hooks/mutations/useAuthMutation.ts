/**
 * Authentication mutation hooks
 * Handles login, logout, and other auth-related mutations
 */

import { authService } from "@/services";
import { useLoadingStore, useNotificationStore, useUserStore } from "@/stores";
import type {
  LoginRequest,
  LoginSuccessResponse,
  User,
  UserRole,
} from "@/types/auth";
import { handleMutationError } from "@/utils/errorHandler";
import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import { useNavigate } from "react-router";

/**
 * Login mutation hook
 */
export const useLoginMutation = (): UseMutationResult<
  LoginSuccessResponse,
  Error,
  LoginRequest
> => {
  const navigate = useNavigate();
  const { setAuth } = useUserStore();
  const { startLoading, stopLoading } = useLoadingStore();
  const { showSuccess, showError } = useNotificationStore();

  return useMutation<LoginSuccessResponse, Error, LoginRequest>({
    mutationFn: (credentials: LoginRequest) => authService.login(credentials),
    onMutate: () => {
      startLoading();
    },
    onSuccess: (response: LoginSuccessResponse) => {
      stopLoading();

      const { token, refreshToken } = response;

      const user: User = {
        email: response.email || "",
        role: (response.role as UserRole) || "cs",
      };

      if (token && refreshToken) {
        setAuth(user, token, refreshToken);
      }

      showSuccess("Login successful");
      navigate("/dashboard");
    },
    onError: (error: Error) => {
      stopLoading();
      handleMutationError(error, showError, "Login failed. Please try again.");
    },
  });
};
