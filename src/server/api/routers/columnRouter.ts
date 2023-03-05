import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const columnRouter = createTRPCRouter({
  getAll: protectedProcedure
    .input(z.object({ boardId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.column.findMany({
        where: {
          boardId: input.boardId,
        },
      });
    }),
  create: protectedProcedure
    .input(z.object({ title: z.string(), boardId: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.column.create({
        data: {
          title: input.title,
          boardId: input.boardId,
        },
      });
    }),
});
