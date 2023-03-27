import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const ColumnRouter = createTRPCRouter({
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
    .input(
      z.object({ title: z.string(), boardId: z.string(), index: z.number() })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.column.create({
        data: {
          title: input.title,
          boardId: input.boardId,
          index: input.index,
        },
      });
    }),
  update: protectedProcedure
    .input(
      z.object({
        columns: z.array(z.object({ title: z.string(), id: z.string() })),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.$transaction(
        input.columns.map(({ id, title }) =>
          ctx.prisma.column.update({
            where: { id: id },
            data: { title: title },
          })
        )
      );
    }),
});
