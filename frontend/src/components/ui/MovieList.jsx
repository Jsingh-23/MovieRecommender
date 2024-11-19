import { useAuth } from "../../contexts/AuthContext";
import { addToWatchlist } from "../../services/api";
import "../../styles/list.css";

export default function MovieList({ movies }) {
    const {user} = useAuth();
    
    if (!movies?.length) return null;
    console.log(movies);
    console.log(typeof movies);

    const handleAddToWatchlist = async (movie) => {
      if (!user) {
        return;
      }

      try {
        await addToWatchlist(user.uid, movie);
        alert("Added to watchlist!");
      } catch(error) {
        console.error("Error adding to watchlist: " + error);
        alert("Failed to add to watchlist. Please try again!");
      }
    }
  
    return (
      <div className="movies-grid">
        {movies.map((movie, index) => (
          <div
            key={index}
            className="movie-card"
          >
            <h3 className="movie-title">
              {movie.title.substring(0,movie.title.length-4)}
            </h3>
            <p className="movie-year">
              Year: {(movie.title.slice(-4))}
            </p>
            <p className="movie-genres">
              {movie.genres}
            </p>
            {user && (
              <button
                className="watchlist-button"
                onClick={() => handleAddToWatchlist(movie)}>
                Add to watchlist
              </button>
            )}
          </div>
        ))}
      </div>
    );
  };