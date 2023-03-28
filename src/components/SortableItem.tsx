import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { type Prisma } from "@prisma/client";
type Task = Prisma.TaskGetPayload<{ include: { subtasks: true } }>;

interface TaskCardProps {
  task: Task | null;
  setOpenTaskModal?: (task: Task, val: boolean) => void;
}

export function TaskCard({ task, setOpenTaskModal }: TaskCardProps) {
  return (
    task && (
      <div
        onClick={() => {
          if (!setOpenTaskModal) return;
          setOpenTaskModal(task, true);
        }}
        className="flex min-h-[96px] w-64 flex-col justify-center gap-2 rounded-md bg-darkGrey p-4 font-bold shadow-taskCard"
      >
        <div>
          <p className="text-sm text-white">{task.title}</p>
        </div>
        <div>
          <p className="text-xs text-mediumGrey">
            {task.subtasks.filter((subtask) => subtask.checked === true).length}{" "}
            of {task.subtasks.length} subtasks
          </p>
        </div>
      </div>
    )
  );
}

interface SortableItemProps {
  id: string;
  task: Task;
  setOpenTaskModal: (task: Task, val: boolean) => void;
}

export default function SortableItem({
  id,
  task,
  setOpenTaskModal,
}: SortableItemProps) {
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
      <TaskCard task={task} setOpenTaskModal={setOpenTaskModal} />
    </div>
  );
}
