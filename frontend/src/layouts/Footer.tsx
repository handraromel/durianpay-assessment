export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-border bg-background-elevated border-t">
      <div className="px-4 py-4 md:px-6">
        {/* Single Row Layout */}
        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row sm:items-end">
          {/* Brand & Description */}
          <div className="flex flex-col items-center gap-1 sm:items-start">
            <span className="text-foreground text-sm font-semibold">
              {"Durian Pay Assessment"}
            </span>
          </div>

          {/* Copyright */}
          <p className="text-foreground-muted text-xs">
            &copy; {currentYear} {"Durian Pay Assessment"}
          </p>
        </div>
      </div>
    </footer>
  );
}
