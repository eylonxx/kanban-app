import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const taskRouter = createTRPCRouter({
  getAll: protectedProcedure
    .input(z.object({ columnIds: z.array(z.string()) }))
    .query(({ ctx, input }) => {
      return ctx.prisma.task.findMany({
        where: {
          columnId: { in: input.columnIds },
        },
        include: { subtasks: true },
      });
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        newRank: z.string().optional(),
        newColumnId: z.string().optional(),
        title: z.string().optional(),
        description: z.string().optional(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.task.update({
        where: {
          id: input.id,
        },
        data: {
          rank: input.newRank,
          columnId: input.newColumnId,
          title: input.title,
          description: input.description,
        },
      });
    }),
  create: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string(),
        columnId: z.string(),
        rank: z.string(),
        subtasks: z.array(z.string()),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.task.create({
        data: {
          title: input.title,
          description: input.description,
          userId: ctx.session.user.id,
          columnId: input.columnId,
          rank: input.rank,
          subtasks: {
            create: input.subtasks.map((subtask, i) => ({
              title: subtask,
              index: i,
            })),
          },
        },
        include: { subtasks: true },
      });
    }),
});
