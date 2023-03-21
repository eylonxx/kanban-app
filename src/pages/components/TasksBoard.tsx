import {
  DndContext,
  DragOverlay,
  type DragStartEvent,
  type DragOverEvent,
  closestCorners,
  useSensor,
  MouseSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { type Subtask, type Board, type Task } from "@prisma/client";
import { useAtom } from "jotai";
import { LexoRank } from "lexorank";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { api } from "~/utils/api";
import { columnsAtom, tasksAtom } from "~/utils/jotai";
import Column from "./Column";
import { TaskCard } from "./SortableItem";
import TaskModal from "./TaskModal";

interface TasksBoardProps {
  selectedBoard: Board | null;
}

const TasksBoard = ({ selectedBoard }: TasksBoardProps) => {
  const { data: sessionData } = useSession();
  const [activeId, setActiveId] = useState<string | null>();
  const [items, setItems] = useAtom(tasksAtom);
  const [columns, setColumns] = useAtom(columnsAtom);
  const [columnIds, setColumnIds] = useState<string[]>([]);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [taskModalOpen, setTaskModalOpen] = useState<boolean>(false);
  const [taskModalTask, setTaskModalTask] = useState<Task | null>(null);

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      delay: 100,
      tolerance: 5,
    },
  });

  const sensors = useSensors(mouseSensor);

  const setOpenTaskModal = (task: Task, val: boolean) => {
    console.log(taskModalOpen);

    setTaskModalOpen(val);
    setTaskModalTask(task);
  };

  const handleUpdateSubtask = (subtasksToChange: Subtask[]) => {
    setItems((prev) => {
      const index = prev.findIndex((task) => task.id === taskModalTask!.id);
      prev[index].subtasks = [...subtasksToChange];
      return [...prev];
    });
  };

  useEffect(() => {
    setColumnIds(columns.map((column) => column.id) || []);
  }, [columns]);

  const { data: fetchedColumns, refetch: refetchColumns } =
    api.column.getAll.useQuery(
      { boardId: selectedBoard?.id || "" },
      {
        enabled: sessionData?.user !== undefined,
        onSuccess: (data) => {
          setColumns(data);
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

  const updateSubtask = api.subtask.update.useMutation({});

  const handleUpdateTask = (
    id: string,
    title?: string,
    description?: string,
    subtasks?: { id: string; title: string }[]
  ) => {
    updateTask.mutate({
      id,
      title,
      description,
    });
    // if (subtasks?.length) {
    //   updateSubtask.mutate({});
    // }
  };

  function getTasksByColumn(columnId: string) {
    return items
      .filter((task) => task.columnId === columnId)
      .sort((a, b) => a.rank.localeCompare(b.rank));
  }

  function findColumn(id: string) {
    if (columnIds.includes(id)) return id;
    const task = items?.find((task) => task.id === id);
    return task?.columnId;
  }

  function getActiveTask(id: string): Task | null {
    if (!tasks) return null;
    return items.find((task) => task.id === id) || null;
  }

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    const { id } = active;
    setActiveId(id as string);
    setActiveTask(getActiveTask(id as string));
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

    const overContainer = findColumn(overId.toString());
    if (!overContainer) return;

    setItems((prev) => {
      const activeTask = prev.find((task) => task.id === id);
      if (!activeTask) return prev;

      const activeRank = activeTask.rank;
      const activeContainer = activeTask.columnId;

      activeTask.columnId = overContainer;
      const overTasks = getTasksByColumn(overContainer);

      let newRank;
      if (columnIds.includes(overId.toString())) {
        if (overTasks.length === 0) {
          newRank = LexoRank.middle().toString();
        } else {
          newRank = LexoRank.parse(overTasks[overTasks.length - 1].rank)
            .genNext()
            .toString();
        }
      } else {
        const overIndex = overTasks.findIndex((task) => task.id === overId);
        const overTask = overTasks[overIndex];
        const isBelowOver =
          over &&
          active.rect.current.translated &&
          active.rect.current.translated.top > over.rect.top + over.rect.height;

        if (activeContainer === overContainer) {
          newRank = overTask.rank;
          overTask.rank = activeRank;
          updateTask.mutate({
            id: overId.toString(),
            newRank: overTask.rank,
          });
        } else {
          const overRank = LexoRank.parse(overTask.rank);
          if (overIndex === 0 && !isBelowOver) {
            newRank = overRank.genPrev().toString();
          } else if (overIndex === overTasks.length - 1 && isBelowOver) {
            newRank = overRank.genNext().toString();
          } else {
            const modifier = isBelowOver ? 1 : -1;
            newRank = overRank
              .between(LexoRank.parse(overTasks[overIndex + modifier].rank))
              .toString();
          }
        }
      }
      activeTask.rank = newRank;

      return [...prev];
    });
  }

  return (
    <div className="flex flex-row">
      <TaskModal
        handleUpdateSubtask={handleUpdateSubtask}
        task={taskModalTask}
        open={taskModalOpen}
        setOpen={setTaskModalOpen}
      />
      <DndContext
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        sensors={sensors}
      >
        <SortableContext items={columnIds}>
          <div className="flex gap-4">
            {columns
              ?.sort((a, b) => a.index - b.index)
              .map((column) => {
                return (
                  <Column
                    setOpenTaskModal={setOpenTaskModal}
                    key={column.id}
                    id={column.id}
                    columnTitle={column.title}
                    items={getTasksByColumn(column.id)}
                  />
                );
              })}
          </div>
        </SortableContext>

        <DragOverlay>
          {activeId ? <TaskCard task={activeTask} id={activeId} /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default TasksBoard;
