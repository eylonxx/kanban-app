import { Fragment, useEffect, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { type Subtask, type Task } from "@prisma/client";
import { useForm } from "react-hook-form";
import IconCross from "../../assets/icon-cross.svg";
import { api } from "~/utils/api";

interface TaskModalProps {
  setOpen: (val: boolean) => void;
  open: boolean;
  task: Task | null;
  handleUpdateSubtask: (subtasksToChange: Subtask[]) => void;
}

type FormValues = {
  subtasks: Subtask[];
};

export default function TaskModal({
  setOpen,
  open,
  task,
  handleUpdateSubtask,
}: TaskModalProps) {
  const cancelButtonRef = useRef(null);
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const { register, handleSubmit, watch, reset, getValues } =
    useForm<FormValues>({});

  useEffect(() => {
    if (!open) {
      reset();
      setSubtasks([]);
    } else if (task) {
      setSubtasks(task.subtasks.map((subtask) => ({ ...subtask })));
    }
    console.log(getValues(), open, task, subtasks);
  }, [task, open]);

  const updateSubtask = api.subtask.update.useMutation({});

  function onSubmit(data: FormValues) {
    const changedSubtasks = subtasks.filter((subtask, i) => {
      return subtask.checked !== task?.subtasks[i].checked;
    });
    if (changedSubtasks?.length) {
      updateSubtask.mutate({
        subtasks: changedSubtasks.map((subtask) => ({
          id: subtask.id,
          checked: subtask.checked,
        })),
      });
      handleUpdateSubtask(subtasks);
    }
    // setSubtasks([]);
  }

  return (
    <Transition.Root
      // afterLeave={handleOnCloseModal}
      show={open}
      as={Fragment}
    >
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
                      {task?.title}
                    </p>
                    <button
                      onClick={() => {
                        setOpen(false);
                      }}
                      ref={cancelButtonRef}
                    >
                      <IconCross />
                    </button>
                  </div>
                  <div className="mb-6 flex flex-col items-start">
                    <p className="mb-2 text-sm text-mediumGrey">
                      {task?.description}
                    </p>
                  </div>
                  <div className="flex flex-col items-start">
                    <p className="mb-4 text-sm font-bold text-white">
                      Subtasks
                    </p>
                    {subtasks
                      .sort((a, b) => a.index - b.index)
                      .map((subtask, i) => (
                        <div
                          className="mb-2 flex h-10 w-full items-center justify-start rounded-lg bg-veryDarkGrey"
                          key={subtask.id}
                        >
                          <input
                            className="removeHover ml-3 h-5 w-5 accent-mainPurple hover:accent-mainPurple focus:accent-mainPurple focus:outline-none "
                            id={subtask.id}
                            type="checkbox"
                            {...register(`subtasks.${i}.id`)}
                            checked={subtask.checked}
                            onChange={(e) => {
                              setSubtasks((prev) => {
                                prev[i].checked = e.target.checked;
                                return [...prev];
                              });
                            }}
                          />
                          <label
                            htmlFor={subtask.id}
                            className={`${
                              subtask.checked
                                ? "text-decoration-line text-white/40 line-through transition-all "
                                : "text-white transition-all"
                            } ml-4 w-full cursor-pointer break-normal text-left leading-4`}
                          >
                            {subtask.title}
                          </label>
                        </div>
                      ))}
                  </div>
                  <div className="flex flex-col">
                    {/* <button
                        type="submit"
                        className="h-10 w-full rounded-full bg-mainPurple text-sm font-bold text-white"
                      >
                        Create New Task
                      </button> */}
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
