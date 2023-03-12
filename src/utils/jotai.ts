import { type Column, type Task } from "@prisma/client";
import { atom } from "jotai";

export const tasksAtom = atom<Task[]>([]);
export const columnsAtom = atom<Column[]>([]);
