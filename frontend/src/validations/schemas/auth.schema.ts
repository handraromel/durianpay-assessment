/**
 * Authentication validation schemas using Yup
 */

import { PASSWORD_MIN_LENGTH } from "@/constants";
import * as yup from "yup";

export const loginSchema = yup.object({
  email: yup
    .string()
    .required("Email is required")
    .email("Please enter a valid email address")
    .trim(),
  password: yup
    .string()
    .required("Password is required")
    .min(
      PASSWORD_MIN_LENGTH,
      `Password must be at least ${PASSWORD_MIN_LENGTH} characters`,
    ),
  // Stricter password validation is commented out during testing

  // .matches(
  //   PASSWORD_PATTERN,
  //   "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
  // ),
});

export type LoginFormData = yup.InferType<typeof loginSchema>;
