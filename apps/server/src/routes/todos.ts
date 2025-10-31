import type {
  CreateTodoRequest,
  CreateTodoResponse,
  DeleteTodoResponse,
  GetStatisticsResponse,
  ReorderTodosRequest,
  ReorderTodosResponse,
  UpdateTodoRequest,
  UpdateTodoResponse,
} from "@monorepo/types";
import { Router } from "express";
import {
  createTodo,
  deleteTodo as deleteTodoStore,
  getAllTodos,
  getStatistics,
  getTodoById,
  reorderTodos,
  updateTodo as updateTodoStore,
} from "../store/todo-store";

const todosRouter = Router();

// Get all todos
todosRouter.get("/", async (_, res) => {
  try {
    const todos = await getAllTodos();
    res.json(todos);
  } catch (error) {
    console.error("Error getting todos:", error);
    res.status(500).json({ error: "Failed to get todos" });
  }
});

// Create new todo
todosRouter.post("/", async (req, res) => {
  try {
    const { title, labels = [] }: CreateTodoRequest = req.body;

    if (!title || typeof title !== "string" || title.trim() === "") {
      return res.status(400).json({ error: "Title is required" });
    }

    if (!Array.isArray(labels)) {
      return res.status(400).json({ error: "Labels must be an array" });
    }

    const todo = await createTodo(title.trim(), labels);
    const response: CreateTodoResponse = todo;
    res.status(201).json(response);
  } catch (error) {
    console.error("Error creating todo:", error);
    res.status(500).json({ error: "Failed to create todo" });
  }
});

// Update todo
todosRouter.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updates: UpdateTodoRequest = req.body;

    const existingTodo = await getTodoById(id);
    if (!existingTodo) {
      return res.status(404).json({ error: "Todo not found" });
    }

    const updateData: Partial<{
      title: string;
      completed: boolean;
      labels: string[];
    }> = {};

    if (updates.title !== undefined) {
      if (typeof updates.title !== "string" || updates.title.trim() === "") {
        return res.status(400).json({ error: "Title must be a non-empty string" });
      }
      updateData.title = updates.title.trim();
    }

    if (updates.completed !== undefined) {
      if (typeof updates.completed !== "boolean") {
        return res.status(400).json({ error: "Completed must be a boolean" });
      }
      updateData.completed = updates.completed;
    }

    if (updates.labels !== undefined) {
      if (!Array.isArray(updates.labels)) {
        return res.status(400).json({ error: "Labels must be an array" });
      }
      updateData.labels = updates.labels;
    }

    const updatedTodo = await updateTodoStore(id, updateData);

    if (!updatedTodo) {
      return res.status(404).json({ error: "Todo not found" });
    }

    const response: UpdateTodoResponse = updatedTodo;
    res.json(response);
  } catch (error) {
    console.error("Error updating todo:", error);
    res.status(500).json({ error: "Failed to update todo" });
  }
});

// Delete todo
todosRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const success = await deleteTodoStore(id);

    if (!success) {
      return res.status(404).json({ error: "Todo not found" });
    }

    const response: DeleteTodoResponse = { success: true, id };
    res.json(response);
  } catch (error) {
    console.error("Error deleting todo:", error);
    res.status(500).json({ error: "Failed to delete todo" });
  }
});

// Reorder todos
todosRouter.patch("/reorder", async (req, res) => {
  try {
    const { items }: ReorderTodosRequest = req.body;

    if (!Array.isArray(items)) {
      return res.status(400).json({ error: "Items must be an array" });
    }

    for (const item of items) {
      if (!item.id || typeof item.id !== "string") {
        return res.status(400).json({ error: "Each item must have a valid id" });
      }
      if (typeof item.order !== "number") {
        return res.status(400).json({ error: "Each item must have a valid order number" });
      }
    }

    const success = await reorderTodos(items);

    if (!success) {
      return res.status(400).json({ error: "Failed to reorder todos" });
    }

    const response: ReorderTodosResponse = { success: true };
    res.json(response);
  } catch (error) {
    console.error("Error reordering todos:", error);
    res.status(500).json({ error: "Failed to reorder todos" });
  }
});

// Get statistics
todosRouter.get("/statistics", async (_, res) => {
  try {
    const statistics = await getStatistics();
    const response: GetStatisticsResponse = statistics;
    res.json(response);
  } catch (error) {
    console.error("Error getting statistics:", error);
    res.status(500).json({ error: "Failed to get statistics" });
  }
});

export default todosRouter;

