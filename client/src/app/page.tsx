'use client';

import { useState } from 'react';
import SearchBar from './components/search-bar';
import Tile from './components/tile';
import ApiService, { Movie, MovieSearchResponse } from './services/api-service';
import Pagination from './components/pagination';

const Main: React.FC = () => {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const updateMovies = ({ results, total_pages }: MovieSearchResponse) => {
    setMovies(results);
    setCurrentPage(1);
    setTotalPages(total_pages);
  };

  const onPageChange = async (page: number) => {
    setCurrentPage(page);
    const nextPage = await new ApiService().fetchMovies(query, page);
    setMovies(nextPage.results);
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
      <SearchBar query={query} setQuery={setQuery} onSearch={updateMovies} />

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
      <div className="container m-auto grid grid-cols-4 gap-7">
        {movies.map((movie) => (
          <Tile movie={movie} />
        ))}
      </div>
    </main>
  );
};

export default Main;
