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
    .input(z.object({ title: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.board.create({
        data: {
          title: input.title,
          userId: ctx.session.user.id,
        },
      });
    }),
});
