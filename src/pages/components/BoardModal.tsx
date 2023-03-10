import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useForm, useFieldArray, SubmitHandler } from "react-hook-form";
import IconCross from "../../assets/icon-cross.svg";

interface BoardModalProps {
  setOpen: (val: boolean) => void;
  open: boolean;
}

type FormValues = {
  boardName: string;
  columns: {
    title: string;
  }[];
};

export default function BoardModal({ setOpen, open }: BoardModalProps) {
  const cancelButtonRef = useRef(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { boardName: "", columns: [{ title: "" }] },
    mode: "onBlur",
  });

  const onSubmit: SubmitHandler<FormValues> = (data: FormValues) => {
    console.log(data);
  };

  const { fields, append, remove } = useFieldArray({
    name: "columns",
    control,
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
              <Dialog.Panel className="relative flex  min-w-[30%] transform flex-col overflow-hidden rounded-lg bg-darkGrey p-8 transition-all">
                {/* title */}
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="mb-6 flex justify-between">
                    <p className="text-left text-lg font-bold text-white">
                      Add New Board
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
                  {/* body */}
                  <div className="mb-6 flex flex-col items-start">
                    <label htmlFor="" className="mb-2 font-bold text-white">
                      Board Name
                    </label>
                    {errors?.boardName?.message && (
                      <span className="absolute mt-11 ml-4 text-xs text-red">
                        Cannot be empty
                      </span>
                    )}
                    <input
                      className={`${
                        errors?.boardName?.message
                          ? "border-red"
                          : "border-inputBorder"
                      } h-10 w-full flex-1 rounded-md border-2 bg-transparent py-2 pl-4 text-base focus:outline-none`}
                      {...register("boardName", {
                        required: "Cannot be empty",
                      })}
                    />
                  </div>
                  <div className="flex flex-col items-start">
                    <label htmlFor="" className="mb-2 font-bold text-white">
                      Board Columns
                    </label>
                    {fields.map((field, index) => {
                      return (
                        <div key={field.id} className="mb-3 flex w-full">
                          {errors?.columns?.[index]?.title && (
                            <span className="absolute mt-3 ml-4 text-xs text-red">
                              Cannot be empty
                            </span>
                          )}
                          <input
                            type="text"
                            {...register(`columns.${index}.title` as const, {
                              required: true,
                            })}
                            className={`${
                              errors?.columns?.[index]?.title
                                ? "border-red"
                                : "border-inputBorder"
                            } h-10 w-full flex-1 rounded-md border-2 bg-transparent py-2 pl-4 text-base focus:outline-none`}
                          />
                          <button
                            type="button"
                            className={`${
                              errors?.columns?.[index]?.title ? "text-red" : ""
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
                  {/* buttons - only if edit*/}
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
                      + Add New Column
                    </button>
                    <button
                      type="submit"
                      className="h-10 w-full rounded-full bg-mainPurple text-sm font-bold text-white"
                    >
                      Create New Board
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
