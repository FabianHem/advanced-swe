"use client";

import { Badge } from "@monorepo/ui/components/badge";
import { Button } from "@monorepo/ui/components/button";
import { Input } from "@monorepo/ui/components/input";
import { X } from "lucide-react";
import { useState, FormEvent } from "react";

interface CreateTodoFormProps {
  onSubmit: (title: string, labels: string[]) => void;
  isLoading?: boolean;
}

export function CreateTodoForm({ onSubmit, isLoading }: CreateTodoFormProps) {
  const [title, setTitle] = useState("");
  const [labelInput, setLabelInput] = useState("");
  const [labels, setLabels] = useState<string[]>([]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onSubmit(title.trim(), labels);
      setTitle("");
      setLabels([]);
      setLabelInput("");
    }
  };

  const handleAddLabel = (e: FormEvent) => {
    e.preventDefault();
    const trimmedLabel = labelInput.trim();
    if (trimmedLabel && !labels.includes(trimmedLabel)) {
      setLabels([...labels, trimmedLabel]);
      setLabelInput("");
    }
  };

  const handleRemoveLabel = (labelToRemove: string) => {
    setLabels(labels.filter((label) => label !== labelToRemove));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Input
          type="text"
          placeholder="Enter todo title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isLoading}
          required
        />
      </div>

      <div className="space-y-2">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Add a label..."
            value={labelInput}
            onChange={(e) => setLabelInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddLabel(e);
              }
            }}
            disabled={isLoading}
          />
          <Button
            type="button"
            variant="outline"
            onClick={handleAddLabel}
            disabled={isLoading || !labelInput.trim()}
          >
            Add Label
          </Button>
        </div>

        {labels.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {labels.map((label) => (
              <Badge
                key={label}
                variant="secondary"
                className="flex items-center gap-1 pr-1"
              >
                {label}
                <button
                  type="button"
                  onClick={() => handleRemoveLabel(label)}
                  className="ml-1 rounded-full hover:bg-destructive/20 p-0.5"
                  aria-label={`Remove label ${label}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      <Button type="submit" disabled={isLoading || !title.trim()}>
        {isLoading ? "Creating..." : "Create Todo"}
      </Button>
    </form>
  );
}

