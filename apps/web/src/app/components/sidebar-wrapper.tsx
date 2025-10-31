"use client";

import { SidebarProvider } from "@monorepo/ui/components/sidebar";

export function SidebarWrapper({ children }: { children: React.ReactNode }) {
  return <SidebarProvider>{children}</SidebarProvider>;
}

