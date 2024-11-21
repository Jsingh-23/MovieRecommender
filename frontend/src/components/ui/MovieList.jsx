import { useAuth } from "../../contexts/AuthContext";
import { addToWatchlist } from "../../services/api";
import MovieCard from "./MovieCard";
import "../../styles/list.css";

export default function MovieList({ movies }) {
    const {user} = useAuth();
    
    if (!movies?.length) return null;
    // console.log(movies);
    // console.log(typeof movies);

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
          <MovieCard
            key={index}
            movie={movie}
            user={user}
            isMovieList={true}
            buttons={[
              {
                type: 'addToWatchlist',
                onClick: () => handleAddToWatchlist(movie)
              },
            ]}
          />
        ))}
      </div>
    );
};