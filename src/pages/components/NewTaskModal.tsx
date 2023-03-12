import { Fragment, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { type Task } from "@prisma/client";
import { useForm, useFieldArray, type SubmitHandler } from "react-hook-form";
import IconCross from "../../assets/icon-cross.svg";
import { columnsAtom, tasksAtom } from "~/utils/jotai";
import { useAtom } from "jotai";
import { api } from "~/utils/api";
import { LexoRank } from "lexorank";

interface NewTaskModalProps {
  setOpen: (val: boolean) => void;
  open: boolean;
}

type FormValues = {
  taskName: string;
  description: string;
  columnId: string;
  subtasks: {
    title: string;
  }[];
};

export default function NewTaskModal({ setOpen, open }: NewTaskModalProps) {
  const cancelButtonRef = useRef(null);
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { taskName: "", subtasks: [{ title: "" }] },
    mode: "onBlur",
  });

  const [tasks, setTasks] = useAtom(tasksAtom);
  const [columns, setColumns] = useAtom(columnsAtom);

  const onSubmit: SubmitHandler<FormValues> = (data: FormValues) => {
    const subtaskTitle = data.subtasks.map((subtask) => subtask.title);
    const colTasks = tasks
      .filter((task) => task.columnId === data.columnId)
      .sort((a, b) => a.rank.localeCompare(b.rank));
    console.log(data);

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
    setOpen(false);
  };

  const { fields, append, remove } = useFieldArray({
    name: "subtasks",
    control,
  });

  const createTask = api.task.create.useMutation({
    onSuccess: (data) => {
      setTasks([...tasks, data]);
    },
  });

  return (
    <Transition.Root show={open} as={Fragment}>
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
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative flex w-1/3 transform flex-col overflow-hidden rounded-lg bg-darkGrey p-8 transition-all">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="mb-6 flex justify-between">
                    <p className="text-left text-lg font-bold text-white">
                      Add New Task
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        reset();
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
                      className={`${
                        errors?.taskName?.message
                          ? "border-red"
                          : "border-inputBorder"
                      } h-10 w-full flex-1 rounded-md border-2 bg-transparent py-2 pl-4 text-base focus:outline-none`}
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
                      className="h-10 w-full flex-1 rounded-md border-2 border-inputBorder bg-transparent py-2 pl-4 text-base placeholder:opacity-30 focus:outline-none"
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
                            className={`${
                              errors?.subtasks?.[index]?.title
                                ? "border-red"
                                : "border-inputBorder"
                            } h-10 w-full flex-1 rounded-md border-2 bg-transparent py-2 pl-4 text-base focus:outline-none`}
                          />
                          <button
                            type="button"
                            className={`${
                              errors?.subtasks?.[index]?.title ? "text-red" : ""
                            } ${fields.length === 1 ? "opacity-20" : ""} ml-4`}
                            disabled={fields.length === 1}
                            onClick={() => remove(index)}
                          >
                            <IconCross />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex flex-col items-start">
                    <select
                      className="select w-full max-w-xs"
                      {...register("columnId", { required: true })}
                    >
                      {columns.map((col) => (
                        <option value={col.id} key={col.id}>
                          {col.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col">
                    <button
                      className="mb-6 h-10 w-full rounded-full bg-white text-sm font-bold text-mainPurple"
                      type="button"
                      onClick={() =>
                        append({
                          title: "",
                        })
                      }
                    >
                      + Add New Task
                    </button>
                    <button
                      type="submit"
                      className="h-10 w-full rounded-full bg-mainPurple text-sm font-bold text-white"
                    >
                      Create New Task
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
