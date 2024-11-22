import { useAuth } from "../../contexts/AuthContext";
import { useState } from "react";
import { removeFromWatchHistory } from "../../services/api";
import "../../styles/list.css";
import MovieCard from "../../components/ui/MovieCard";
import { useWatchHistory } from "../../hooks";
import { useQueryClient } from "@tanstack/react-query";

const WatchHistoryPage = () => {
    const {user} = useAuth();
    const [error, setError] = useState(null);
    const {data: watchhistory} = useWatchHistory(user?.uid);

    const queryClient = useQueryClient();
    
    const handleRemoveFromWatchHistory = async(movieId) => {
        if (!user) return;

        try {
            await removeFromWatchHistory(user.uid, movieId);
            queryClient.setQueryData(['watchhistory', user.uid], (oldData) => 
                oldData.filter(movie => movie.id !== movieId));
        } catch (error) {
            setError("Failed to remove movie from watch history: ", error);
            console.error(error);
        } 
    }

// Useeffect no longer needed because react query handles data fetching on component mount
// and refetches data when user.uid changes. 
// Also handles loading and error states and manages cache updates
    // useEffect(() => {
    //     getWatchHistoryData();
    // }, [user]);

    return (
        <div className="movies-grid">
            {watchhistory?.map((movie, index) => (
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