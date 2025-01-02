// client-layout.tsx
"use client";

import { useState, useEffect } from "react";
import MenuOptions from "@/components/globals/app-sidebar";

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex min-h-screen">
      {/* Fixed Sidebar */}
      <aside
        className={`fixed bottom-0 left-0 top-0 h-screen border-r border-gray-200 bg-white transition-all duration-300 ease-in-out dark:border-gray-800 dark:bg-[#1a1a1a] ${isMobile ? "w-14" : "w-16"} z-50 flex flex-col items-center py-4`}
      >
        <MenuOptions />
      </aside>

      {/* Scrollable Content Area */}
      <main
        className={`min-h-screen flex-1 ${isMobile ? "ml-14" : "ml-16"} overflow-y-auto overflow-x-hidden`}
      >
        <div className="h-full w-full max-w-full px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}
