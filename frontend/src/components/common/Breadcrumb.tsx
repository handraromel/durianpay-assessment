import type { BreadcrumbProps } from "@/types/breadcrumb";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router";

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-2 text-sm">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <div key={index} className="flex items-center gap-2">
            {item.href && !isLast ? (
              <Link
                to={item.href}
                className="text-gray-600 transition-colors hover:text-gray-900"
              >
                {item.label}
              </Link>
            ) : (
              <span
                className={
                  isLast ? "font-medium text-gray-900" : "text-gray-600"
                }
              >
                {item.label}
              </span>
            )}

            {!isLast && <ChevronRightIcon className="h-4 w-4 text-gray-400" />}
          </div>
        );
      })}
    </nav>
  );
}
