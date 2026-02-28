import { type LayoutProps } from "@/types/layout";
import { useState } from "react";
import Footer from "./Footer";
import Header from "./Header";
import Sidebar from "./Sidebar";

export const Layout = ({ children }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen flex-col bg-background text-foreground">
      <Header onSidebarToggle={() => setSidebarOpen(!sidebarOpen)} />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="flex flex-1 flex-col overflow-hidden">
          <main className="flex-1 overflow-y-auto">
            <div className="mx-auto w-full max-w-375 px-4 py-6 md:px-6 lg:px-8">
              {children}
            </div>
          </main>

          <Footer />
        </div>
      </div>
    </div>
  );
};
