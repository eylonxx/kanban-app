import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const subtaskRouter = createTRPCRouter({
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().optional(),
        checked: z.boolean().optional(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.subtask.update({
        where: {
          id: input.id,
        },
        data: {
          title: input.title,
          checked: input.checked,
        },
      });
    }),
});
