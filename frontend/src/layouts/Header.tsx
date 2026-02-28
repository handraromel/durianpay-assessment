import { ProfileDropdown } from "@/components";
import { MENU_ITEMS } from "@/constants/menuItems";
import { type HeaderProps } from "@/types/layout";
import { useMemo } from "react";
import { Link, useLocation } from "react-router";

export default function Header({
  onSidebarToggle,
  noUserProfile,
  noTitle,
}: HeaderProps) {
  const location = useLocation();

  // Get the current page title based on the active route
  const pageTitle = useMemo(() => {
    const currentPath = location.pathname;
    const menuItem = MENU_ITEMS.find((item) => item.href === currentPath);
    return menuItem?.labelKey || "Dashboard";
  }, [location.pathname]);

  return (
    <header className="border-border bg-background-elevated sticky top-0 z-40 w-full border-b">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        {/* Left Section - Logo & Sidebar Toggle */}
        <div className="flex items-center gap-4">
          {/* Sidebar Toggle Button (Mobile Only) */}
          <button
            onClick={onSidebarToggle}
            className="text-foreground-muted inline-flex items-center justify-center rounded-lg p-2 transition-colors hover:bg-[var(--background-surface)] md:hidden"
            aria-label="Toggle sidebar"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-foreground hidden text-lg font-bold sm:inline">
              {"Durian Pay Assessment"}
            </span>
          </Link>
        </div>

        {/* Center Section - Title */}
        {!noTitle && (
          <h1 className="text-foreground-muted text-sm font-semibold md:text-base">
            {pageTitle}
          </h1>
        )}

        {/* Right Section - User Profile */}
        <div className="flex items-center gap-4">
          {!noUserProfile && <ProfileDropdown />}
        </div>
      </div>
    </header>
  );
}
