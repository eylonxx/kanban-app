import {
  DndContext,
  closestCenter,
  DragOverlay,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { type Column, type Board, type Task } from "@prisma/client";
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

  // const [items, setItems] = useState<Record<string, { id: string }[]>>({
  //   A: [{ id: "1" }, { id: "2" }, { id: "3" }],
  //   B: [{ id: "4" }, { id: "5" }, { id: "6" }],
  //   C: [{ id: "7" }, { id: "8" }, { id: "9" }],
  //   D: [{ id: "10" }, { id: "11" }, { id: "12" }],
  // });

  const [items, setItems] = useState<Task[]>([]);

  const { data: columns, refetch: refetchColumns } = api.column.getAll.useQuery(
    { boardId: selectedBoard?.id || "" },
    {
      enabled: sessionData?.user !== undefined,
      // onSuccess: (data) => {},
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

  // console.log(tasks);

  const createColumn = api.column.create.useMutation({
    onSuccess: () => {
      void refetchColumns();
    },
  });

  function getColumnsTasks(columnId: string) {
    return items.filter((task) => {
      return task.columnId === columnId;
    });
  }

  function findContainer(id: string) {
    // if (id in items) {
    //   return id;
    // }
    // return Object.keys(items).find((key) =>
    //   items[key]?.find((item) => item.id === id)
    // );
    const task = items?.find((task) => {
      return task.columnId === id;
    });
    // console.log("taskid:", task, "colid:", task?.columnId);

    return task?.columnId;
  }

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    const { id } = active;
    setActiveId(id as string);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    const { id } = active;
    if (!over) return;
    const overId = over.id;
    const activeContainer = findContainer(id.toString());
    const overContainer = findContainer(overId.toString());

    if (
      !activeContainer ||
      !overContainer ||
      activeContainer !== overContainer
    ) {
      return;
    }

    const activeIndex = items[activeContainer]?.findIndex(
      (item) => item.id === active.id
    );
    const overIndex = items[overContainer]?.findIndex(
      (item) => item.id === over.id
    );

    if (
      activeIndex !== undefined &&
      overIndex !== undefined &&
      activeIndex !== overIndex
    ) {
      setItems((items) => ({
        ...items,
        [overContainer]: arrayMove(
          items[overContainer]!,
          activeIndex,
          overIndex
        ),
      }));
    }
    setActiveId(null);
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    const { id } = active;

    const overId = over?.id;
    if (overId == null || overId === "void" || active.id in items) {
      return;
    }
    console.log(id, overId);

    const activeContainer = findContainer(id.toString());
    const overContainer = findContainer(overId.toString());
    // console.log(activeContainer, overContainer);

    if (
      !activeContainer ||
      !overContainer ||
      activeContainer === overContainer
    ) {
      return;
    }

    setItems((prev) => {
      const activeItems = prev[activeContainer]!;
      const overItems = prev[overContainer]!;

      // Find the indexes for the items
      const activeIndex = activeItems?.findIndex(
        (item) => item.id === active.id
      );
      const overIndex = overItems?.findIndex((item) => item.id === overId);

      let newIndex;
      if (overId in prev) {
        //if dropped container is empty
        // We're at the root droppable of a container
        newIndex = overItems.length + 1;
      } else {
        const isBelowLastItem =
          over &&
          active.rect.current.translated &&
          active.rect.current.translated.top > over.rect.top + over.rect.height;

        // &&
        // draggingRect.offsetTop > over.rect.offsetTop + over.rect.height;

        const modifier = isBelowLastItem ? 1 : 0;

        newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
      }

      return {
        ...prev,
        [activeContainer]: [
          ...prev[activeContainer]!.filter((item) => item.id !== active.id),
        ],
        [overContainer]: [
          ...prev[overContainer]!.slice(0, newIndex),
          items[activeContainer]![activeIndex]!,
          ...prev[overContainer]!.slice(newIndex, prev[overContainer]!.length),
        ],
      };
    });
  }

  return (
    <div className="flex flex-row">
      <DndContext
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        {columns?.map((column) => {
          return (
            <Container
              key={column.id}
              id={column.id}
              items={getColumnsTasks(column.id)}
            />
          );
        })}

        <DragOverlay>
          {activeId ? <TaskCard id={activeId} /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default TasksBoard;
