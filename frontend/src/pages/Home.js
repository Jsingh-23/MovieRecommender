import { useState } from 'react';
import SearchBar from '../components/ui/SearchBar';
import MovieList from '../components/ui/MovieList';
import { getRecommendations } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

function Home() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const {user} = useAuth();

  const handleSearch = async (selectedMovie) => {
    try {
      setLoading(true);
      setError(null);
      const recs = await getRecommendations(selectedMovie);
      setRecommendations(recs);
    } catch (err) {
      setError('Failed to get recommendations. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };



  return (
    <div>
      {/* Hero section with background image */}
      <div className="backdrop-container">
        <div className="image-container">
          <div className='image-wrapper'>
            <img
              src="/gladiator_backdrop.png"
              alt="Gladiator image"
              id="gladiator_image"
            />
          </div>
        </div>
        
        <div className="content-container">
          <h2 className="headline-1">
            Track films you've watched<br />
            Save those you want to see<br />
            Find new suggestions
          </h2>
          
          <SearchBar onSearch={handleSearch} />
          
          {loading && <p className="text-center mt-8">Loading recommendations...</p>}
          {error && <p className="text-center mt-8 text-red-600">{error}</p>}
        </div>
      </div>
      
      {/* Movie List */}
      <MovieList movies={recommendations} />
    </div>
  );
}

export default Home;