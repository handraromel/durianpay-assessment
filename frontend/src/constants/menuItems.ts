import { type MenuItem } from "@/types";
import { BanknotesIcon, HomeIcon } from "@heroicons/react/24/outline";

export const MENU_ITEMS: MenuItem[] = [
  {
    labelKey: "Dashboard",
    href: "/dashboard",
    icon: HomeIcon,
  },
  {
    labelKey: "Payments",
    href: "/payments",
    icon: BanknotesIcon,
  },
];
