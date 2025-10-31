import { promises as fs } from "fs";
import { join } from "path";
import type { Todo, TodoStatistics } from "@monorepo/types";

const DATA_DIR = join(process.cwd(), "data");
const DATA_FILE = join(DATA_DIR, "todos.json");

// Ensure data directory exists
async function ensureDataDir(): Promise<void> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (error) {
    // Directory might already exist, ignore error
  }
}

// Load todos from file
async function loadTodos(): Promise<Todo[]> {
  try {
    await ensureDataDir();
    const data = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(data) as Todo[];
  } catch (error) {
    // File doesn't exist or is invalid, return empty array
    return [];
  }
}

// Save todos to file
async function saveTodos(todos: Todo[]): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(DATA_FILE, JSON.stringify(todos, null, 2), "utf-8");
}

// Get all todos (sorted by order)
export async function getAllTodos(): Promise<Todo[]> {
  const todos = await loadTodos();
  return todos.sort((a, b) => a.order - b.order);
}

// Get todo by id
export async function getTodoById(id: string): Promise<Todo | null> {
  const todos = await loadTodos();
  return todos.find((todo) => todo.id === id) || null;
}

// Create new todo
export async function createTodo(
  title: string,
  labels: string[] = []
): Promise<Todo> {
  const todos = await loadTodos();
  const maxOrder = todos.length > 0 ? Math.max(...todos.map((t) => t.order)) : -1;
  
  const newTodo: Todo = {
    id: crypto.randomUUID(),
    title,
    completed: false,
    labels,
    order: maxOrder + 1,
  };

  todos.push(newTodo);
  await saveTodos(todos);
  return newTodo;
}

// Update todo
export async function updateTodo(
  id: string,
  updates: Partial<Pick<Todo, "title" | "completed" | "labels">>
): Promise<Todo | null> {
  const todos = await loadTodos();
  const index = todos.findIndex((todo) => todo.id === id);

  if (index === -1) {
    return null;
  }

  todos[index] = {
    ...todos[index],
    ...updates,
  };

  await saveTodos(todos);
  return todos[index];
}

// Delete todo
export async function deleteTodo(id: string): Promise<boolean> {
  const todos = await loadTodos();
  const initialLength = todos.length;
  const filtered = todos.filter((todo) => todo.id !== id);

  if (filtered.length === initialLength) {
    return false;
  }

  await saveTodos(filtered);
  return true;
}

// Reorder todos
export async function reorderTodos(
  items: Array<{ id: string; order: number }>
): Promise<boolean> {
  const todos = await loadTodos();
  const orderMap = new Map(items.map((item) => [item.id, item.order]));

  let updated = false;
  for (const todo of todos) {
    const newOrder = orderMap.get(todo.id);
    if (newOrder !== undefined && newOrder !== todo.order) {
      todo.order = newOrder;
      updated = true;
    }
  }

  if (updated) {
    await saveTodos(todos);
  }

  return updated;
}

// Get statistics
export async function getStatistics(): Promise<TodoStatistics> {
  const todos = await loadTodos();
  const total = todos.length;
  const completed = todos.filter((todo) => todo.completed).length;
  const pending = total - completed;

  // Count by label
  const labelMap = new Map<
    string,
    { total: number; completed: number; pending: number }
  >();

  for (const todo of todos) {
    for (const label of todo.labels) {
      if (!labelMap.has(label)) {
        labelMap.set(label, { total: 0, completed: 0, pending: 0 });
      }

      const stats = labelMap.get(label)!;
      stats.total++;
      if (todo.completed) {
        stats.completed++;
      } else {
        stats.pending++;
      }
    }
  }

  const byLabel = Array.from(labelMap.entries())
    .map(([label, stats]) => ({
      label,
      ...stats,
    }))
    .sort((a, b) => b.total - a.total);

  return {
    total,
    completed,
    pending,
    byLabel,
  };
}

