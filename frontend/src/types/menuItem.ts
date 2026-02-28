import { type UserRole } from "@/types/auth";

export interface MenuItem {
  labelKey: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  roles?: UserRole[]; // If undefined, accessible to all authenticated users
}
