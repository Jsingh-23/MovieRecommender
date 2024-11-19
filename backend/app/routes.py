from flask import Blueprint, jsonify, request, current_app

# Blueprint is like a container for routes
# jsonify converts Python objects to JSON for the frontend
# request lets us get data from incoming requests
# current_app gives access to our Flask app

## Create a Blueprint named "main"
## Essentially creates a section for my API
bp = Blueprint('main', __name__)

@bp.route('/api/search', methods=['GET'])
def search_movies():
    ## Get the search term from URL
    query = request.args.get('query', '')

    ## If no search term, return error
    # if not query:
    #     return jsonify({'error': 'No query provided'}), 400
    # print("python, ", query)
    if not query:
        return jsonify({'movies': []})
        
    try:
        results = current_app.recommender.search_by_title(query)
        movies = results['clean_title'].to_list()
        return jsonify({'movies': movies})
        # return jsonify({
        #     'movies': results['clean_title'].tolist()
        # })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Real-world analogy:

# Think of this like a store clerk who:
# Hears your request for a movie
# Checks if you actually said a movie name
# Looks through the inventory
# Returns a list of matching movies
# If something goes wrong, explains the error

@bp.route('/api/recommend', methods=['GET'])
def get_recommendations():
    ## Get movie title from URL
    movie_title = request.args.get('title', '')
    if not movie_title:
        return jsonify({'error': 'No movie title provided'}), 400
        
    try:
        candidates, recommendations = current_app.recommender.get_recommendations(movie_title)
        return jsonify({
            'recommendations': recommendations.to_dict('records')
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Real-world analogy:

# Like a store clerk who:
# Takes a movie you like
# Goes through their knowledge
# Returns a list of similar movies you might enjoy
# If something goes wrong, explains the error