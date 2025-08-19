import { useState, useEffect } from "react";
import toast, { Toaster } from 'react-hot-toast';
import type { Movie } from "../../types/movie";
import { fetchMovies } from "../../services/movieService";
import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  useEffect(() => {
    if (!searchQuery) return;

    setMovies([]);
    toast.dismiss();
    setIsError(false);
    setIsLoading(true);

    fetchMovies(searchQuery)
      .then((data) => {
        if (data.length === 0) {
          toast.error("No movies found for your request.");
          return;
        }
        setMovies(data);
      })
      .catch((error) => {
        setIsError(true);
        console.error(error.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [searchQuery]);

  return (
    <>
      <SearchBar onSubmit={(query) => setSearchQuery(query)} />
      {movies.length > 0 && (
        <MovieGrid
          movies={movies}
          onSelect={(movie) => setSelectedMovie(movie)}
        />
      )}
      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      <Toaster />
    </>
  );
}
