import { trpc } from '@/utils/trpc';
import Image from 'next/image';
import Link from 'next/link';

export default function Votes() {
  const { data: movies } = trpc.movie.perVotes.useQuery({ order: 'desc' });

  return (
    <div className="h-screen w-screen overflow-y-auto bg-zinc-900">
      <Link href="/" className="absolute top-3 left-5 text-zinc-400">
        Play
      </Link>
      {movies && (
        <div className="mx-auto mt-4 flex w-max flex-col gap-2">
          <h1 className="mx-auto mb-6 w-max text-xl text-white">Most voted for</h1>
          {movies
            .sort((a, b) => b.votesFor.length - a.votesFor.length)
            .map((movie) => (
              <div
                key={movie.id}
                className="flex w-96 items-center justify-between rounded-lg bg-zinc-800 px-4 py-2 text-white">
                <div className="mr-4 flex items-center gap-4 truncate">
                  <Image
                    src={movie.image}
                    alt={movie.title}
                    width={40}
                    height={40}
                    className="rounded-lg"
                  />
                  <div className="flex items-center gap-1 ">
                    <h3 className="text-white">{movie.title}</h3>
                    {movie.year && <h4 className="  text-gray-500">({movie.year})</h4>}
                  </div>
                </div>
                <div className="text-lg font-bold">{movie.votesFor.length}</div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
