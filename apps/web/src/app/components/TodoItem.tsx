"use client";

import type { Todo } from "@monorepo/types";
import { Badge } from "@monorepo/ui/components/badge";
import { Button } from "@monorepo/ui/components/button";
import { Checkbox } from "@monorepo/ui/components/checkbox";
import { GripVertical, Trash2 } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: todo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 p-4 border rounded-lg bg-card hover:bg-accent/50 transition-colors"
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing touch-none"
        aria-label="Drag to reorder"
      >
        <GripVertical className="h-5 w-5 text-muted-foreground" />
      </button>

      <Checkbox
        checked={todo.completed}
        onCheckedChange={() => onToggle(todo.id)}
        aria-label={todo.completed ? "Mark as incomplete" : "Mark as complete"}
      />

      <div className="flex-1 flex flex-col gap-2">
        <span
          className={`text-base ${
            todo.completed ? "line-through text-muted-foreground" : ""
          }`}
        >
          {todo.title}
        </span>
        {todo.labels.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {todo.labels.map((label) => (
              <Badge key={label} variant="secondary" className="text-xs">
                {label}
              </Badge>
            ))}
          </div>
        )}
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDelete(todo.id)}
        aria-label="Delete todo"
      >
        <Trash2 className="h-4 w-4 text-destructive" />
      </Button>
    </div>
  );
}

