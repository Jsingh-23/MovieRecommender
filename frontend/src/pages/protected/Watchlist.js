import { useAuth } from "../../contexts/AuthContext";
import { useState, useEffect } from "react";
import { getWatchlist, removeFromWatchlist, addToWatchHistory } from "../../services/api";
import "../../styles/list.css";
import MovieCard from "../../components/ui/MovieCard";
import { useWatchlist } from "../../hooks";
import { useQueryClient } from "@tanstack/react-query";

const WatchlistPage = () => {
    const {user} = useAuth();
    // const [watchlist, setWatchlist] = useState([]);
    const [loading, setLoading] = useState(null);
    const [error, setError] = useState(null);
    const [deleting, setDeleting] = useState(null);
    const {data: watchlist} = useWatchlist(user?.uid)

    const queryClient = useQueryClient();

    console.log("watchlist: ", watchlist);
    
    // const getWatchlistData = async() => {
    //     if (!user) return;
    //     setLoading(true);
    //     setError(null);

    //     try {
    //         const data = await getWatchlist(user.uid);
    //         setWatchlist(data);
    //     } catch(error) {
    //         setError("Failed to load watchlist");
    //         console.error(error);
    //     } finally {
    //         setLoading(false);
    //     }
    // }

    const handleRemoveFromWatchlist = async(movieId) => {
        if (!user) return;
        setLoading(true);
        setError(null);

        try {
            await removeFromWatchlist(user.uid, movieId);
        } catch (error) {
            setError("Failed to remove movie from watchlist: ", error);
            console.error(error);
        } finally {
            setLoading(false);
            queryClient.setQueryData(['watchlist', user.uid], (oldData) => // update cache with the movie removed
                oldData.filter(movie => movie.id !== movieId));
        }
    }

    // const handleAddToWatchHistory = async(movieId) => {
    //     if (!user) return;
    //     setError(null);
    //     setLoading(true);
    //     try {
    //         await addToWatchHistory(user.uid, movieId);
    //     } catch (error) {
    //         setError("Failed to add movie to watch history: ", error);
    //         console.error(error);
    //     } finally {
    //         setLoading(false);
    //     }
    // }

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
                //   onClick: () => handleAddToWatchHistory(movie)
                }
              ]}
            />
          ))}
        </div>
      );
}

export default WatchlistPage;