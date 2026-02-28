export interface HeaderProps {
  onSidebarToggle?: () => void;
  noSearch?: boolean;
  noUserProfile?: boolean;
  noTitle?: boolean;
  isAbsolute?: boolean;
}

export interface LayoutProps {
  children: React.ReactNode;
}

export interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}
