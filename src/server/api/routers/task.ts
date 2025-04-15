import { z } from 'zod';
import { router, publicProcedure } from '../trpc';

export const taskRouter = router({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.task.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.task.findUnique({
        where: { id: input.id },
      });
    }),

  create: publicProcedure
    .input(z.object({
      title: z.string().min(1),
      description: z.string().optional(),
    }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.task.create({
        data: input,
      });
    }),

  update: publicProcedure
    .input(z.object({
      id: z.string(),
      title: z.string().min(1).optional(),
      description: z.string().optional(),
      completed: z.boolean().optional(),
    }))
    .mutation(({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.prisma.task.update({
        where: { id },
        data,
      });
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.task.delete({
        where: { id: input.id },
      });
    }),
});