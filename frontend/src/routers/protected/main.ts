import { lazy } from "react";

const DashboardPage = lazy(() => import("@/pages/Dashboard"));
const PaymentPage = lazy(() => import("@/pages/Payment"));

export const mainRoutes = [
  {
    path: "/",
    element: DashboardPage,
  },
  {
    path: "/dashboard",
    element: DashboardPage,
  },
  {
    path: "/payments",
    element: PaymentPage,
  },
];
