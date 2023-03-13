import { Fragment, useEffect, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Subtask, type Task } from "@prisma/client";
import { useForm } from "react-hook-form";
import IconCross from "../../assets/icon-cross.svg";
import { api } from "~/utils/api";

interface TaskModalProps {
  setOpen: (val: boolean) => void;
  open: boolean;
  task: Task | null;
}

type FormValues = {
  [key: string]: boolean;
};

export default function TaskModal({ setOpen, open, task }: TaskModalProps) {
  const cancelButtonRef = useRef(null);
  const [subtasks, setSubtasks] = useState<Subtask[] | undefined>([]);
  const { register, handleSubmit } = useForm<FormValues>({
    defaultValues: getInitialValues(),
  });

  useEffect(() => {
    setSubtasks(task?.subTasks);
  }, [task]);

  function getInitialValues() {
    const initialValues: FormValues = {};
    if (task?.subTasks) {
      for (const subtask of task.subTasks) {
        initialValues[subtask.id] = subtask.checked;
      }
    }
    return initialValues;
  }

  const updateSubtask = api.subtask.update.useMutation({});

  function onSubmit(data: FormValues) {
    const changedSubtasks: { id: string; checked: boolean }[] = [];
    for (const subtask of task?.subTasks ?? []) {
      console.log("db:", subtask.checked, "form:", data[subtask.id]);
      if (data[subtask.id] !== subtask.checked) {
        changedSubtasks.push({
          id: subtask.id,
          checked: data[subtask.id],
        });
      }
    }
    if (changedSubtasks.length) {
      setSubtasks((prev) => {
        if (prev !== undefined) {
          changedSubtasks.map((subtask) => {
            const indexToUpdate = prev.findIndex(
              (sub) => sub.id === subtask.id
            );
            prev[indexToUpdate].checked = subtask.checked;
          });
          return [...prev];
        }
      });
      updateSubtask.mutate({ subtasks: changedSubtasks });
    }
    console.log(changedSubtasks);
  }

  return (
    task && (
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
                        {task.title}
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
                        {task.description}
                      </p>
                    </div>
                    <div className="flex flex-col items-start">
                      <p className="mb-4 text-sm font-bold text-white">
                        Subtasks
                      </p>
                      {subtasks?.map((subtask) => (
                        <div key={subtask.id}>
                          <label>
                            <input
                              type="checkbox"
                              {...register(subtask.id)}
                              defaultChecked={subtask.checked}
                            />
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
    )
  );
}
