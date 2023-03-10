import { Fragment, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { type Task } from "@prisma/client";

interface TaskModalProps {
  setOpen: (val: boolean) => void;
  open: boolean;
  task: Task | null;
}

export default function TaskModal({ setOpen, open, task }: TaskModalProps) {
  const cancelButtonRef = useRef(null);

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
                  {/* title */}
                  <div className="flex justify-between">
                    <p className="text-left text-lg font-bold text-white">
                      Title
                    </p>
                    <p>3 dots</p>
                  </div>
                  {/* body */}
                  <div className="flex flex-col items-start">
                    <div>description</div>
                    <div className="flex flex-col items-start">
                      <p>subtasks x of y</p>
                      <p>subtask card component</p>
                    </div>
                    <div>
                      <p>set column dropdown</p>
                    </div>
                  </div>
                  {/* buttons - only if edit*/}
                  <div className="px-4 py-3 ">
                    {/* <button
                      type="button"
                      className="bg-red-600 hover:bg-red-500 inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto"
                      onClick={() => setOpen(false)}
                    >
                      Deactivate
                    </button> */}
                    <button
                      type="button"
                      className="text-gray-900 ring-gray-300 hover:bg-gray-50 mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold shadow-sm ring-1 ring-inset sm:mt-0 sm:w-auto"
                      onClick={() => setOpen(false)}
                      ref={cancelButtonRef}
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    )
  );
}
