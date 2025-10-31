"use client";

import { Button } from "@monorepo/ui/components/button";
import { SidebarInset, SidebarTrigger } from "@monorepo/ui/components/sidebar";
import { Loader2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { AppSidebar } from "./components/app-sidebar";

const MOTIVATION_API_URL = "http://localhost:3001/v1/motivations";

export default function Home() {
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMotivation = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(MOTIVATION_API_URL);
      if (!response.ok) {
        throw new Error("Failed to fetch motivation");
      }

      const data: { message: string } = await response.json();
      setMessage(data.message);
    } catch (err) {
      setMessage(null);
      setError(
        err instanceof Error ? err.message : "Unable to load motivation right now."
      );
      console.error("Error fetching motivation:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMotivation();
  }, [fetchMotivation]);

  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
        </header>
        <main className="flex flex-1 flex-col gap-4 p-6">
          <div className="flex flex-col items-center justify-center gap-10 min-h-[calc(100vh-8rem)]">
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

            <div className="w-full max-w-xl rounded-lg border bg-card p-6 text-center shadow-sm">
              <h2 className="text-2xl font-semibold mb-4">Motivation for today</h2>
              <div className="min-h-[4rem] flex items-center justify-center">
                {loading ? (
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                ) : error ? (
                  <p className="text-destructive">{error}</p>
                ) : (
                  <p className="text-lg font-medium text-foreground">
                    “{message ?? "Stay motivated and keep going!"}”
                  </p>
                )}
              </div>
              <div className="mt-6 flex justify-center">
                <Button onClick={fetchMotivation} disabled={loading} variant="outline">
                  {loading ? "Fetching..." : "Refresh motivation"}
                </Button>
              </div>
            </div>
          </div>
        </main>
      </SidebarInset>
    </div>
  );
}
