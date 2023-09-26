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
  const [query, setQuery] = useState("inception");
  const [selectedId, setSelectedId] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  function handleSelectMovie(id) {
    id === selectedId ? setSelectedId(null) : setSelectedId(id);
  }

  function handleClose(id) {
    setSelectedId(null);
  }
  useEffect(
    function () {
      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError("");
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`
          );

          if (!res.ok)
            throw new Error("Something went wrong while fetching movies");

          const data = await res.json();

          if (data.Response === "False") throw new Error("Movie not found");
          setMovies(data.Search);
        } catch (err) {
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      }
      if (query.length < 3) {
        setError("");
        setMovies([]);
        return;
      }
      fetchMovies();
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
              setDetailsLoading={setDetailsLoading}
            />
          ) : (
            <>
              <WatchedMovieSummary watched={watched} />
              <WatchedMovieList watched={watched} />
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
