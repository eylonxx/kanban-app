import { type Column, type Prisma } from "@prisma/client";
import { atom } from "jotai";
type Task = Prisma.TaskGetPayload<{ include: { subtasks: true } }>;

export const tasksAtom = atom<Task[]>([]);
export const columnsAtom = atom<Column[]>([]);
