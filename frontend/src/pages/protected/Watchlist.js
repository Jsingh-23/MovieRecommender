import { useAuth } from "../../contexts/AuthContext";
import { useState } from "react";
import { removeFromWatchlist, addToWatchHistory } from "../../services/api";
import "../../styles/list.css";
import MovieCard from "../../components/ui/MovieCard";
import { useWatchlist } from "../../hooks";
import { useQueryClient } from "@tanstack/react-query";

const WatchlistPage = () => {
    const {user} = useAuth();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const {data: watchlist} = useWatchlist(user?.uid)

    console.log("watchlist: ", watchlist);

    const queryClient = useQueryClient();

    const handleRemoveFromWatchlist = async(movieId) => {
        if (!user) return;

        try {
            await removeFromWatchlist(user.uid, movieId);
            queryClient.setQueryData(['watchlist', user.uid], (oldData) => // update cache with the movie removed
                oldData.filter(movie => movie.id !== movieId));
        } catch (error) {
            setError("Failed to remove movie from watchlist: ", error);
            console.error(error);
        } 
    }

    const handleAddToWatchHistory = async(movieId) => {
        if (!user) return;
        setError(null);
        setLoading(true);
        try {
            await addToWatchHistory(user.uid, movieId);
            // queryClient.setQueryData
        } catch (error) {
            setError("Failed to add movie to watch history: ", error);
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    // useEffect(() => {
    //     getWatchlistData();
    // }, [user]);

    return (
        <div className="movies-grid">
          {watchlist?.map((movie, index) => (
            <MovieCard
              key={index}
              movie={movie}
              user={user}
              buttons={[
                {
                  type: 'removeFromWatchlist',
                  onClick: () => handleRemoveFromWatchlist(movie.id)
                },
                {
                  type: 'addToHistory',
                  onClick: () => handleAddToWatchHistory(movie)
                }
              ]}
            />
          ))}
        </div>
      );
}

export default WatchlistPage;