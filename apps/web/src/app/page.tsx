"use client";

import { SidebarInset, SidebarTrigger } from "@monorepo/ui/components/sidebar";
import { AppSidebar } from "./components/app-sidebar";

export default function Home() {
  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
        </header>
        <main className="flex flex-1 flex-col gap-4 p-6">
          <div className="flex flex-col items-center justify-center gap-6 min-h-[calc(100vh-8rem)]">
            <div className="text-center space-y-4 max-w-2xl">
              <h1 className="text-4xl font-bold tracking-tight">
                Welcome to Todo App
              </h1>
              <p className="text-xl text-muted-foreground">
                Manage your todos with drag-and-drop, labels, and statistics. 
                Use the sidebar to navigate to different sections of the app.
              </p>
              <p className="text-lg text-muted-foreground">
                Get started by creating your first todo or explore your statistics 
                to see insights about your productivity.
              </p>
            </div>
          </div>
        </main>
      </SidebarInset>
    </div>
  );
}
