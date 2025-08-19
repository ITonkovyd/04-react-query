import css from './MovieGrid.module.css'
import type { Movie } from '../../types/movie';
import noImagePlaceholder from '../../assets/noImagePlaceholder.png';

interface MovieGridProps {
  onSelect: (movie: Movie) => void;
  movies: Movie[];
}

const MovieGrid = ({ onSelect, movies }: MovieGridProps) => {
  return (
    <ul className={css.grid}>
      {movies.map((movie) => {
        const posterPath = movie.poster_path || movie.backdrop_path;

        return (
          <li key={movie.id} onClick={() => onSelect(movie)}>
            <div className={css.card}>
              <img
                className={css.image}
                src={
                  posterPath
                    ? `https://image.tmdb.org/t/p/w500/${posterPath}`
                    : noImagePlaceholder
                }
                alt={movie.title}
                loading="lazy"
              />
              <h2 className={css.title}>{movie.title}</h2>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default MovieGrid