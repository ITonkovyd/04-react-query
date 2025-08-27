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

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, isSuccess } = useQuery({
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
  }, [data]);

  return (
    <>
      <SearchBar
        onSubmit={(query) => {
          setPage(1);
          setSearchQuery(query);
        }}
      />
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {isSuccess && data.total_pages > 1 && (
        <ReactPaginate
          pageCount={data.total_pages}
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
      {isSuccess && data.results.length > 0 && (
        <MovieGrid
          movies={data.results}
          onSelect={(movie) => setSelectedMovie(movie)}
        />
      )}
      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
      <Toaster />
    </>
  );
}
