"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { Header } from "@/components/header";
import { HeaderMobile } from "@/components/header-mobile";

export function HeaderWrapper() {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <HeaderMobile />;
  }

  return <Header />;
}
