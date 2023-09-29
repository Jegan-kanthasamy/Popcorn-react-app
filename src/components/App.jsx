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
import { useMovie } from "./useMovie";
import { useLocalStorageState } from "./useLocalStoreageState";

const KEY = "25162b48";

export default function App() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [watched, setWatched] = useLocalStorageState([], "watched");

  const { movies, isLoading, error } = useMovie(query);

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
