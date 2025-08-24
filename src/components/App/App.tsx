import { useState, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";
import type { Movie } from "../../types/movie";
import { fetchMovies } from "../../services/movieService";
import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";
import ReactPaginate from "react-paginate";
import css from "./App.module.css";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

interface IResponseData {
  movies: Movie[];
  totalPages: number;
}

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [responseData, setResponseData] = useState<IResponseData>({
    movies: [],
    totalPages: 0,
  });
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useQuery({
    queryKey: ["fetchMovies", searchQuery, page],
    queryFn: () => fetchMovies(searchQuery, page),
    enabled: searchQuery.trim() !== "",
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (!data) return;

    if (data.total_results === 0) {
      toast.error("No movies found for your request.");

      return;
    }

    if (data.total_results > 0) {
      setResponseData({
        movies: data.results,
        totalPages: data.total_pages,
      });

      return;
    }
  }, [data]);

  return (
    <>
      <SearchBar onSubmit={(query) => setSearchQuery(query)} />
      {responseData.totalPages > 1 && (
        <ReactPaginate
          pageCount={responseData.totalPages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }) => setPage(selected + 1)}
          forcePage={page - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}
      {responseData.movies.length > 0 && (
        <MovieGrid
          movies={responseData.movies}
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
