import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface TaskProps {
  id: string;
}

export function Task({ id }: TaskProps) {
  const style = {
    width: "100%",
    height: 50,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid black",
    margin: "10px 0",
    background: "white",
  };

  return <div style={style}>{id}</div>;
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
      <Task id={id} />
    </div>
  );
}
