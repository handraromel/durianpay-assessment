import {
  EyeIcon,
  KeyIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

// Default action icons and colors
export const DEFAULT_ACTION_CONFIG = {
  view: {
    icon: <EyeIcon className="h-5 w-5" />,
    colorClass: "text-(--sda-cyan) hover:bg-(--sda-cyan)/20",
  },
  edit: {
    icon: <PencilSquareIcon className="h-5 w-5" />,
    colorClass: "text-(--sda-orange) hover:bg-(--sda-orange)/20",
  },
  delete: {
    icon: <TrashIcon className="h-5 w-5" />,
    colorClass: "text-(--sda-red) hover:bg-(--sda-red)/20",
  },
  password: {
    icon: <KeyIcon className="h-5 w-5" />,
    colorClass: "text-(--sda-purple) hover:bg-(--sda-purple)/20",
  },
  custom: {
    icon: null,
    colorClass: "text-(--sda-foreground) hover:bg-gray-500/20",
  },
};
