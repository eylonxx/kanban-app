import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface TaskCardProps {
  id: string;
}

export function TaskCard({ id }: TaskCardProps) {
  const style = {
    width: 288,
    height: 88,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid black",
    margin: "10px 0",
    background: "white",
  };

  return (
    <div className="flex h-24 w-64 items-center rounded-md bg-darkGrey  shadow-taskCard">
      {id}
    </div>
  );
}

interface SortableItem {
  id: string;
}

export default function SortableItem({ id }: SortableItem) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      className={`${isDragging ? "opacity-30" : "opacity-100"}`}
      style={style}
      {...attributes}
      {...listeners}
    >
      <TaskCard id={id} />
    </div>
  );
}
