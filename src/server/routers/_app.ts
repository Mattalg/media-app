import { prisma } from '@/utils/prisma';
import { z } from 'zod';
import { procedure, router } from '../trpc';

// const OrderEnum = z.enum(['asc', 'desc']);
// type Order = z.infer<typeof OrderEnum>;

const findUniqueByRank = async (rank: string) => {
  const result = await prisma.movie.findUnique({
    where: {
      rank,
    },
  });
  return result;
};

const createVote = async (vote: { votedForId: string; votedAgainstId: string }) => {
  const result = await prisma.vote.create({ data: vote });
  return result;
};

const findAllVotedFor = async () => {
  const result = await prisma.movie.findMany({
    include: {
      votesFor: {
        select: {
          createdAt: true,
        },
      },
    },
  });
  return result;
};

export const appRouter = router({
  movie: router({
    byImdbRank: procedure
      .input(
        z.object({
          rank: z.string(),
        }),
      )
      .query(async ({ input }) => {
        const result = await findUniqueByRank(input.rank);

        return result;
      }),
    newVote: procedure
      .input(
        z.object({
          votedForId: z.string(),
          votedAgainstId: z.string(),
        }),
      )
      .mutation(async ({ input }) => {
        const result = await createVote(input);

        return result;
      }),
    perVotes: procedure.input(z.object({})).query(async ({ input }) => {
      const result = await findAllVotedFor();

      return result;
    }),
  }),
});

export type AppRouter = typeof appRouter;
