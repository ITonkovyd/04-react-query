import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import css from './MovieModal.module.css';
import type { Movie } from '../../types/movie';
import imagePlaceholder from '../../assets/noImagePlaceholder.png';

interface MovieModalProps {
  movie: Movie | null;
  onClose: () => void;
}

export default function MovieModal({ movie, onClose }: MovieModalProps) {
  const posterPath = movie?.poster_path || movie?.backdrop_path;

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return createPortal(
    <div
      className={css.backdrop}
      role="dialog"
      aria-modal="true"
      onClick={handleBackdropClick}
    >
      <div className={css.modal}>
        <button
          className={css.closeButton}
          aria-label="Close modal"
          onClick={onClose}
        >
          &times;
        </button>
        <img
          src={
            posterPath
              ? `https://image.tmdb.org/t/p/original/${posterPath}`
              : imagePlaceholder
          }
          alt={movie?.title}
          className={css.image}
        />
        <div className={css.content}>
          <h2>{movie?.title}</h2>
          <p>{movie?.overview}</p>
          <p>
            <strong>Release Date: {movie?.release_date}</strong>
          </p>
          <p>
            <strong>Rating: {movie?.vote_average.toFixed(1)}/ 10</strong>
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
}
