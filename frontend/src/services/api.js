import axios from 'axios';
import { db } from '../config/firebase';
import { 
    collection, 
    addDoc, 
    deleteDoc,
    doc,
    serverTimestamp,
    getDocs,
    setDoc,
    query,
    orderBy,
    updateDoc,
    getDoc,
    arrayUnion,
    arrayRemove
} from "firebase/firestore";

const API_URL = 'http://localhost:5000/api';

// Existing functions
export const searchMovies = (query) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/search?query=${encodeURIComponent(query)}`) // Make axios GET request
      .then(response => { 
        if (response.data && response.data.movies) { // if succesful, checks if response has expected data
          resolve(response.data.movies);
        } else { 
          reject(new Error('Invalid response format'));
        }
      })
      .catch(error => {
        console.error('Error searching movies:', error);
        reject(error);
      });
  });
};

export const getRecommendations = (title) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/recommend?title=${encodeURIComponent(title)}`)
      .then(response => {
        if (response.data && response.data.recommendations) {
          resolve(response.data.recommendations);
        } else {
          reject(new Error('No recommendations found'));
        }
      })
      .catch(error => {
        console.error('Error getting recommendations:', error);
        reject(error);
      });
  });
};

// Watchlist functions
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

// Watch History functions
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

// New Movie Rating and Comments functions
export const initializeMovie = async (movie) => {
  if (!movie) throw new Error('Movie data is required');

  try {
    const movieRef = doc(db, 'movies', movie.title);
    const movieDoc = await getDoc(movieRef);

    if (!movieDoc.exists()) {
      await updateDoc(movieRef, {
        title: movie.title,
        year: movie.year,
        genres: movie.genres,
        comments: [],
        ratings: [],
        averageRating: 0,
        totalRatings: 0,
        createdAt: serverTimestamp()
      });
    }
    return movieRef;
  } catch (error) {
    console.error('Error initializing movie:', error);
    throw error;
  }
};

export const addComment = async (movieTitle, userId, userName, text) => {
  if (!movieTitle || !userId || !text) throw new Error('Movie title, user ID, and comment text are required');

  try {
    const movieRef = doc(db, 'movies', movieTitle);
    const movieDoc = await getDoc(movieRef);

    const newComment = {
      id: Date.now().toString(),
      userId,
      userName,
      text,
      createdAt: new Date().toISOString()
    };

    if (!movieDoc.exists()) {
      // Create the document if it doesn't exist
      await setDoc(movieRef, {
        title: movieTitle,
        comments: [newComment],
        ratings: [],
        averageRating: 0,
        totalRatings: 0,
        createdAt: new Date().toISOString()
      });
    } else {
      // Update existing document
      await updateDoc(movieRef, {
        comments: arrayUnion(newComment)
      });
    }

    return newComment;
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};

export const addRating = async (movieTitle, userId, userName, rating) => {
  if (!movieTitle || !userId || !rating) throw new Error('Movie title, user ID, and rating are required');

  try {
    const movieRef = doc(db, 'movies', movieTitle);
    const movieDoc = await getDoc(movieRef);

    const newRating = {
      userId,
      userName,
      rating,
      createdAt: new Date().toISOString()
    };

    if (!movieDoc.exists()) {
      // Create the document if it doesn't exist
      await setDoc(movieRef, {
        title: movieTitle,
        ratings: [newRating],
        comments: [],
        averageRating: rating,
        totalRatings: 1,
        createdAt: new Date().toISOString()
      });
    } else {
      const movieData = movieDoc.data();
      // Remove existing rating if it exists
      const existingRating = movieData.ratings.find(r => r.userId === userId);
      if (existingRating) {
        await updateDoc(movieRef, {
          ratings: arrayRemove(existingRating)
        });
      }

      await updateDoc(movieRef, {
        ratings: arrayUnion(newRating)
      });

      // Update average rating
      const updatedDoc = await getDoc(movieRef);
      const ratings = updatedDoc.data().ratings;
      const averageRating = ratings.reduce((acc, r) => acc + r.rating, 0) / ratings.length;

      await updateDoc(movieRef, {
        averageRating,
        totalRatings: ratings.length
      });
    }

    return newRating;
  } catch (error) {
    console.error('Error adding rating:', error);
    throw error;
  }
};

export const removeComment = async (movieTitle, commentId, userId) => {
  if (!movieTitle || !commentId || !userId) throw new Error('Movie title, comment ID, and user ID are required');

  try {
    const movieRef = doc(db, 'movies', movieTitle);
    const movieDoc = await getDoc(movieRef);
    const comment = movieDoc.data().comments.find(c => c.id === commentId && c.userId === userId);

    if (comment) {
      await updateDoc(movieRef, {
        comments: arrayRemove(comment)
      });
    }
  } catch (error) {
    console.error('Error removing comment:', error);
    throw error;
  }
};

export const getMovieDetails = async (movieTitle) => {
  if (!movieTitle) throw new Error('Movie title is required');

  try {
    const movieRef = doc(db, 'movies', movieTitle);
    const movieDoc = await getDoc(movieRef);

    if (!movieDoc.exists()) {
      return null;
    }

    return {
      ...movieDoc.data(),
      id: movieDoc.id
    };
  } catch (error) {
    console.error('Error getting movie details:', error);
    throw error;
  }
};