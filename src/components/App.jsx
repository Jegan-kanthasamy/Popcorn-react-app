import { useEffect, useState } from "react";
import NavBar, { NumResult, SearchBar } from "./NavBar";
import Main, {
  Box,
  MoviesList,
  WatchedMovieList,
  WatchedMovieSummary,
  MovieDetails,
} from "./Main";
import { Loading } from "./Loading";

const KEY = "25162b48";

export default function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  function handleSelectMovie(id) {
    setSelectedId(id === selectedId ? null : id);
  }

  function handleClose(id) {
    setSelectedId(null);
  }

  function handleWatchedList(movie) {
    setWatched(watched => [...watched, movie]);
  }

  function handleDeleteMovie(id) {
    setWatched(watched => watched.filter(movies => movies.imdbId !== id));
  }

  useEffect(
    function () {
      const controller = new AbortController();
      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError("");
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            { signal: controller.signal }
          );

          if (!res.ok)
            throw new Error("Something went wrong while fetching movies");

          const data = await res.json();
          if (data.Response === "False") throw new Error("Movie not found");
          setMovies(data.Search);
          setError("");
        } catch (err) {
          if (err.name !== "AbortError") setError(err.message);
        } finally {
          setIsLoading(false);
        }
      }
      if (query.length < 3) {
        setError("");
        setMovies([]);
        return;
      }
      handleClose();
      fetchMovies();
      return () => {
        controller.abort();
      };
    },
    [query]
  );

  return (
    <>
      <NavBar>
        <SearchBar query={query} setQuery={setQuery} />
        <NumResult movies={movies} />
      </NavBar>

      <Main>
        <Box>
          {isLoading && <Loading />}
          {!isLoading && !error && (
            <MoviesList movies={movies} onSelectedMovie={handleSelectMovie} />
          )}
          {error && <ErrorMessage error={error} />}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onClose={handleClose}
              KEY={KEY}
              onWatchedList={handleWatchedList}
              watchedList={watched}
            />
          ) : (
            <>
              <WatchedMovieSummary watched={watched} />
              <WatchedMovieList
                watched={watched}
                onDeleteMovie={handleDeleteMovie}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

function ErrorMessage({ error }) {
  return (
    <>
      <p className="error">
        <span>📵</span>
        {error}
      </p>
    </>
  );
}
