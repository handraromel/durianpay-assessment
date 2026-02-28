import { lazy } from "react";

const LoginPage = lazy(() => import("@/pages/auth/Login"));

export const authRoutes = [
  {
    path: "/login",
    element: LoginPage,
  },
];
