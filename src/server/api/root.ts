import { createTRPCRouter } from "~/server/api/trpc";
import { boardRouter } from "./routers/BoardRouter";
import { taskRouter } from "./routers/TaskRouter";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  board: boardRouter,
  task: taskRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
