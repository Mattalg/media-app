import { getRandomRanks } from '@/utils/random-movie';
import { trpc } from '@/utils/trpc';
import { Movie } from '@prisma/client';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

type VotedMovie = 'first' | 'second';

export default function Movies() {
  const hydrated = useRef(true);
  const [first, setFirst] = useState('');
  const [second, setSecond] = useState('');

  useEffect(() => {
    if (hydrated.current) {
      hydrated.current = false;
      updateMovies();
    }
  }, []);

  function updateMovies() {
    const [firstRank, secondRank] = getRandomRanks();
    setFirst(firstRank);
    setSecond(secondRank);
  }

  return (
    <>
      <div className="flex h-full w-full flex-col">
        <div className="mx-auto flex w-max flex-1 items-center">
          <div className="-mt-10 flex flex-col">
            <h1 className="mx-auto mb-6 w-max text-xl text-white">Wich is your favourite ?</h1>
            {!!first && !!second && (
              <VotingArea firstRank={first} secondRank={second} reset={updateMovies} />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function VotingArea({
  firstRank,
  secondRank,
  reset,
}: {
  firstRank: string;
  secondRank: string;
  reset: () => void;
}) {
  const { data: firstMovie } = trpc.movie.byImdbRank.useQuery({ rank: firstRank });
  const { data: secondMovie } = trpc.movie.byImdbRank.useQuery({ rank: secondRank });
  const newVote = trpc.movie.newVote.useMutation();

  function handleVote(voted: VotedMovie) {
    if (!firstMovie || !secondMovie) return;

    let vote = { votedForId: firstMovie.id, votedAgainstId: secondMovie.id };

    if (voted === 'second') {
      vote = { votedForId: secondMovie.id, votedAgainstId: firstMovie.id };
    }

    newVote.mutate(vote);
    reset();
  }

  return (
    <div className="flex gap-6">
      {firstMovie && <MovieCard order="first" movie={firstMovie} onVote={handleVote} />}
      {secondMovie && <MovieCard order="second" movie={secondMovie} onVote={handleVote} />}
    </div>
  );
}

function MovieCard({
  order,
  movie,
  onVote,
}: {
  order: VotedMovie;
  movie: Movie;
  onVote: (voted: VotedMovie) => void;
}) {
  if (!movie) {
    return <div>Loading...</div>;
  }

  function handleOnClick() {
    onVote(order);
  }

  return (
    <div className="flex h-max flex-col items-center rounded-lg bg-zinc-800 p-4">
      <Image src={movie.image} alt={movie.title} width={200} height={200} className="rounded-lg" />
      <div className="mt-2 flex items-center gap-1">
        <h3 className="text-white">{movie.title}</h3>
        {movie.year && <h4 className="text-gray-500">({movie.year})</h4>}
      </div>
      <button
        className="gray-900 mt-4 rounded-md bg-red-500 py-1 px-3 text-sm font-bold text-white"
        onClick={handleOnClick}>
        Choose
      </button>
    </div>
  );
}
