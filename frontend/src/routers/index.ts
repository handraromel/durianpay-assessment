import { authRoutes } from "./auth";
import { protectedRoutes } from "./protected";

export const allRoutes = [...authRoutes, ...protectedRoutes];
