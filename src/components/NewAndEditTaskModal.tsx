/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Fragment, useEffect, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  useForm,
  useFieldArray,
  type SubmitHandler,
  Controller,
} from "react-hook-form";
import IconCross from "../assets/icon-cross.svg";
import { tasksAtom } from "~/utils/jotai";
import { useAtom } from "jotai";
import { api } from "~/utils/api";
import { LexoRank } from "lexorank";
import SelectWithListbox from "./SelectWithListbox";
import { type Prisma, type Column } from "@prisma/client";
import { Oval } from "react-loader-spinner";
import { toast } from "react-hot-toast";
type Task = Prisma.TaskGetPayload<{ include: { subtasks: true } }>;

interface NewAndEditTaskModalProps {
  setOpen: (val: boolean) => void;
  boardColumns: Column[];
  open: boolean;
  isEdit: boolean;
  task?: Task | null;
}

type FormValues = {
  taskName: string;
  description: string;
  columnId: string;
  subtasks: {
    id?: string;
    title: string;
    checked?: boolean;
    taskId?: string;
    index: number;
  }[];
};

export default function NewAndEditTaskModal({
  setOpen,
  open,
  boardColumns,
  isEdit,
  task,
}: NewAndEditTaskModalProps) {
  const [tasks, setTasks] = useAtom(tasksAtom);
  const cancelButtonRef = useRef(null);
  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      taskName: "",
      subtasks: [{ title: "" }],
    },
    mode: "onTouched",
  });

  const { fields, append, remove } = useFieldArray({
    name: "subtasks",
    control,
  });

  useEffect(() => {
    //setting default col id on edit task
    if (boardColumns.length && task) {
      setValue("columnId", task.columnId);
    }
    //setting default col id on new task
    if (boardColumns.length && !task) {
      setValue("columnId", boardColumns[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardColumns, open]);

  useEffect(() => {
    if (isEdit && task && open === true) {
      setValue("taskName", task.title);
      setValue("description", task.description);
      setValue(
        "subtasks",
        task.subtasks.sort((a, b) => a.index - b.index)
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const createTask = api.task.create.useMutation({
    onSuccess: (data: Task) => {
      setTasks([...tasks, data]);
    },
    onError: () => {
      toast.error("Create failed, please try again later.");
    },
  });

  const updateTaskAndSubtasks = api.task.updateTaskAndSubtasks.useMutation({
    onSuccess: (data: Task) => {
      setTasks((prev) => {
        const editedIndex = prev.findIndex((task) => task.id === data.id);
        prev[editedIndex] = { ...data };
        return [...prev];
      });
    },
    onError: () => {
      toast.error("Update failed, please try again later.");
    },
  });

  const onSubmit: SubmitHandler<FormValues> = (data: FormValues) => {
    if (isEdit) {
      const subtasksWithIndex = data.subtasks.map((subtask, i) => ({
        ...subtask,
        index: i,
      }));
      const currentSubtasksIds = task!.subtasks.map((subtask) => subtask.id);
      const subtasksToCreate = subtasksWithIndex.filter(
        (subtask) => !subtask.id
      );
      const subtasksToUpdate = subtasksWithIndex.filter(
        (subtask) => subtask.id
      );
      const subtasksToDelete = currentSubtasksIds.filter(
        (id) =>
          subtasksWithIndex.find((subtask) => subtask.id === id) === undefined
      );
      let newRank;
      if (data.columnId !== task?.columnId) {
        const lastTaskInNewColumn = tasks
          .filter((task) => task.columnId === data.columnId)
          .sort((a, b) => a.rank.localeCompare(b.rank));
        console.log(lastTaskInNewColumn);
        if (!lastTaskInNewColumn.length) {
          newRank = LexoRank.middle().toString();
        } else {
          newRank = LexoRank.parse(
            lastTaskInNewColumn[lastTaskInNewColumn.length - 1].rank
          )
            .genNext()
            .toString();
        }
      }

      updateTaskAndSubtasks.mutate({
        id: task!.id,
        title: data.taskName,
        columnId: data.columnId,
        rank: newRank,
        description: data.description,
        subtasksToCreate: subtasksToCreate,
        subtasksToUpdate: subtasksToUpdate,
        subtasksToDelete: subtasksToDelete,
      });
    } else {
      const subtaskTitle = data.subtasks.map((subtask) => subtask.title);
      const colTasks = tasks
        .filter((task) => task.columnId === data.columnId)
        .sort((a, b) => a.rank.localeCompare(b.rank));

      let rank;
      if (!colTasks.length) {
        rank = LexoRank.middle().toString();
      } else {
        rank = LexoRank.parse(colTasks[colTasks.length - 1].rank)
          .genNext()
          .toString();
      }

      createTask.mutate({
        title: data.taskName,
        description: data.description,
        columnId: data.columnId,
        rank: rank,
        subtasks: subtaskTitle,
      });
    }
  };

  useEffect(() => {
    if (updateTaskAndSubtasks.isSuccess || createTask.isSuccess) {
      setOpen(false);
    }
  }, [updateTaskAndSubtasks.isSuccess, createTask.isSuccess]);

  return (
    <Transition.Root show={open} as={Fragment} afterLeave={reset}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={() => {
          return;
        }}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-blacko bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto ">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              {boardColumns.length && (
                <Dialog.Panel className="relative flex transform flex-col rounded-lg bg-darkGrey p-8 transition-all sm:w-1/3">
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-6 flex justify-between">
                      <p className="text-left text-lg font-bold text-white">
                        {isEdit ? "Edit Task" : "Add New Task"}
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setOpen(false);
                        }}
                        ref={cancelButtonRef}
                      >
                        <IconCross />
                      </button>
                    </div>
                    <div className="mb-6 flex flex-col items-start">
                      <label htmlFor="" className="mb-2 font-bold text-white">
                        Title
                      </label>
                      {errors?.taskName?.message && (
                        <span className="absolute mt-11 ml-4 text-xs text-red">
                          Cannot be empty
                        </span>
                      )}
                      <input
                        className={`
                        h-10 w-full flex-1 rounded-md border-2 bg-transparent py-2 pl-4 text-base transition-all hover:border-mainPurple focus:outline-none 
                        ${
                          errors?.taskName?.message
                            ? "border-red"
                            : "border-inputBorder"
                        }`}
                        {...register("taskName", {
                          required: "Cannot be empty",
                        })}
                      />
                    </div>
                    <div className="mb-6 flex flex-col items-start">
                      <label htmlFor="" className="mb-2 font-bold text-white">
                        Description
                      </label>

                      <textarea
                        rows={4}
                        placeholder="e.g. It’s always good to take a break. This 15 minute break will 
                      recharge the batteries a little."
                        className="h-10 w-full flex-1 rounded-md border-2 border-inputBorder bg-transparent py-2 pl-4 text-base transition-all placeholder:opacity-30 hover:border-mainPurple focus:outline-none"
                        {...register("description")}
                      />
                    </div>
                    <div className="flex flex-col items-start">
                      <label htmlFor="" className="mb-2 font-bold text-white">
                        Subtasks
                      </label>
                      {fields.map((field, index) => {
                        return (
                          <div key={field.id} className="mb-3 flex w-full">
                            {errors?.subtasks?.[index]?.title && (
                              <span className="absolute mt-3 ml-4 text-xs text-red">
                                Cannot be empty
                              </span>
                            )}
                            <input
                              type="text"
                              {...register(`subtasks.${index}.title` as const, {
                                required: true,
                              })}
                              className={`
                              h-10 w-full flex-1 rounded-md border-2 bg-transparent py-2 pl-4 text-base transition-all hover:border-mainPurple focus:outline-none
                              ${
                                errors?.subtasks?.[index]?.title
                                  ? "border-red"
                                  : "border-inputBorder"
                              }`}
                            />
                            <button
                              type="button"
                              className={`ml-4 ${
                                errors?.subtasks?.[index]?.title
                                  ? "text-red"
                                  : ""
                              } ${fields.length === 1 ? "opacity-20" : ""}`}
                              disabled={fields.length === 1}
                              onClick={() => remove(index)}
                            >
                              <IconCross />
                            </button>
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex flex-col">
                      <button
                        className="mb-6 h-10 w-full rounded-full bg-white text-sm font-bold text-mainPurple"
                        type="button"
                        onClick={() =>
                          append(
                            isEdit && task
                              ? {
                                  title: "",
                                  checked: false,
                                  index: fields.length,
                                }
                              : { title: "", index: fields.length }
                          )
                        }
                      >
                        + Add New Task
                      </button>

                      <div className="mb-6 flex flex-col items-start">
                        <label className="mb-2 font-bold text-white">
                          Status
                        </label>
                        <Controller
                          control={control}
                          name="columnId"
                          render={({ field }) => (
                            <SelectWithListbox
                              columns={boardColumns}
                              selected={field.value || boardColumns[0].id}
                              onChange={(newSelected) => {
                                field.onChange(newSelected);
                              }}
                            />
                          )}
                        />
                      </div>

                      <button
                        type="submit"
                        className="h-10 w-full rounded-full bg-mainPurple text-sm font-bold text-white disabled:bg-mainPurple/30 disabled:text-white/30"
                        disabled={updateTaskAndSubtasks.isLoading}
                      >
                        {updateTaskAndSubtasks.isLoading ||
                        createTask.isLoading ? (
                          <div className="flex items-center justify-center">
                            <Oval
                              height={25}
                              width={25}
                              color="#635FC7"
                              visible={true}
                              ariaLabel="oval-loading"
                              secondaryColor="#828fa3"
                              strokeWidth={4}
                              strokeWidthSecondary={4}
                            />
                          </div>
                        ) : isEdit ? (
                          "Save Changes"
                        ) : (
                          "Create New Task"
                        )}
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              )}
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
