from flask import Flask
from flask_cors import CORS
from config import Config
import logging
from logging.handlers import RotatingFileHandler
import os
from models.recommender import RecommenderModelMovies

def create_app(config_class=Config):
    """
    Flask application factory with proper error handling and logging
    
    Args:
        config_class: Configuration class (defaults to Config)
    Returns:
        Flask application instance
    """
    # Initialize Flask
    app = Flask(__name__)
    
    # Load configuration
    app.config.from_object(config_class)
    
    # Configure CORS
    CORS(app, resources={
        r"/*": {
            "origins": app.config.get('ALLOWED_ORIGINS', '*'),
            "methods": ["GET", "POST", "OPTIONS"],
            "allow_headers": ["Content-Type"]
        }
    })
    
    # Initialize the recommender model (singleton pattern ensures one instance)
    try:
        app.recommender = RecommenderModelMovies(
            movies_path=app.config.get('MOVIES_PATH', "data/movies.csv"),
            ratings_path=app.config.get('RATINGS_PATH', "data/ratings.csv")
        )
        app.logger.info("Recommender model initialized successfully")
    except Exception as e:
        app.logger.error(f"Failed to initialize recommender model: {str(e)}")
        raise RuntimeError("Failed to initialize critical application component")

    # Register blueprints
    try:
        from app.routes import bp
        app.register_blueprint(bp)
        app.logger.info("Routes registered successfully")
    except Exception as e:
        app.logger.error(f"Failed to register routes: {str(e)}")
        raise RuntimeError("Failed to register application routes")

    # Configure logging
    if not app.debug and not app.testing:
        # Ensure log directory exists
        if not os.path.exists('logs'):
            os.mkdir('logs')
            
        # Create file handler
        file_handler = RotatingFileHandler(
            'logs/movie_recommender.log',
            maxBytes=10240000,
            backupCount=10
        )
        
        # Set log format
        file_handler.setFormatter(logging.Formatter(
            '%(asctime)s %(levelname)s: %(message)s '
            '[in %(pathname)s:%(lineno)d]'
        ))
        
        # Set log level
        file_handler.setLevel(logging.INFO)
        app.logger.addHandler(file_handler)
        
        app.logger.setLevel(logging.INFO)
        app.logger.info('Movie Recommender startup')

    return app


# Real-world analogy:
# Think of __init__.py like setting up a new store:


# You get your building (Flask)
# Install security systems (CORS)
# Set up your inventory system (recommender model)
# Put up signs showing where everything is (routes)
# Open for business (return app)