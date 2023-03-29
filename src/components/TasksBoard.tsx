/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  DndContext,
  DragOverlay,
  type DragStartEvent,
  type DragOverEvent,
  useSensor,
  MouseSensor,
  useSensors,
  closestCenter,
} from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import type {
  Subtask,
  Board,
  Prisma,
  Column as TypeColumn,
} from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { getQueryKey } from "@trpc/react-query";
import { useAtom } from "jotai";
import { LexoRank } from "lexorank";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { Oval } from "react-loader-spinner";
import { api } from "~/utils/api";
import { columnsAtom, tasksAtom } from "~/utils/jotai";
import Column from "./Column";
import NewAndEditTaskModal from "./NewAndEditTaskModal";
import { TaskCard } from "./SortableItem";
import TaskModal from "./TaskModal";

type Task = Prisma.TaskGetPayload<{ include: { subtasks: true } }>;

interface TasksBoardProps {
  selectedBoard: Board;
  setOpen: (val: boolean) => void;
}

const TasksBoard = ({ selectedBoard, setOpen }: TasksBoardProps) => {
  const { data: sessionData } = useSession();
  const queryClient = useQueryClient();

  const [activeId, setActiveId] = useState<string | null>();
  const [items, setItems] = useAtom(tasksAtom);
  const [columns, setColumns] = useAtom(columnsAtom);
  const [columnIds, setColumnIds] = useState<string[]>([]);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [taskModalOpen, setTaskModalOpen] = useState<boolean>(false);
  const [taskModalTask, setTaskModalTask] = useState<Task | null>(null);
  const [openEditTaskModal, setOpenEditTaskModal] = useState<boolean>(false);

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      delay: 100,
      tolerance: 5,
    },
  });

  const sensors = useSensors(mouseSensor);

  useEffect(() => {
    setColumnIds(columns.map((column) => column.id) || []);
  }, [columns]);

  const { isLoading: isLoadingColumns } = api.column.getAll.useQuery(
    { boardId: selectedBoard.id },
    {
      enabled: sessionData?.user !== undefined,
      onSuccess: (data: TypeColumn[]) => {
        setColumns(data);
      },
    }
  );

  const { data: tasks, isLoading: isLoadingTasks } = api.task.getAll.useQuery(
    {
      columnIds: columns?.map((column) => column.id) || [],
    },
    {
      enabled: sessionData?.user !== undefined,
      onSuccess: (data: Task[]) => setItems(data),
    }
  );

  const updateTask = api.task.update.useMutation({});

  const deleteTask = api.task.deleteTask.useMutation({
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: [...getQueryKey(api.task.getAll)],
        type: "active",
      });
    },
  });

  const setOpenTaskModal = (task: Task, val: boolean) => {
    setTaskModalOpen(val);
    setTaskModalTask(task);
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

  const handleUpdateSubtask = (subtasksToChange: Subtask[]) => {
    setItems((prev) => {
      const index = prev.findIndex((task) => task.id === taskModalTask!.id);
      prev[index].subtasks = [...subtasksToChange];
      return [...prev];
    });
  };

  const handleDeleteTask = (id: string) => {
    deleteTask.mutate({
      id,
    });
  };

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
    if (overId == null || overId === "void") return;

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

    if (overId == null || overId === "void" || activeId === overId) return;

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
            try {
              newRank = overRank
                .between(LexoRank.parse(overTasks[overIndex + modifier].rank))
                .toString();
            } catch (error) {
              newRank = overRank
                .between(
                  LexoRank.parse(overTasks[overIndex + modifier].rank).genNext()
                )
                .toString();
            }
          }
        }
      }
      activeTask.rank = newRank;

      return [...prev];
    });
  }

  return (
    <div className="flex grow flex-row transition-all">
      <TaskModal
        handleDeleteTask={handleDeleteTask}
        handleUpdateSubtask={handleUpdateSubtask}
        task={taskModalTask}
        open={taskModalOpen}
        setOpen={setTaskModalOpen}
        setOpenEditTaskModal={setOpenEditTaskModal}
      />
      <NewAndEditTaskModal
        isEdit={true}
        open={openEditTaskModal}
        setOpen={setOpenEditTaskModal}
        task={taskModalTask}
        boardColumns={columns}
      />
      {isLoadingColumns || isLoadingTasks ? (
        <div className="flex grow items-center justify-center bg-black/5 transition-colors duration-500 ease-linear">
          <Oval
            height={80}
            width={80}
            color="#635FC7"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
            ariaLabel="oval-loading"
            secondaryColor="#828fa3"
            strokeWidth={2}
            strokeWidthSecondary={2}
          />
        </div>
      ) : (
        <div className="transition-all duration-200">
          <DndContext
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
            sensors={sensors}
          >
            <SortableContext items={columnIds}>
              <div className="flex min-h-full">
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
                <div
                  className="mt-12 flex h-[580px]  w-72 cursor-pointer flex-col items-center justify-center rounded-lg bg-[#22232F]"
                  onClick={() => setOpen(true)}
                >
                  <p className="text-2xl font-bold text-mediumGrey">
                    + New Column
                  </p>
                </div>
              </div>
            </SortableContext>

            <DragOverlay>
              {activeId ? <TaskCard task={activeTask} /> : null}
            </DragOverlay>
          </DndContext>
        </div>
      )}
    </div>
  );
};

export default TasksBoard;
