import { trpc } from '@/utils/trpc';
import { Movie } from '@prisma/client';
import Image from 'next/image';
import { useEffect, useRef } from 'react';

type VotedMovie = 'first' | 'second';

export default function Movies() {
  const hydrated = useRef(true);
  const { data, isLoading, isFetching } = trpc.movie.contenders.useQuery();

  useEffect(() => {
    if (hydrated.current) {
      hydrated.current = false;
    }
  }, []);

  return (
    <>
      <div className="flex h-full w-full flex-col">
        <div className="mx-auto flex w-max flex-1 items-center">
          <div className="-mt-10 flex flex-col">
            <h1 className="mx-auto mb-6 w-max text-xl text-white">Wich is your favourite ?</h1>
            <VotingArea
              first={data?.first || null}
              second={data?.second || null}
              loading={isLoading || isFetching}
            />
          </div>
        </div>
      </div>
    </>
  );
}

function VotingArea({
  first,
  second,
  loading,
}: {
  first: Movie | null;
  second: Movie | null;
  loading: boolean;
}) {
  const newVote = trpc.movie.newVote.useMutation();
  const utils = trpc.useContext();

  function handleVote(voted: VotedMovie) {
    if (!first || !second) return;

    let vote = { votedForId: first.id, votedAgainstId: second.id };

    if (voted === 'second') {
      vote = { votedForId: second.id, votedAgainstId: first.id };
    }

    newVote.mutate(vote);
    utils.movie.contenders.invalidate();
  }

  return (
    <div className="flex gap-6">
      <MovieCard order="first" movie={!loading ? first : null} onVote={handleVote} />
      <MovieCard order="second" movie={!loading ? second : null} onVote={handleVote} />
    </div>
  );
}

function MovieCard({
  order,
  movie,
  onVote,
}: {
  order: VotedMovie;
  movie: Movie | null;
  onVote: (voted: VotedMovie) => void;
}) {
  function handleOnClick() {
    onVote(order);
  }

  return (
    <div className="flex h-max flex-col items-center rounded-lg bg-zinc-800 p-4">
      <div className="relative h-72 w-52 rounded-lg">
        {movie && (
          <Image
            src={movie.image}
            alt={movie.title}
            fill
            sizes="(max-width: 768px) 100vw,
              (max-width: 1200px) 100vw,
              100vw"
          />
        )}
      </div>
      <div className="mt-2 flex items-center gap-1">
        <h3 className="text-white">{movie?.title}</h3>
        {movie?.year && <h4 className="text-gray-500">({movie.year})</h4>}
      </div>
      {movie && (
        <button
          className="gray-900 mt-4 rounded-md bg-red-500 py-1 px-3 text-sm font-bold text-white"
          onClick={handleOnClick}>
          Choose
        </button>
      )}
    </div>
  );
}
