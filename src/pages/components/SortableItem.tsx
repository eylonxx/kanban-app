import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { type Task } from "@prisma/client";
interface TaskCardProps {
  id: string;
  task: Task | null;
}

export function TaskCard({ id, task }: TaskCardProps) {
  return (
    task && (
      <div className="flex h-24 w-64 flex-col justify-center gap-2 rounded-md bg-darkGrey px-4 font-bold shadow-taskCard">
        <div>
          <p className="text-s text-white ">
            {task.title} {task.rank}
          </p>
        </div>
        <div>
          <p className="text-xs text-mediumGrey">of {task.subTasks.length}</p>
        </div>
      </div>
    )
  );
}

interface SortableItemProps {
  id: string;
  task: Task;
}

export default function SortableItem({ id, task }: SortableItemProps) {
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
      <TaskCard id={id} task={task} />
    </div>
  );
}
