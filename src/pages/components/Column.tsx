import React from "react";
import { DragOverlay, useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import SortableItem from "./SortableItem";
import { type Task } from "@prisma/client";

interface ColumnProps {
  items: Task[];
  id: string;
  columnTitle: string;
  setOpenTaskModal: (task: Task, val: boolean) => void;
}

export default function Column({
  items,
  id,
  setOpenTaskModal,
  columnTitle,
}: ColumnProps) {
  const { setNodeRef } = useDroppable({
    id,
  });

  return (
    <SortableContext
      id={id}
      items={items.map((item) => item.id)}
      strategy={verticalListSortingStrategy}
    >
      <div
        ref={setNodeRef}
        className="flex w-72 flex-col items-center gap-3 py-6"
      >
        <p className="self-start pl-6 text-xs font-bold uppercase tracking-[.25em] text-mediumGrey">
          {columnTitle} ({items.length})
        </p>
        {items.map((item, idx) => (
          <SortableItem
            setOpenTaskModal={setOpenTaskModal}
            key={`${item.id}-${idx}`}
            task={item}
            id={item.id}
          />
        ))}
      </div>
    </SortableContext>
  );
}
