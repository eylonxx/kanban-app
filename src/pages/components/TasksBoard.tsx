import {
  DndContext,
  closestCenter,
  DragOverlay,
  type DragStartEvent,
  type DragOverEvent,
  closestCorners,
  rectIntersection,
} from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { type Board, type Task } from "@prisma/client";
import { LexoRank } from "lexorank";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { api } from "~/utils/api";
import Container from "./Container";
import { TaskCard } from "./SortableItem";

interface TasksBoardProps {
  selectedBoard: Board | null;
}

const TasksBoard = ({ selectedBoard }: TasksBoardProps) => {
  const { data: sessionData } = useSession();
  const [activeId, setActiveId] = useState<string | null>();
  const [items, setItems] = useState<Task[]>([]);
  const [columnIds, setColumnIds] = useState<string[]>([]);

  const { data: columns, refetch: refetchColumns } = api.column.getAll.useQuery(
    { boardId: selectedBoard?.id || "" },
    {
      enabled: sessionData?.user !== undefined,
      onSuccess: (data) => {
        setColumnIds(data?.map((column) => column.id) || []);
      },
    }
  );

  const { data: tasks, refetch: refetchTasks } = api.task.getAll.useQuery(
    {
      columnIds: columns?.map((column) => column.id) || [],
    },
    {
      enabled: sessionData?.user !== undefined,
      onSuccess: (data) => setItems(data),
    }
  );

  const createColumn = api.column.create.useMutation({
    onSuccess: () => {
      void refetchColumns();
    },
  });

  const updateTask = api.task.update.useMutation({});

  function getTasksByColumn(columnId: string) {
    return items
      .filter((task) => task.columnId === columnId)
      .sort((a, b) => a.rank.localeCompare(b.rank));
  }

  function findContainer(id: string) {
    if (columnIds.includes(id)) return id;
    const task = items?.find((task) => task.id === id);
    return task?.columnId;
  }

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    const { id } = active;
    setActiveId(id as string);
  }

  function handleDragEnd(event: DragOverEvent) {
    const { active, over } = event;
    const { id } = active;

    const overId = over?.id;
    if (overId == null || overId === "void") {
      return;
    }

    const activeTask = items.find((task) => task.id === id);
    if (!activeTask) return;

    updateTask.mutate({
      id: id.toString(),
      newRank: activeTask.rank,
      newColumnId: activeTask.columnId,
    });
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    const { id } = active;

    const overId = over?.id;
    if (overId == null || overId === "void" || activeId === overId) {
      return;
    }

    const overContainer = findContainer(overId.toString());
    if (!overContainer) return;

    setItems((prev) => {
      const activeTask = prev.find((task) => task.id === id);
      if (!activeTask) return prev;
      activeTask.columnId = overContainer;
      const overTasks = getTasksByColumn(overContainer);
      let newRank;

      if (columnIds.includes(overId.toString())) {
        if (overTasks.length === 0) {
          newRank = LexoRank.middle().toString();
        } else {
          newRank = LexoRank.parse(overTasks[overTasks.length - 1]!.rank)
            .genNext()
            .toString();
        }
      } else {
        const isBelowTask =
          over &&
          active.rect.current.translated &&
          active.rect.current.translated.top > over.rect.top + over.rect.height;

        if (isBelowTask) {
          newRank = LexoRank.parse(
            overTasks.find((task) => task.id === overId)!.rank
          )
            .genNext()
            .toString();
        } else {
          newRank = LexoRank.parse(
            overTasks.find((task) => task.id === overId)!.rank
          )
            .genPrev()
            .toString();
        }
      }
      activeTask.rank = newRank;

      return [...prev];
    });
  }

  return (
    <div className="flex flex-row">
      <DndContext
        collisionDetection={rectIntersection}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={columnIds}>
          {columns?.map((column) => {
            return (
              <Container
                key={column.id}
                id={column.id}
                items={getTasksByColumn(column.id)}
              />
            );
          })}
        </SortableContext>

        <DragOverlay>
          {activeId ? <TaskCard id={activeId} /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default TasksBoard;
