import axios from 'axios';
import { db } from '../config/firebase';
import { 
    collection, 
    addDoc, 
    deleteDoc,
    doc,
    serverTimestamp,
    getDocs,
    query,
    orderBy, 
  } from "firebase/firestore";


const API_URL = 'http://localhost:5000/api';

export const searchMovies = async (query) => {
  try {
    const response = await axios.get(`${API_URL}/search?query=${encodeURIComponent(query)}`);
    return response.data.movies;
  } catch (error) {
    console.error('Error searching movies:', error);
    throw error;
  }
};

export const getRecommendations = async (title) => {
  try {
    const response = await axios.get(`${API_URL}/recommend?title=${encodeURIComponent(title)}`);
    return response.data.recommendations;
  } catch (error) {
    console.error('Error getting recommendations:', error);
    throw error;
  }
};

export const addToWatchlist = async(userId, movie) => {
  if (!userId) throw new Error('User ID is required');

  try {
    const watchlistRef = collection(db, 'users', userId, 'watchlist');
    return await addDoc(watchlistRef, {
      title: movie.title.substring(0,movie.title.length-4),
      year: movie.title.slice(-4),
      genres: movie.genres,
      addedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error adding to watchlist: ", error);
    throw error;
  }
}

export const removeFromWatchlist = async(userId, movieId) => {
  if (!userId || !movieId) throw new Error('User ID and Movie ID are required');

  try {
    const movieRef = doc(db, 'users', userId, 'watchlist', movieId);
    return await deleteDoc(movieRef);
  } catch (error) {
    console.error("Error removing movie from watchlist: ", error);
    throw error;
  }
}

export const getWatchlist = async(userId) => {
  if (!userId) throw new Error('User ID is required');

  try {
    const watchlistRef = collection(db, 'users', userId, 'watchlist');
    const q = query(watchlistRef, orderBy('addedAt', 'desc'));

    const snapshot = await getDocs(q);
    const watchlist = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      addedAt: doc.data().addedAt?.toDate(),
    }));

    return watchlist;
  } catch (error) {
    console.error("Error getting watchlist: ", error);
    throw error;
  }
}

export const addToWatchHistory = async(userId, movie) => {
  if (!userId) throw new Error('User ID is required');
  console.log("api: ", movie);

  try {
    const watchHistoryRef = collection(db, 'users', userId, 'watchhistory');
    return await addDoc(watchHistoryRef, {
      title: movie.title,
      year: movie.year,
      genres: movie.genres,
      addedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error adding to watch history: ", error);
    throw error;
  }  
}

export const removeFromWatchHistory = async(userId, movieId) => {
  if (!userId || !movieId) throw new Error('User ID and Movie ID are required');

  try {
    const movieRef = doc(db, 'users', userId, 'watchhistory', movieId);
    return await deleteDoc(movieRef);
  } catch (error) {
    console.error("Error removing movie from watchhistory: ", error);
    throw error;
  }
}

export const getWatchHistory = async(userId) => {
  if (!userId) throw new Error('User ID is required');

  try {
    const watchHistoryRef = collection(db, 'users', userId, 'watchhistory');
    const q = query(watchHistoryRef, orderBy('addedAt', 'desc'));

    const snapshot = await getDocs(q);
    const watchhistory = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      addedAt: doc.data().addedAt?.toDate(),
    }));

    return watchhistory;
  } catch (error) {
    console.error("Error getting watchhistory: ", error);
    throw error;
  }
}