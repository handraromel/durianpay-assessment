import { AUTH_ENDPOINTS } from "./auth";
import { PAYMENT_ENDPOINTS } from "./payment";
import { USER_ENDPOINTS } from "./user";

export const API_ENDPOINTS = {
  AUTH: AUTH_ENDPOINTS,
  PAYMENT: PAYMENT_ENDPOINTS,
  USER: USER_ENDPOINTS,
} as const;
