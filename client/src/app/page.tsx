'use client';

import { useState } from 'react';
import SearchBar from './components/search-bar';
import Tile from './components/tile';
import { MovieResponse } from './services/api-service';

const Main: React.FC = () => {
  const [movies, setMovies] = useState<MovieResponse[]>([]);
  const updateMovies = (movies: MovieResponse[]) => {
    setMovies(movies);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="container py-5 mx-auto">
        <div className="flex gap-8">
          <div className="flex-none">
            <h2 className="text-2xl mb-2 font-bold">Movie Search</h2>
          </div>
        </div>
      </div>
      <SearchBar onTilesUpdate={updateMovies} />

      <div className="container m-auto grid grid-cols-4 gap-7">
        {movies.map((movie) => (
          <Tile movie={movie} />
        ))}
      </div>
    </main>
  );
};

export default Main;
