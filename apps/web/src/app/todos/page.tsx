"use client";

import type {
  CreateTodoRequest,
  ReorderTodosRequest,
  Todo,
  UpdateTodoRequest,
} from "@monorepo/types";
import { Card, CardContent, CardHeader, CardTitle } from "@monorepo/ui/components/card";
import { SidebarInset, SidebarTrigger } from "@monorepo/ui/components/sidebar";
import { CreateTodoForm } from "../components/CreateTodoForm";
import { TodoList } from "../components/TodoList";
import { AppSidebar } from "../components/app-sidebar";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

const API_BASE_URL = "http://localhost:3001/v1/todos";

export default function TodosPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(API_BASE_URL);
      if (!response.ok) {
        throw new Error("Failed to fetch todos");
      }
      const data: Todo[] = await response.json();
      setTodos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error fetching todos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleCreateTodo = async (title: string, labels: string[]) => {
    try {
      setCreating(true);
      setError(null);
      const request: CreateTodoRequest = { title, labels };
      const response = await fetch(API_BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error("Failed to create todo");
      }

      await fetchTodos();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create todo");
      console.error("Error creating todo:", err);
    } finally {
      setCreating(false);
    }
  };

  const handleToggleTodo = async (id: string) => {
    try {
      const todo = todos.find((t) => t.id === id);
      if (!todo) return;

      const request: UpdateTodoRequest = {
        completed: !todo.completed,
      };

      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error("Failed to update todo");
      }

      await fetchTodos();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update todo");
      console.error("Error updating todo:", err);
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete todo");
      }

      await fetchTodos();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete todo");
      console.error("Error deleting todo:", err);
    }
  };

  const handleReorderTodos = async (
    items: Array<{ id: string; order: number }>
  ) => {
    try {
      const request: ReorderTodosRequest = { items };
      const response = await fetch(`${API_BASE_URL}/reorder`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error("Failed to reorder todos");
      }

      await fetchTodos();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reorder todos");
      console.error("Error reordering todos:", err);
    }
  };

  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
        </header>
        <main className="p-8 max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Todo List</h1>
            <p className="text-muted-foreground">
              Manage your todos with drag-and-drop reordering
            </p>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-destructive/10 border border-destructive rounded-lg text-destructive">
              {error}
            </div>
          )}

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Create New Todo</CardTitle>
              </CardHeader>
              <CardContent>
                <CreateTodoForm onSubmit={handleCreateTodo} isLoading={creating} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Your Todos</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <TodoList
                    todos={todos}
                    onToggle={handleToggleTodo}
                    onDelete={handleDeleteTodo}
                    onReorder={handleReorderTodos}
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </SidebarInset>
    </div>
  );
}

