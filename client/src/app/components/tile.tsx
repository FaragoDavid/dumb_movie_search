'use client';

import { MovieResponse } from '@/app/services/api-service';

interface TileProps {
  movie: MovieResponse;
}

const Tile: React.FC<TileProps> = ({ movie }) => {
  const image = movie.imageSrc !== null ? <img src={movie.imageSrc} alt={movie.title} /> : '';
  return (
    <div className="tile">
      <p className="text-center	text-xl	truncate">{movie.title}</p>
      {image}
      <p className="truncate">{movie.description}</p>
    </div>
  );
};

export default Tile;
