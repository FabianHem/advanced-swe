"use client";

import type { GetStatisticsResponse } from "@monorepo/types";
import { Card, CardContent } from "@monorepo/ui/components/card";
import { SidebarInset, SidebarTrigger } from "@monorepo/ui/components/sidebar";
import { TodoStatistics } from "../components/TodoStatistics";
import { AppSidebar } from "../components/app-sidebar";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

const API_BASE_URL = "http://localhost:3001/v1/todos/statistics";

// Deep comparison function to check if statistics data has changed
function areStatisticsEqual(
  a: GetStatisticsResponse | null,
  b: GetStatisticsResponse | null
): boolean {
  if (a === null || b === null) return a === b;
  if (a.total !== b.total || a.completed !== b.completed || a.pending !== b.pending) {
    return false;
  }
  if (a.byLabel.length !== b.byLabel.length) {
    return false;
  }
  for (let i = 0; i < a.byLabel.length; i++) {
    const aItem = a.byLabel[i];
    const bItem = b.byLabel[i];
    if (
      aItem.label !== bItem.label ||
      aItem.total !== bItem.total ||
      aItem.completed !== bItem.completed ||
      aItem.pending !== bItem.pending
    ) {
      return false;
    }
  }
  return true;
}

export default function StatisticsPage() {
  const [statistics, setStatistics] = useState<GetStatisticsResponse | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isInitialLoad = true;
    
    const fetchStatistics = async () => {
      try {
        // Only show loading on initial fetch
        if (isInitialLoad) {
          setLoading(true);
        }
        setError(null);
        const response = await fetch(API_BASE_URL);
        if (!response.ok) {
          throw new Error("Failed to fetch statistics");
        }
        const data: GetStatisticsResponse = await response.json();
        // Only update state if data has actually changed
        setStatistics((prev) => {
          if (prev && areStatisticsEqual(prev, data)) {
            return prev; // Return previous to avoid re-render
          }
          return data;
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error fetching statistics:", err);
      } finally {
        if (isInitialLoad) {
          setLoading(false);
          isInitialLoad = false;
        }
      }
    };

    fetchStatistics();

    // Refresh statistics every 5 seconds
    const interval = setInterval(fetchStatistics, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
        </header>
        <main className="p-8 max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Todo Statistics</h1>
            <p className="text-muted-foreground">
              View statistics and insights about your todos
            </p>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-destructive/10 border border-destructive rounded-lg text-destructive">
              {error}
            </div>
          )}

          {loading ? (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </CardContent>
            </Card>
          ) : statistics ? (
            <TodoStatistics statistics={statistics} />
          ) : (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No statistics available
              </CardContent>
            </Card>
          )}
        </main>
      </SidebarInset>
    </div>
  );
}

