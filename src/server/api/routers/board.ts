import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const boardRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.board.findMany({
      where: {
        OR: [{ userId: ctx.session.user.id }],
      },
    });
  }),
  create: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        columns: z.array(z.string()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.board.create({
        data: {
          title: input.title,
          userId: ctx.session.user.id,
          columns: {
            create: input.columns.map((column, i) => ({
              title: column,
              index: i,
            })),
          },
        },
      });
    }),
  update: protectedProcedure
    .input(
      z.object({
        boardId: z.string(),
        toCreate: z.array(
          z.object({
            title: z.string(),
            index: z.number(),
          })
        ),
        toUpdate: z.array(
          z.object({
            id: z.string().optional(),
            title: z.string().optional(),
            boardId: z.string().optional(),
            index: z.number().optional(),
          })
        ),
        toDelete: z.array(z.string()),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.$transaction([
        ...input.toCreate.map((col) =>
          ctx.prisma.column.create({
            data: {
              title: col.title,
              boardId: input.boardId,
              index: col.index,
            },
          })
        ),
        ...input.toUpdate.map((col) =>
          ctx.prisma.column.update({
            where: { id: col.id },
            data: {
              title: col.title,
              index: col.index,
            },
          })
        ),
        ...input.toDelete.map((id) =>
          ctx.prisma.column.delete({
            where: { id },
          })
        ),
      ]);
    }),
  deleteBoard: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.board.delete({
        where: { id: input.id },
      });
    }),
});
