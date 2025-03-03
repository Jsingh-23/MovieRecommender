import { useQuery } from "@tanstack/react-query";
import { getWatchlist, getWatchHistory } from "../services/api";

export const useWatchlist = (userId) => {
    return useQuery({
        queryKey: ['watchlist', userId], // unique identifier for cache entry. Used to cache and retrieve data
        queryFn: () => getWatchlist(userId), // function that fetches data. gets called when cache is empty or stale
        enabled: !!userId, // only run the query if userId exists
        staleTime: 5 * 60 * 1000, // data is considered fresh for 5 minutes
        cacheTime: 30 * 60 * 1000 // inactive data is stored in cache for 30 minutes
    })
}
// Cached response for more responsiveness
export const useWatchHistory = (userId) => {
    return useQuery({
        queryKey: ['watchhistory', userId],
        queryFn: () => getWatchHistory(userId),
        enabled: !!userId,
        staleTime: 5 * 60 * 1000,
        cacheTime: 30 * 60 * 1000
    })
}