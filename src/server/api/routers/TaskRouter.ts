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
      });
    }),
  update: protectedProcedure
    .input(
      z.object({ id: z.string(), newRank: z.string(), newColumnId: z.string() })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.task.update({
        where: {
          id: input.id,
        },
        data: {
          rank: input.newRank,
          columnId: input.newColumnId,
        },
      });
    }),
});
