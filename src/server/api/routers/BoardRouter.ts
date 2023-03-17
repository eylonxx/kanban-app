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
            create: input.columns.map((column) => ({
              title: column,
            })),
          },
        },
      });
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.board.update({
        where: { id: input.id },
        data: {
          title: input.title,
        },
      });
    }),
});
//   await ctx.prisma.$transaction(async (tx) => {
//     const board = await tx.board.create({
//       data: {
//         title: input.title,
//         userId: ctx.session.user.id,
//       },
//     });

//     const columns = input.columns.map((col) =>
//       tx.column.create({
//         data: {
//           title: col,
//           boardId: board.id,
//         },
//       })
//     );
//   });
// }),

// return ctx.prisma.board.create({
//   data: {
//     title: input.title,
//     user:{connect:},
//     columns: {
//       create: input.columns.map((column) => ({
//         title: column,
//       })),
//     },
//   },
// });
