"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const isMobile = useIsMobile();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" disabled>
        <Sun className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className={`relative cursor-pointer ${isMobile ? "bg-transparent hover:bg-slate-300/20" : ""}`}
    >
      <Sun
        className={`h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 ${isMobile ? "text-white dark:text-slate-400" : ""}`}
      />
      <Moon
        className={`absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 ${isMobile ? "text-slate-400 dark:text-white" : ""}`}
      />
      <span className="sr-only">Alternar tema</span>
    </Button>
  );
}
