import { useAuth } from "../../contexts/AuthContext";
import { useState, useEffect } from "react";
import { getWatchHistory, removeFromWatchHistory } from "../../services/api";
import "../../styles/list.css";
import MovieCard from "../../components/ui/MovieCard";

const WatchHistoryPage = () => {
    const {user} = useAuth();
    const [watchHistoryList, setWatchHistoryList] = useState([]);
    const [loading, setLoading] = useState(null);
    const [error, setError] = useState(null);
    const [deleting, setDeleting] = useState(null);

    const getWatchHistoryData = async() => {
        if (!user) return;
        setLoading(true);
        setError(null);

        try {
            const data = await getWatchHistory(user.uid);
            setWatchHistoryList(data);
        } catch (error) {
            setError("Failed to load watch history");
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const handleRemoveFromWatchHistory = async(movieId) => {
        if (!user) return;
        setLoading(true);
        setError(null);

        try {
            await removeFromWatchHistory(user.uid, movieId);
        } catch (error) {
            setError("Failed to remove movie from watch history: ", error);
            console.error(error);
        } finally {
            setLoading(false);
            setWatchHistoryList(prev => prev.filter(movie => movie.id !==  movieId));
        }
    }

    console.log("history: ", watchHistoryList);

    useEffect(() => {
        getWatchHistoryData();
    }, [user]);

    return (
        <div className="movies-grid">
            {watchHistoryList.map((movie, index) => (
                <MovieCard
                    key={index}
                    movie={movie}
                    user={user}
                    buttons={[
                        {
                          type: 'removeFromHistory',
                          onClick: () => handleRemoveFromWatchHistory(movie.id)
                        },
                      ]}
                />
            ))}
        </div>
    )
}

export default WatchHistoryPage;