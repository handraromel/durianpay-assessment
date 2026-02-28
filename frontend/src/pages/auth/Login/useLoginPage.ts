/**
 * Login page hook
 * Manages form state and integrates with login mutation
 */

import { useLoginMutation } from "@/hooks/mutations";
import { useLoadingStore } from "@/stores";
import type { LoginRequest } from "@/types/auth";
import { loginSchema } from "@/validations/schemas/auth.schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

export const useLoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>({
    resolver: yupResolver(loginSchema),
    mode: "onSubmit",
  });

  const loginMutation = useLoginMutation();
  const { isLoading } = useLoadingStore();

  const onSubmit = (data: LoginRequest) => {
    loginMutation.mutate(data);
  };

  return {
    register,
    handleSubmit,
    errors,
    onSubmit,
    isLoading,
  };
};
