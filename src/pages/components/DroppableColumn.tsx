import React from "react";
import { useDroppable } from "@dnd-kit/core";

interface DroppableColumnProps {
  children: React.ReactNode;
}

export function DroppableColumn({ children }: DroppableColumnProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: "droppable",
  });
  const style = {
    color: isOver ? "green" : undefined,
  };

  return (
    <div ref={setNodeRef} style={style}>
      {children}
    </div>
  );
}
