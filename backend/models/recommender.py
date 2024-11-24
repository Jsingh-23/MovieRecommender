import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import re
from threading import Lock

print(sklearn)

class SingletonMeta(type):
    _instances = {} # Dictionary to store singleton instances
    _lock = Lock() # Thread Lock for lock safety

    def __call__(cls, *args, **kwargs):
        with cls._lock: ## Uses a context manager to acquire and release the lock
            if cls not in cls._instances:
                instance = super().__call__(*args, **kwargs)
                cls._instances[cls] = instance
            return cls._instances[cls]



class RecommenderModelMovies:
    def __init__(self, movies_path, ratings_path):
        """
        Initialize the movie recommender model
        
        Args:
            movies_path (str): Path to the movies CSV file
            ratings_path (str): Path to the ratings CSV file
        """
        # Check if model has already been initialized
        # Prevents reloading of data
        if hasattr(self, 'movies_df'):
            return

        self.movies_path = movies_path
        self.ratings_path = ratings_path
        self.load_data()
        self.process_data()
        self.create_vectorizers()

    def clean_title(self, title):
        """Clean movie title by removing special characters"""
        return re.sub("[^a-zA-Z0-9 ]", "", title)

    def load_data(self):
        """Load movies and ratings data from CSV files"""
        print("Loading data...")
        self.movies_df = pd.read_csv(self.movies_path)
        self.ratings_df = pd.read_csv(self.ratings_path)
        
        # Process movies data
        self.movies_df['genres_list'] = self.movies_df['genres'].str.replace('|', ' ')
        self.movies_df['clean_title'] = self.movies_df['title'].apply(self.clean_title)
        self.movies_data = self.movies_df[['movieId', 'clean_title', 'genres_list']]
        
        # Process ratings data
        self.ratings_data = self.ratings_df.drop(['timestamp'], axis=1)
        self.combined_data = self.ratings_data.merge(self.movies_data, on='movieId')
        print(f"Loaded {len(self.movies_df)} movies and {len(self.ratings_df)} ratings")

    def process_data(self):
        """Process the loaded data and create necessary mappings"""
        print("Processing data...")
        self.movie_to_idx = {}
        self.idx_to_movie = {}
        self.movie_id_to_idx = {}
        
        for idx, (movie_id, title) in enumerate(zip(self.movies_df['movieId'], self.movies_df['clean_title'])):
            self.movie_to_idx[title] = idx
            self.idx_to_movie[idx] = title
            self.movie_id_to_idx[str(movie_id)] = idx

    def create_vectorizers(self):
        """Create and fit TF-IDF vectorizers for titles and genres"""
        print("Creating vectorizers...")
        # Title vectorizer
        self.vectorizer_title = TfidfVectorizer(ngram_range=(1,2))
        self.tfidf_title = self.vectorizer_title.fit_transform(self.movies_data['clean_title'])
        
        # Genre vectorizer
        self.vectorizer_genres = TfidfVectorizer(ngram_range=(1,2))
        self.tfidf_genres = self.vectorizer_genres.fit_transform(self.movies_data['genres_list'])

    def search_by_title(self, title, n_results=5):
        """
        Search for movies by title
        
        Args:
            title (str): Movie title to search for
            n_results (int): Number of results to return
        
        Returns:
            pd.DataFrame: Matching movies
        """
        title = self.clean_title(title)
        query_vec = self.vectorizer_title.transform([title])
        similarity = cosine_similarity(query_vec, self.tfidf_title).flatten()
        indices = np.argpartition(similarity, -n_results)[-n_results:]
        results = self.movies_data.iloc[indices][::-1]
        return results

    def search_similar_genres(self, genres, n_results=10):
        """
        Search for movies with similar genres
        
        Args:
            genres (str): Genre string to search for
            n_results (int): Number of results to return
        
        Returns:
            pd.DataFrame: Movies with similar genres
        """
        query_vec = self.vectorizer_genres.transform([genres])
        similarity = cosine_similarity(query_vec, self.tfidf_genres).flatten()
        indices = np.argpartition(similarity, -n_results)[-n_results:]
        results = self.movies_data.iloc[indices][::-1]
        return results

    def calculate_scores(self, movie_id):
        """
        Calculate recommendation scores for a given movie
        
        Args:
            movie_id (int): ID of the movie to get recommendations for
        
        Returns:
            pd.DataFrame: Scored recommendations
        """
        # Find users who liked the same movie
        # Finds users who rated the target movie highly (4 stars or above)
        # These are considered similar users because they liked the same movie
        similar_users = self.combined_data[
            (self.combined_data['movieId'] == movie_id) & 
            (self.combined_data['rating'] >= 4)
        ]['userId'].unique()
        
        # Get recommendations from similar users
        # Looks at all movies these similar users  rated highly 
        # Calculate the percentage of similar users who liked each movie
        similar_user_recs = self.combined_data[
            (self.combined_data['userId'].isin(similar_users)) & 
            (self.combined_data['rating'] >= 4)
        ]['movieId']
        similar_user_recs = similar_user_recs.value_counts() / len(similar_users)
        
        # Get recommendations from all users
        # Calculate how popular these movies are among all users
        # This is to help normalize the recommendations
        all_users = self.combined_data[
            (self.combined_data['movieId'].isin(similar_user_recs.index)) & 
            (self.combined_data['rating'] >= 4)
        ]
        all_users_recs = all_users['movieId'].value_counts() / all_users['userId'].nunique()
        
        # Get genres of selected movie and find similar movies
        # Gets the genre of the target movie and find movie with similar genres
        genres = self.combined_data[self.combined_data['movieId'] == movie_id]['genres_list'].unique()
        genres = np.array2string(genres)
        movies_with_similar_genres = self.search_similar_genres(genres)
        
        # Boost scores for movies with similar genres
        # x1.5 for similar users recommendations and x0.9 for general popularity
        similar_genre_indices = movies_with_similar_genres[
            movies_with_similar_genres['movieId'].isin(similar_user_recs.index)
        ]['movieId']
        similar_user_recs.loc[similar_genre_indices] *= 1.5
        
        all_genre_indices = movies_with_similar_genres[
            movies_with_similar_genres['movieId'].isin(all_users_recs.index)
        ]['movieId']
        all_users_recs.loc[all_genre_indices] *= 0.9
        
        # Calculate final scores
        # Combine metrics into a final score
        # Score is (popularity among similar users) / (overall popularity)
        # Higher score means movie is more popular among similar users, compared to the general population
        rec_percentages = pd.concat([similar_user_recs, all_users_recs], axis=1)
        rec_percentages.columns = ['similar', 'all']
        rec_percentages['score'] = rec_percentages['similar'] / rec_percentages['all']
        
        return rec_percentages.sort_values('score', ascending=False)

    def get_recommendations(self, title, title_index=0, n_recommendations=10):
        """
        Get movie recommendations based on a title
        
        Args:
            title (str): Movie title to get recommendations for
            title_index (int): Index of the movie if multiple matches exist
            n_recommendations (int): Number of recommendations to return
        
        Returns:
            tuple: (title candidates, recommendations DataFrame)
        """
        # Find matching titles
        title_candidates = self.search_by_title(title)
        if title_candidates.empty:
            return title_candidates, pd.DataFrame()
        
        # Get recommendations
        movie_id = title_candidates.iloc[title_index]['movieId']
        scores = self.calculate_scores(movie_id)
        
        # Format results
        results = scores.head(n_recommendations).merge(
            self.movies_data, 
            left_index=True, 
            right_on='movieId'
        )[['clean_title', 'score', 'genres_list']]
        
        results = results.rename(columns={
            'clean_title': 'title',
            'genres_list': 'genres'
        })
        
        return title_candidates, results

    def print_recommendations(self, title, n_candidates=5):
        """
        Print movie recommendations in a user-friendly format
        
        Args:
            title (str): Movie title to get recommendations for
            n_candidates (int): Number of title candidates to show
        """
        candidates, recommendations = self.get_recommendations(title)
        
        print("Are you looking for (please choose a number):")
        for i in range(min(n_candidates, len(candidates))):
            print(f"{i}: {candidates['clean_title'].iloc[i]}")
        
        if not recommendations.empty:
            print("\nWe have the following recommendations:")
            print(recommendations.to_string(index=False))
        else:
            print("\nNo recommendations found.")
