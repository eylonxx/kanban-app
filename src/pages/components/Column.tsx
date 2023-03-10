import React from "react";
import { DragOverlay, useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import SortableItem from "./SortableItem";
import { type Task } from "@prisma/client";

const columnStyle = {
  width: 280,
};

interface ColumnProps {
  items: Task[];
  id: string;
  setOpenTaskModal: (task: Task, val: boolean) => void;
}

export default function Column({ items, id, setOpenTaskModal }: ColumnProps) {
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
        style={columnStyle}
        className="flex flex-col items-center gap-3 border py-6"
      >
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
