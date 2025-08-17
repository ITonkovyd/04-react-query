import { useState, useEffect } from "react";
import toast, { Toaster } from 'react-hot-toast';
import type { Movie } from "../../types/movie";
import { fetchMovies } from "../../services/movieService";
import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";

interface ModalState {
  movieId: null | number;
  isOpen: boolean;
}

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [modalState, setModalState] = useState<ModalState>({
    movieId: null,
    isOpen: false,
  });

  useEffect(() => {
    if (!searchQuery) return;

    setMovies([]);
    toast.dismiss();
    setIsError(false);
    setIsLoading(true);

    fetchMovies(searchQuery)
      .then((data) => {
        if (data.results.length === 0) {
          toast.error("No movies found for your request.");
          return;
        }
        setMovies(data.results);
      })
      .catch((error) => {
        setIsError(true);
        console.error(error.message);
      })
      .finally(() => {
        setIsLoading(false);
      });

  }, [searchQuery]);

  const getSelectedMovie = (): Movie | undefined => {
    return movies.find(movie => movie.id === modalState.movieId);
  }

  return (
    <>
      <SearchBar onSubmit={(query) => setSearchQuery(query)} />
      {movies.length > 0 &&
        <MovieGrid
          movies={movies}
          onSelect={(id) => setModalState({ movieId: id, isOpen: true })}
        />
      }
      {(modalState.isOpen && modalState.movieId) &&
        <MovieModal
          movie={getSelectedMovie()}
          onClose={() => setModalState({ movieId: null, isOpen: false })}
        />
      }
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      <Toaster />
    </>
  );
}
