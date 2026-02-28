import { PageSkeleton, SuspenseLoader } from "@/components/common";
import { Layout } from "@/layouts";
import { useUserStore } from "@/stores";
import { isAuthenticated } from "@/utils/token";
import { Suspense } from "react";
import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router";
import { authRoutes } from "./auth";
import { protectedRoutes } from "./protected";

/**
 * Protected Route Guard
 * Redirects to login if user is not authenticated
 */
const ProtectedRoute = () => {
  const { isAuthenticated: storeAuth } = useUserStore();
  const hasToken = isAuthenticated();

  // Check both store and token
  if (!storeAuth || !hasToken) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

/**
 * Public Route Guard
 * Redirects to dashboard if user is already authenticated
 */
const PublicRoute = () => {
  const { isAuthenticated: storeAuth } = useUserStore();
  const hasToken = isAuthenticated();

  // If user is authenticated, redirect to dashboard
  if (storeAuth && hasToken) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes (auth pages) */}
        <Route element={<PublicRoute />}>
          {authRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={
                <Suspense fallback={<SuspenseLoader />}>
                  <route.element />
                </Suspense>
              }
            />
          ))}
        </Route>

        {/* Protected routes (requires authentication) */}
        <Route element={<ProtectedRoute />}>
          <Route
            element={
              <Layout>
                <Outlet />
              </Layout>
            }
          >
            {protectedRoutes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={
                  <Suspense fallback={<PageSkeleton />}>
                    <route.element />
                  </Suspense>
                }
              />
            ))}
          </Route>
        </Route>

        {/* Fallback route - redirect to login if not found */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
