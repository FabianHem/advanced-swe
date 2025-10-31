"use client";

import type { Todo } from "@monorepo/types";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { TodoItem } from "./TodoItem";

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onReorder: (items: Array<{ id: string; order: number }>) => void;
}

export function TodoList({
  todos,
  onToggle,
  onDelete,
  onReorder,
}: TodoListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = todos.findIndex((todo) => todo.id === active.id);
      const newIndex = todos.findIndex((todo) => todo.id === over.id);

      const reorderedTodos = [...todos];
      const [movedTodo] = reorderedTodos.splice(oldIndex, 1);
      reorderedTodos.splice(newIndex, 0, movedTodo);

      // Update order values based on new positions
      const reorderItems = reorderedTodos.map((todo, index) => ({
        id: todo.id,
        order: index,
      }));

      onReorder(reorderItems);
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={todos.map((todo) => todo.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-2">
          {todos.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No todos yet. Create your first todo!
            </div>
          ) : (
            todos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={onToggle}
                onDelete={onDelete}
              />
            ))
          )}
        </div>
      </SortableContext>
    </DndContext>
  );
}

