import React from "react";
import { DragOverlay, useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import SortableItem from "./SortableItem";
import { type Task } from "@prisma/client";

const containerStyle = {
  width: 280,
};

interface ContainerProps {
  items: Task[];
  id: string;
  setOpenTaskModal: (task: Task, val: boolean) => void;
}

export default function Container({
  items,
  id,
  setOpenTaskModal,
}: ContainerProps) {
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
        style={containerStyle}
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
