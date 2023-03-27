import { createTRPCRouter } from "~/server/api/trpc";
import { BoardRouter } from "./routers/boardRouter";
import { ColumnRouter } from "./routers/columnRouter";
import { SubtaskRouter } from "./routers/subtaskRouter";
import { TaskRouter } from "./routers/taskRouter";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  board: BoardRouter,
  task: TaskRouter,
  column: ColumnRouter,
  subtask: SubtaskRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
