import { useState, useRef, useEffect } from 'react';
import { useSearch } from '@/hooks/useSearch';
import { useMovieDetails } from '@/hooks/useMovies';
import { queryClient } from '@/lib/queryClient';

export const Search = () => {
  const { query, setQuery, results, isLoading, error } = useSearch();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside, { passive: true });
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  // Show dropdown when there are results and query is not empty
  useEffect(() => {
    if (query.trim() && results.length > 0) {
      setIsDropdownOpen(true);
    } else {
      setIsDropdownOpen(false);
    }
  }, [query, results]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSelectMovie = (id: number, mediaType: string) => {
    // Fetch movie details on selection and store in query cache
    queryClient.prefetchQuery({
      queryKey: [`/api/movies/${mediaType}/${id}`]
    });

    // Manually trigger movie modal to open (this would be connected to a global modal state)
    // We'll use a custom event to communicate with the MovieModal component
    const event = new CustomEvent('openMovieModal', { 
      detail: { id, mediaType } 
    });
    document.dispatchEvent(event);
    
    // Close dropdown and clear search
    setIsDropdownOpen(false);
    setQuery('');
  };

  return (
    <div className="relative w-full sm:w-auto" ref={searchRef}>
      <input
        type="text"
        placeholder="Search movies & shows..."
        className="w-full sm:w-64 md:w-72 lg:w-80 pl-10 pr-4 py-2.5 rounded-full text-sm bg-gray-100 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
        value={query}
        onChange={handleInputChange}
        aria-label="Search movies and TV shows"
      />
      <span className="material-icons absolute left-3 top-2.5 text-gray-400 text-base">search</span>
      
      {isDropdownOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50 max-h-[70vh] sm:max-h-96 overflow-auto sm:min-w-[400px]">
          <ul className="py-2">
            {results.map((result) => (
              <li 
                key={result.id} 
                className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer active:bg-gray-200 dark:active:bg-gray-600" 
                onClick={() => handleSelectMovie(result.id, result.media_type)}
              >
                <div className="flex items-center space-x-3">
                  {result.poster_path ? (
                    <img 
                      src={`https://image.tmdb.org/t/p/w92${result.poster_path}`} 
                      alt={result.title || result.name} 
                      className="w-10 h-14 object-cover rounded"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-10 h-14 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                      <span className="material-icons text-gray-400">movie</span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{result.title || result.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {result.media_type === 'movie' ? 'Movie' : 'TV Show'} • 
                      {result.media_type === 'movie' 
                        ? result.release_date && ` ${new Date(result.release_date).getFullYear()}`
                        : result.first_air_date && ` ${new Date(result.first_air_date).getFullYear()}`
                      }
                    </p>
                  </div>
                </div>
              </li>
            ))}
            
            {isLoading && (
              <li className="px-4 py-3 text-center text-gray-500">
                <div className="flex items-center justify-center space-x-2">
                  <span className="material-icons animate-spin">refresh</span>
                  <span>Searching...</span>
                </div>
              </li>
            )}
            
            {error && (
              <li className="px-4 py-3 text-center text-red-500">
                <div className="flex items-center justify-center space-x-2">
                  <span className="material-icons">error</span>
                  <span>Error searching</span>
                </div>
              </li>
            )}
            
            {!isLoading && !error && results.length === 0 && query.trim() !== '' && (
              <li className="px-4 py-3 text-center text-gray-500">
                No results found for "{query}"
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};
