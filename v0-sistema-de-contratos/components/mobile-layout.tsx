"use client";

import { useIsMobile } from "@/hooks/use-mobile";

interface MobileLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function MobileLayout({ children, className }: MobileLayoutProps) {
  const isMobile = useIsMobile();

  if (!isMobile) return null;

  return <div className={`mb-20 ${className || ""}`}>{children}</div>;
}
