import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const SubtaskRouter = createTRPCRouter({
  update: protectedProcedure
    .input(
      z.object({
        subtasks: z.array(
          z.object({
            id: z.string(),
            checked: z.boolean(),
          })
        ),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.$transaction(
        input.subtasks.map(({ id, checked }) =>
          ctx.prisma.subtask.update({
            where: { id },
            data: { checked },
          })
        )
      );
    }),
});
