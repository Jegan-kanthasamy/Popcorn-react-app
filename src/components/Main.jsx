import { useEffect, useState } from "react";
import StarRating from "./StarRating";
import { Loading } from "./Loading";

const average = arr =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export default function Main({ children }) {
  return <main className="main">{children}</main>;
}

export function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen(open => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}

export function MoviesList({ movies, onSelectedMovie }) {
  return (
    <ul className="list list-movies">
      {movies?.map(movie => (
        <Movie
          movie={movie}
          key={movie.imdbID}
          onSelectedMovie={onSelectedMovie}
        />
      ))}
    </ul>
  );
}

function Movie({ movie, onSelectedMovie }) {
  return (
    <li onClick={() => onSelectedMovie(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

export function WatchedMovieSummary({ watched }) {
  const avgImdbRating = average(watched.map(movie => movie.imdbRating));
  const avgUserRating = average(watched.map(movie => movie.userRating));
  const avgRuntime = average(watched.map(movie => movie.runtime));

  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime.toFixed(0)} min</span>
        </p>
      </div>
    </div>
  );
}

export function WatchedMovieList({ watched, onDeleteMovie }) {
  return (
    <ul className="list">
      {watched.map(movie => (
        <WatchedMovie
          movie={movie}
          key={movie.imdbId}
          onDeleteMovie={onDeleteMovie}
        />
      ))}
    </ul>
  );
}

function WatchedMovie({ movie, onDeleteMovie }) {
  return (
    <li>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
        <button
          className="btn-delete"
          onClick={() => onDeleteMovie(movie.imdbId)}
        >
          X
        </button>
      </div>
    </li>
  );
}

export function MovieDetails({
  selectedId,
  onClose,
  KEY,
  onWatchedList,
  watchedList,
}) {
  const [movie, setMovie] = useState({});
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [userStarRating, setUserStarRating] = useState("");
  const apiKey = KEY;

  const isWatched = watchedList.map(movie => movie.imdbId).includes(selectedId);
  const watchedUserRating = watchedList.find(
    movie => movie.imdbId === selectedId
  )?.userRating;
  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  function handleAddWatchList(movie) {
    const newMovie = {
      imdbId: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: runtime.split(" ").at(0),
      userRating: userStarRating,
    };
    onWatchedList(newMovie);
    onClose();
  }

  useEffect(
    function () {
      function callback(e) {
        if (e.code === "Escape") {
          onClose();
        }
      }
      document.addEventListener("keydown", callback);

      return () => {
        document.removeEventListener("keydown", callback);
      };
    },
    [onClose]
  );

  useEffect(
    function () {
      async function fetchDetail() {
        setDetailsLoading(true);
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${apiKey}&i=${selectedId}`
        );
        const data = await res.json();

        setMovie(data);

        setDetailsLoading(false);
      }
      fetchDetail();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedId]
  );
  useEffect(() => {
    document.title = `Movie | ${title}`;
    return () => {
      document.title = "Popcorn";
    };
  }, [title]);
  return (
    <div className="details">
      {detailsLoading ? (
        <Loading />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onClose}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                version="1.1"
                width="18"
                height="18"
                x="0"
                y="0"
                viewBox="0 0 64 64"
              >
                <g>
                  <path
                    fill="#0b0b0c"
                    d="M29.958 22.039h28a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2h-28z"
                    opacity="1"
                    data-original="#0a5078"
                  ></path>
                  <path
                    fill="#0b0b0c"
                    d="M31.958 22.039h1v20h-1z"
                    opacity="1"
                    data-original="#00325a"
                  ></path>
                  <path
                    fill="#0b0b0c"
                    d="M31.958 14.045v35.986c0 1.649-1.884 2.59-3.202 1.598L4.833 33.637a2 2 0 0 1 0-3.197l23.923-17.993c1.318-.991 3.202-.051 3.202 1.598z"
                    opacity="1"
                    data-original="#00a0c8"
                  ></path>
                </g>
              </svg>
            </button>
            <img src={poster} alt={`This is a poster of ${title}`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released}&bull;{runtime}
              </p>
              <p>
                <span>⭐</span>
                {imdbRating} IMDb Rating
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              {!isWatched ? (
                <>
                  <StarRating
                    maxRating={10}
                    size="24"
                    onSetRating={setUserStarRating}
                  />
                  {userStarRating && (
                    <button className="btn-add" onClick={handleAddWatchList}>
                      + Add to the list
                    </button>
                  )}
                </>
              ) : (
                <p>
                  You rated this movie {watchedUserRating}
                  <span className="user-rating-star">⭐</span>
                </p>
              )}
            </div>
            <p>
              <em>{plot}</em> &bull; <strong>{year}</strong>
            </p>
            <p>Starring: {actors}</p>
            <p>Directed by: {director}</p>
            <p>Genre: {genre}</p>
          </section>
        </>
      )}
    </div>
  );
}
