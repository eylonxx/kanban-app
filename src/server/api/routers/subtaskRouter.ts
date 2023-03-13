import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const subtaskRouter = createTRPCRouter({
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        checked: z.boolean(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.subtask.update({
        where: {
          id: input.id,
        },
        data: {
          checked: input.checked,
        },
      });
    }),
});
