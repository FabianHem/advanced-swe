export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  labels: string[];
  order: number;
}

export interface CreateTodoRequest {
  title: string;
  labels?: string[];
}

export interface UpdateTodoRequest {
  title?: string;
  completed?: boolean;
  labels?: string[];
}

export interface ReorderTodosRequest {
  items: Array<{
    id: string;
    order: number;
  }>;
}

export type GetTodosResponse = Todo[];

export type CreateTodoResponse = Todo;

export type UpdateTodoResponse = Todo;

export type DeleteTodoResponse = {
  success: boolean;
  id: string;
};

export type ReorderTodosResponse = {
  success: boolean;
};

