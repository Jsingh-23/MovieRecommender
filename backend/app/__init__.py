from flask import Flask
from flask_cors import CORS
from config import Config

## Create and configure Flask application
def create_app():
    app = Flask(__name__)
    ## CORS to let React frontend talk to Flask backend
    CORS(app)
    app.config.from_object(Config)

    ## Initialize the recommender model
    from models.recommender import RecommenderModelMovies ## Import my model
    ## Create an instance of my model and attach it to the app so I can use the model in my routes
    app.recommender = RecommenderModelMovies( 
        movies_path="data/movies.csv",
        ratings_path="data/ratings.csv"
    )

    ## Register routes
    ## Import my routes (API endpoints) --> Register them with app --> Return the configured app
    from app.routes import bp
    app.register_blueprint(bp)

    return app


# Real-world analogy:
# Think of __init__.py like setting up a new store:


# You get your building (Flask)
# Install security systems (CORS)
# Set up your inventory system (recommender model)
# Put up signs showing where everything is (routes)
# Open for business (return app)