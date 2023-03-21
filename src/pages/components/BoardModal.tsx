import { Fragment, useEffect, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useForm, useFieldArray, type SubmitHandler } from "react-hook-form";
import IconCross from "../../assets/icon-cross.svg";
import { type Column, type Board } from "@prisma/client";
import { useAtom } from "jotai";
import { columnsAtom } from "~/utils/jotai";
import { closestCenter, DndContext, type DragOverEvent } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import SortableItemColumn from "./SortableItemColumn";

interface BoardModalProps {
  setOpen: (val: boolean) => void;
  open: boolean;
  isEdit: boolean;
  selectedBoard: Board | null;
  handleBoardModalOnSubmit: (
    isEdit: boolean,
    data: BoardModalFormValues
  ) => void;
}

export type BoardModalFormValues = {
  boardName: string;
  columns: {
    id?: string;
    boardId?: string;
    title: string;
    index: number;
  }[];
};

export default function BoardModal({
  setOpen,
  open,
  isEdit,
  selectedBoard,
  handleBoardModalOnSubmit,
}: BoardModalProps) {
  const cancelButtonRef = useRef(null);
  const [columns, setColumns] = useAtom(columnsAtom);
  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<BoardModalFormValues>({
    defaultValues: {
      boardName: "",
      columns: [{ title: "", index: 0 }],
    },
    mode: "onBlur",
  });

  const onSubmit: SubmitHandler<BoardModalFormValues> = (
    data: BoardModalFormValues
  ) => {
    const columns = data.columns.map((col, i) => ({ ...col, index: i }));
    const dataWithIndex = { boardName: data.boardName, columns };

    handleBoardModalOnSubmit(isEdit, dataWithIndex);
    setOpen(false);
  };

  const { fields, append, remove, swap } = useFieldArray({
    name: "columns",
    control,
  });

  return (
    <Transition.Root
      beforeEnter={() => {
        if (isEdit) {
          setValue("boardName", selectedBoard!.title);
          const cols = columns
            .filter((col) => col.boardId === selectedBoard!.id)
            .sort((a, b) => a.index - b.index)
            .map((col) => ({
              id: col.id,
              boardId: col.boardId,
              title: col.title,
              index: col.index,
            }));
          setValue("columns", cols);
        }
      }}
      show={open}
      as={Fragment}
      afterLeave={reset}
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
              <Dialog.Panel className="relative flex  min-w-[30%] transform flex-col overflow-hidden rounded-lg bg-darkGrey p-8 transition-all">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="mb-6 flex justify-between">
                    <p className="text-left text-lg font-bold text-white">
                      {isEdit ? "Edit Board" : "Add New Board"}
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
                    <DndContext
                      collisionDetection={closestCenter}
                      onDragOver={(event: DragOverEvent) => {
                        const { active, over } = event;
                        const { id } = active;
                        const overId = over?.id;
                        if (overId) {
                          const activeIndex = fields.findIndex(
                            (field) => field.id === id
                          );
                          const overIndex = fields.findIndex(
                            (field) => field.id === overId
                          );
                          swap(activeIndex, overIndex);
                        }
                      }}
                    >
                      <SortableContext items={fields}>
                        {fields.map((field, index) => {
                          return (
                            <SortableItemColumn
                              id={field.id}
                              key={field.id}
                              errors={errors}
                              index={index}
                              register={register}
                              remove={remove}
                              length={fields.length}
                            />
                          );
                        })}
                      </SortableContext>
                    </DndContext>
                  </div>
                  <div className="flex flex-col">
                    <button
                      className="mb-6 h-10 w-full rounded-full bg-white text-sm font-bold text-mainPurple"
                      type="button"
                      onClick={() =>
                        append({ title: "", index: fields.length })
                      }
                    >
                      + Add New Column
                    </button>
                    <button
                      type="submit"
                      className="h-10 w-full rounded-full bg-mainPurple text-sm font-bold text-white"
                    >
                      {isEdit ? "Save Changes" : "Create New Board"}
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
