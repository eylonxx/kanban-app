import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { type BoardModalFormValues } from "./BoardModal";
import {
  type FieldErrors,
  type UseFieldArrayRemove,
  type UseFormRegister,
} from "react-hook-form";
import IconCross from "../../assets/icon-cross.svg";
import IconMenu from "../../assets/icon-menu.svg";

interface SortableItemProps {
  id: string;
  errors: FieldErrors<BoardModalFormValues>;
  index: number;
  register: UseFormRegister<BoardModalFormValues>;
  remove: UseFieldArrayRemove;
  length: number;
}

export default function SortableItemColumn({
  id,
  errors,
  index,
  register,
  remove,
  length,
}: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      className={`${
        isDragging ? "opacity-30" : "opacity-100"
      } mb-3 flex w-full`}
      style={style}
    >
      <div className="flex items-center" {...attributes} {...listeners}>
        <IconMenu />
      </div>
      <div className="flex w-full">
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
          } h-10 w-full flex-1 rounded-md border-2 bg-transparent py-2 pl-4 text-base transition-all  hover:border-mainPurple focus:outline-none`}
        />
        <button
          type="button"
          className={`${errors?.columns?.[index]?.title ? "text-red" : ""} ${
            length === 1 ? "opacity-20" : ""
          } ml-4`}
          disabled={length === 1}
          onClick={() => remove(index)}
        >
          <IconCross />
        </button>
      </div>
    </div>
  );
}
