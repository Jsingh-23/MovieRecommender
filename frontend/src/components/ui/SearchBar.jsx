import { useState, useEffect } from 'react';
import { searchMovies } from '../../services/api';

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // Debounce search to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim()) {
        setIsLoading(true);
        try {
          const results = await searchMovies(query);
          setSuggestions(results);
          setShowDropdown(true);
        } catch (error) {
          console.error('Error fetching suggestions:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setSuggestions([]);
        setShowDropdown(false);
      }
    }, 500); // Wait 500ms after user stops typing

    return () => clearTimeout(timer);
  }, [query]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
      setShowDropdown(false);
    }
  };

  const handleSuggestionClick = (movie) => {
    setQuery(movie);
    onSearch(movie);
    setShowDropdown(false);
  };

  return (
    <div className="relative max-w-xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.trim() && setShowDropdown(true)}
            placeholder="Enter a movie title..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-6 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700"
          >
            Search
          </button>
        </div>
      </form>

      {/* Dropdown suggestions */}
      {showDropdown && suggestions.length > 0 && (
        <div 
          className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-auto"
        >
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">Loading...</div>
          ) : (
            <ul>
              {suggestions.map((movie, index) => (
                <li 
                  key={index}
                  onClick={() => handleSuggestionClick(movie)}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  {movie}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      
      {/* Click outside to close dropdown */}
      {showDropdown && (
        <div 
          className="fixed inset-0 z-0"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
}