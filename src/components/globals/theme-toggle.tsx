"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

export function ModeToggle() {
  const { setTheme, theme } = useTheme();

  // State to prevent hydration error
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Set mounted to true once the component is mounted on the client
    setMounted(true);
  }, []);

  // Return null or a loading state until the component has mounted
  if (!mounted) {
    return null;
  }

  const handleThemeToggle = () => {
    if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleThemeToggle}
      className={`relative flex transform items-center justify-center overflow-hidden rounded-full p-2 transition-all hover:rotate-6 hover:scale-110 focus:outline-none ${theme === "light" ? "focus:ring-[var(--primary)] dark:focus:ring-[var(--primary)]" : "focus:ring-[var(--secondary)] dark:focus:ring-[var(--secondary)]"} "}`}
    >
      {/* Sun Icon */}
      <Sun
        className={`absolute h-[1.4rem] w-[1.4rem] transform transition-all duration-500 ease-in-out ${
          theme === "dark"
            ? "rotate-90 scale-0 opacity-0"
            : "rotate-0 scale-100 opacity-100"
        }`}
      />
      {/* Moon Icon */}
      <Moon
        className={`absolute h-[1.4rem] w-[1.4rem] transform transition-all duration-500 ease-in-out ${
          theme === "light"
            ? "rotate-0 scale-0 opacity-0"
            : "rotate-0 scale-100 opacity-100"
        }`}
      />
      <span className="sr-only">Toggle theme</span>

      {/* Circular animation background */}
      <span
        className={`absolute inset-0 scale-0 rounded-full bg-[var(--primary)] opacity-0 transition-all duration-500 ease-in-out dark:bg-[var(--secondary)] ${theme === "light" ? "animate-expand-light" : "animate-expand-dark"}`}
      />
    </Button>
  );
}
