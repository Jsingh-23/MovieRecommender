import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import { addComment, addRating } from '../services/api';
import { useAuth } from '../contexts/AuthContext'; // Make sure to import useAuth
import '../styles/moviepage.css';

const MoviePage = () => {
  const { movieId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const movie = location.state?.movie;
  const [loading, setLoading] = useState(false);
  const [movieData, setMovieData] = useState(null);
  const [commentText, setCommentText] = useState('');
  const { user } = useAuth();  // Get current user

  useEffect(() => {
    const initializeMovie = async () => {
        if (!movie) return;
        
        setLoading(true);
        try {
          const movieRef = doc(db, 'movies', movie.title);
          const movieDoc = await getDoc(movieRef);
          
          if (!movieDoc.exists()) {
            // Create the document with initial data
            await setDoc(movieRef, {
              title: movie.title,
              year: movie.year,
              genres: movie.genres,
              comments: [],
              ratings: [],
              averageRating: 0,
              totalRatings: 0,
              createdAt: new Date().toISOString()
            });
            setMovieData({
              comments: [],
              ratings: [],
              averageRating: 0,
              totalRatings: 0
            });
          } else {
            setMovieData(movieDoc.data());
          }
        } catch (error) {
          console.error('Error initializing movie:', error);
        } finally {
          setLoading(false);
        }
    };
      

    initializeMovie();
  }, [movieId, movie]);

  const handleAddRating = async (rating) => {
    if (!user) {
      alert('Please sign in to rate movies');
      return;
    }

    try {
      setLoading(true);
      await addRating(
        movie.title,
        user.uid,
        user.displayName || 'Anonymous',
        rating
      );

      // Refresh movie data after rating
      const movieRef = doc(db, 'movies', movie.title);
      const movieDoc = await getDoc(movieRef);
      setMovieData(movieDoc.data());
      
      alert('Rating added successfully!');
    } catch (error) {
      console.error('Error adding rating:', error);
      alert('Failed to add rating. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!user) {
      alert('Please sign in to comment');
      return;
    }

    if (!commentText.trim()) {
      alert('Please enter a comment');
      return;
    }

    try {
      setLoading(true);
      await addComment(
        movie.title,
        user.uid,
        user.displayName || 'Anonymous',
        commentText
      );

      // Refresh movie data after commenting
      console.log(movieId);
      const movieRef = doc(db, 'movies', movie.title);
      const movieDoc = await getDoc(movieRef);
      setMovieData(movieDoc.data());
      
      // Clear comment input
      setCommentText('');
      alert('Comment added successfully!');
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Failed to add comment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!movie) {
    navigate('/');
    return null;
  }

  if (loading) {
    return <div className="loading-container">Loading...</div>;
  }

  return (
    <div className="movie-page-container">
      <div className="movie-card">
        {/* Movie Header */}
        <div className="movie-header">
          <h1 className="movie-title">{movie.title}</h1>
          <div className="movie-meta">
            <span className="movie-year">{movie.year}</span>
            <span className="movie-genres">{movie.genres}</span>
          </div>
        </div>

        {/* Rating Section */}
        <div className="movie-section">
          <h2 className="section-title">Ratings</h2>
          <div className="rating-container">
            <div className="current-rating">
              <span className="rating-number">
                {movieData?.averageRating?.toFixed(1) || '0.0'}
              </span>
              <span className="rating-total">/{movieData?.totalRatings || 0} ratings</span>
            </div>
            <div className="rating-input">
              <h3>{user ? 'Rate this movie' : 'Sign in to rate'}</h3>
              <div className="star-rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    className="star-button"
                    onClick={() => handleAddRating(star)}
                    disabled={!user || loading}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="movie-section">
          <h2 className="section-title">Comments</h2>
          
          {/* Comment Input */}
          <div className="comment-input">
            <textarea
              placeholder={user ? "Add a comment..." : "Sign in to comment"}
              className="comment-textarea"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              disabled={!user || loading}
            />
            <button 
              className="comment-submit"
              onClick={handleAddComment}
              disabled={!user || loading || !commentText.trim()}
            >
              Post Comment
            </button>
          </div>

          {/* Comments List */}
          <div className="comments-list">
            {movieData?.comments?.length > 0 ? (
                movieData.comments.map((comment, index) => (
                <div key={index} className="comment">
                    <div className="comment-header">
                    <span className="comment-author">{comment.userName}</span>
                    <span className="comment-date">
                        {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                    </div>
                    <p className="comment-text">{comment.text}</p>
                </div>
                ))
            ) : (
                <p className="no-comments">No comments yet. Be the first to comment!</p>
            )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default MoviePage;