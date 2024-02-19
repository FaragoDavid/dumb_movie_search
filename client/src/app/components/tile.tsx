'use client';

import { Movie } from '@/app/services/api-service';

interface TileProps {
  movie: Movie;
}

const Tile: React.FC<TileProps> = ({ movie }) => {
  const image = movie.poster_path !== null ? <img src={movie.poster_path} alt={movie.title} /> : '';

  return (
    <div className="tile">
      <p className="text-center	text-xl	truncate">{movie.title}</p>
      {image}
      <p className="truncate">{movie.overview}</p>
    </div>
  );
};

export default Tile;
