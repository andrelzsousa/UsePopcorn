import { useEffect, useRef, useState } from "react";
import StarRating from './StarRating'
import { useMovies } from './useMovies';
import { useLocalStorage } from './useLocalStorage';
import { useKey } from './useKey';

// const tempMovieData = [
//   {
//     imdbID: "tt1375666",
//     Title: "Inception",
//     Year: "2010",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
//   },
//   {
//     imdbID: "tt0133093",
//     Title: "The Matrix",
//     Year: "1999",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
//   },
//   {
//     imdbID: "tt6751668",
//     Title: "Parasite",
//     Year: "2019",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
//   },
// ];

// const tempWatchedData = [
//   {
//     imdbID: "tt1375666",
//     Title: "Inception",
//     Year: "2010",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
//     runtime: 148,
//     imdbRating: 8.8,
//     userRating: 10,
//   },
//   {
//     imdbID: "tt0088763",
//     Title: "Back to the Future",
//     Year: "1985",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
//     runtime: 116,
//     imdbRating: 8.5,
//     userRating: 9,
//   },
// ];

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const KEY = '74a9047d'

export default function App() {

  const [query, setQuery] = useState("");
  const [selectedID, setSelectedID] = useState(null)
  
  const [watched, setWatched] = useLocalStorage([], "watched")

  const { movies, isLoading, error } = useMovies(query)

  function handleSelectMovie(id) {
    setSelectedID(id)
  }

  function handleCloseMovie() {
    setSelectedID(null)
  }

  function handleAddWatched(movie) {

    setWatched(watched => [...watched, movie])
  }

  function handleDeleteWatched(e, id) {
    e.stopPropagation()
    setWatched(watched => watched.filter(w => w.imdbID !== id))
  }

  return (
    <>
      <NavBar>
        <Search query={query} onQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>
      <Main>
        <Box>
          {/* {isLoading? <Loader /> : <MovieList movies={movies} />} */}
          {isLoading && <Loader />}
          {!error && !isLoading && <MovieList movies={movies} onSelectMovie={handleSelectMovie} />}
          {error && <ErrorMessage message={error} />}
        </Box>
        <Box>
          {selectedID ? <MovieDetails selectedID={selectedID} onCloseMovie={handleCloseMovie} onAddWatched={handleAddWatched} watched={watched} /> : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMoviesList watched={watched} onDeleteWatched={handleDeleteWatched} onSelectMovie={handleSelectMovie}/>
            </>
          )}
        </Box>
      </Main>
    </>
  )
}

function Loader() {
  return <p className='loader'>Loading...</p>
}

function ErrorMessage({ message }) {
  return (
    <p className='error'>
      <span>⛑️</span> {message}
    </p>
  )
}

function NavBar({ children }) {

  return (
    <nav className="nav-bar">
      <Logo />
      {children}
    </nav>
  )
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  )
}

function Search({ query, onQuery }) {

  const inputEl = useRef(null)

  useEffect(() => {
    inputEl.current.focus()

    function callback(e) {
      if (document.activeElement === inputEl.current) return;

      if (e.code === "Enter") {
        inputEl.current.focus()
        onQuery("")
      }
    }

    document.removeEventListener('keydown', callback)

    return () => document.addEventListener('keydown', callback)
  }, [onQuery])

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => onQuery(e.target.value)}
      ref={inputEl}
    />
  )
}

function NumResults({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  )
}

function Main({ children }) {
  return (
    <main className="main">
      {children}
    </main>
  );
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen((open) => !open)}
      >
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  )
}

function MovieList({ movies, onSelectMovie }) {


  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie movie={movie} key={movie.imdbID} onSelectMovie={onSelectMovie} />
      ))}
    </ul>
  )
}

function Movie({ movie, onSelectMovie }) {

  return (
    <li onClick={() => onSelectMovie(movie.imdbID)}>
      {movie.Poster === 'N/A' ? <span>No picture</span> : <img src={movie.Poster} alt={`${movie.Title} poster`} />}
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  )
}

function MovieDetails({ selectedID, onCloseMovie, onAddWatched, watched }) {

  const [movie, setMovie] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [userRating, setUserRating] = useState(0)

  const watchedUserRating = watched.find(m => m.imdbID === selectedID)?.userRating
  const isWatched = watched.map(m => m.imdbID).includes(movie.imdbID)

  const countRef = useRef(0)

  function handleAdd() {

    const newMovie = {
      imdbID: movie.imdbID,
      Title: movie.Title,
      Poster: movie.Poster,
      imdbRating: Number(movie.imdbRating),
      Runtime: Number(movie.Runtime.split(' ')[0]),
      userRating,
      userRatingDecisions: countRef.current
    }

    onAddWatched(newMovie)
    onCloseMovie()
  }

  useEffect(() => {
    if (userRating) countRef.current++;
  }, [userRating])

  useKey("Escape", onCloseMovie)

  useEffect(() => {
    async function fetchMovieDetails() {
      try {
        setIsLoading(true)
        const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&i=${selectedID}`)
        const data = await res.json()
        setMovie(data)

      } catch (e) {

      }
      finally {
        setIsLoading(false)
      }
    }
    fetchMovieDetails()
  }, [selectedID])

  useEffect(() => {
    if (!movie.Title) return

    document.title = `Movie | ${movie.Title}`
    return () => { document.title = 'UsePopcorn' }
  }, [movie])

  return (
    <div className='details'>
      {isLoading ? <Loader /> :
        <>
          <header>
            <button className='btn-back' onClick={onCloseMovie}>&larr;</button>
            <img src={movie.Poster} alt={`Poster of ${movie.Title}`} />
            <div className='details-overview'>
              <h2>{movie.Title}</h2>
              <p> {movie.Released} &bull; {movie.Runtime}</p>
              <p>{movie.Genre}</p>
              <p><span>⭐</span>{movie.imdbRating} ImdbRating</p>
            </div>
          </header>

          <section>
            <div className='rating'>
              {!isWatched ? (
                <>
                  <StarRating maxRating={10} size={24} onSetRating={setUserRating} />
                  {userRating > 0 && <button className='btn-add' onClick={handleAdd}>+  Add to list</button>}
                </>
              ) : (
                <p>You rated this movie {watchedUserRating} ⭐</p>
              )
              }
            </div>
            <p><em>{movie.Plot}</em></p>
            <p>Starring {movie.Actors}</p>
            <p>Directed by {movie.Director}</p>
          </section>
        </>
      }
    </div>
  )
}

function WatchedMoviesList({ watched, onDeleteWatched, onSelectMovie}) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie movie={movie} key={movie.imdbID} onDeleteWatched={onDeleteWatched} onSelectMovie={onSelectMovie}/>
      ))}
    </ul>
  )
}

function WatchedMovie({ movie, onDeleteWatched, onSelectMovie }) {
  return (
    <li  onClick={() => onSelectMovie(movie.imdbID)} style={{cursor: 'pointer'}}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
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
          <span>{movie.Runtime} min</span>
        </p>
      </div>

      <button className='btn-delete' onClick={(e) => onDeleteWatched(e, movie.imdbID)}>X</button>
    </li>
  )
}

function WatchedSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.Runtime));


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
          <span>{avgImdbRating.toFixed(1)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(1)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime.toFixed(1)} min</span>
        </p>
      </div>
    </div>
  )
}
