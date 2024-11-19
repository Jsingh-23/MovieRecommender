import { useAuth } from "../../contexts/AuthContext";
import { useState, useEffect } from "react";
import { getWatchlist, removeFromWatchlist } from "../../services/api";
// import "frontend\src\styles\list.css";
import "../../styles/list.css";
// import "../../styles/list.css";

const WatchlistPage = () => {
    const {user} = useAuth();
    const [watchlist, setWatchlist] = useState([]);
    const [loading, setLoading] = useState(null);
    const [error, setError] = useState(null);
    const [deleting, setDeleting] = useState(null);
    
    const getWatchlistData = async() => {
        if (!user) return;
        setLoading(true);
        setError(null);

        try {
            const data = await getWatchlist(user.uid);
            setWatchlist(data);
            console.log(typeof watchlist);
            console.log(watchlist);
        } catch(error) {
            setError("Failed to load watchlist");
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

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
            // Update the wachlist to remove the movie you just deleted
            setWatchlist(prev => prev.filter(movie => movie.id !== movieId));
        }
    }

    useEffect(() => {
        getWatchlistData();
    }, [user]);

    return (
        <div className="movies-grid">
            {console.log("in div: ", watchlist)}
            {watchlist.map((movie, index) => (
                <div
                    key={index}
                    className="movie-card"
                >
                    <h3 className="movie-title">
                        {movie.title}
                    </h3>
                    {/* <p>
                        id: {movie.id};
                    </p> */}
                    <p className="movie-year">
                        Year: {movie.year}
                    </p>
                    <p className="movie-genres">
                        {movie.genres}
                    </p>
                    <button
                        className="remove-button"
                        onClick={() => handleRemoveFromWatchlist(movie.id)}>
                        Remove
                    </button>
                </div>
            ))}
        </div>
    );
}

export default WatchlistPage;