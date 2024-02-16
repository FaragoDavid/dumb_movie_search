'use client';

import React, { useState } from 'react';
import ApiService, { MovieResponse } from '@/app/services/api-service';

interface SearchBarProps {
  onTilesUpdate: (newList: MovieResponse[]) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onTilesUpdate }) => {
  const [searchValue, setSearchValue] = useState('');

  const fetchMovies = async () => {
    onTilesUpdate(await new ApiService().fetchMovies(searchValue));
  };

  const handleSearchClick = async () => {
    await fetchMovies();
  };

  const handleInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);

    if (searchValue.length >= 3) {
      await fetchMovies();
    }
  };

  return (
    <div className="container py-3 mx-auto">
      <div className="flex-1 mb-3">
        <div className="relative mb-4 flex w-full flex-wrap items-stretch">
          <input
            type="search"
            className="relative m-0 -mr-0.5 block min-w-0 flex-auto rounded-l border border-solid border-neutral-300 bg-transparent bg-clip-padding px-3 py-[0.25rem] text-base font-normal leading-[1.6] text-neutral-700 outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-primary focus:text-neutral-700 focus:shadow-[inset_0_0_0_1px_rgb(59,113,202)] focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:focus:border-primary"
            placeholder="Search"
            aria-label="Search"
            aria-describedby="button-addon3"
            onChange={handleInputChange}
          />

          <button
            id="button-addon3"
            onClick={handleSearchClick}
            type="button"
            className="relative z-[2] rounded-r border-2 border-primary px-6 py-2 text-xs font-medium uppercase text-primary transition duration-150 ease-in-out hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0"
            data-te-ripple-init
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
