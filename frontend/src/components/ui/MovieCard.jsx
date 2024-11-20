import React from 'react';
import PropTypes from 'prop-types';
import "../../styles/moviecard.css";

const MovieCard = ({ 
  movie, 
  user, 
  buttons,
  isMovieList = false, 
}) => {
  // Only format title and year if component is rendered in MovieList
  const title = isMovieList 
    ? movie.title.substring(0, movie.title.length - 4)
    : movie.title;
    
  const year = isMovieList 
    ? movie.title.slice(-4)
    : movie.year;

  const buttonConfig = {
    addToWatchlist: {
      text: "Add to Watchlist",
      className: "watchlist-button"
    },
    removeFromWatchlist: {
      text: "Remove from Watchlist",
      className: "remove-button"
    },
    addToHistory: {
      text: "Add to Watch History",
      className: "history-button"
    },
    removeFromHistory: {
        text:"Remove from Watch History",
        className:"remove-button"
    }
  };

  const renderButton = (buttonType, onClick) => {
    const config = buttonConfig[buttonType];
    if (!config) return null;

    return (
      <button
        className={config.className}
        onClick={onClick}
      >
        {config.text}
      </button>
    );
  };

  return (
    <div className="movie-card">
      <h3 className="movie-title">{title}</h3>
      <p className="movie-year">Year: {year}</p>
      <p className="movie-genres">{movie.genres}</p>
      {user && buttons && (
        <div className="button-container">
          {buttons.map((button, index) => (
            renderButton(button.type, button.onClick)
          ))}
        </div>
      )}
    </div>
  );
};

MovieCard.propTypes = {
  movie: PropTypes.shape({
    title: PropTypes.string.isRequired,
    genres: PropTypes.string.isRequired
  }).isRequired,
  user: PropTypes.object,
  buttons: PropTypes.arrayOf(PropTypes.shape({
    type: PropTypes.oneOf([
        'addToWatchlist', 
        'removeFromWatchlist', 
        'addToHistory',
        'removeFromHistory'
    ]).isRequired,
    onClick: PropTypes.func.isRequired
  })),
  isMovieList: PropTypes.bool 
};

export default MovieCard;