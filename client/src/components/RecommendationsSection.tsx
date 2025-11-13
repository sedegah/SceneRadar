import { useState, useEffect } from 'react';
import { useRecommendations } from '@/hooks/useRecommendations';
import { useGenres, useMoviesByGenre } from '@/hooks/useMovies';
import MovieCard from '@/components/MovieCard';
import { Movie, Genre } from '@/types';

interface MoviesData {
  results: Movie[];
  page?: number;
  total_pages?: number;
  total_results?: number;
}

interface GenresData {
  genres: Genre[];
}

const RecommendationsSection = () => {
  const { data: genresData, isLoading: isLoadingGenres } = useGenres() as { data: GenresData | undefined, isLoading: boolean };
  const [selectedGenreId, setSelectedGenreId] = useState<number>(28); // Default to Action genre
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);
  
  const { data: moviesData, isLoading: isLoadingMovies } = useMoviesByGenre(selectedGenreId) as { data: MoviesData | undefined, isLoading: boolean };
  const { recommendations, isLoading: isLoadingRecommendations } = useRecommendations(selectedMovieId);
  
  // Set a selected movie when genre changes
  useEffect(() => {
    if (moviesData?.results && moviesData.results.length > 0) {
      // Select the first movie in the genre to get recommendations
      setSelectedMovieId(moviesData.results[0].id);
    }
  }, [moviesData]);

  // Convert a movie to a reference movie for UI display
  const getSelectedMovieDetails = () => {
    if (!moviesData?.results) return null;
    return moviesData.results.find(movie => movie.id === selectedMovieId);
  };
  
  const selectedMovie = getSelectedMovieDetails();
  
  return (
    <section id="recommendations" className="mb-12">
      <h2 className="text-2xl font-bold font-display mb-2">Movie Recommendations</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        Select a genre, pick a movie, and we'll recommend similar titles you might enjoy
      </p>
      
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3">1. Choose a genre:</h3>
        <div className="flex overflow-x-auto space-x-2 py-2 hide-scrollbar">
          {isLoadingGenres ? (
            // Loading skeleton for genre buttons
            [...Array(7)].map((_, i) => (
              <div key={i} className="whitespace-nowrap px-4 py-2 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse w-24 h-9"></div>
            ))
          ) : (
            genresData?.genres?.map((genre: Genre) => (
              <button 
                key={genre.id}
                className={`whitespace-nowrap px-4 py-2 rounded-full ${
                  selectedGenreId === genre.id ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-800'
                } font-medium`}
                onClick={() => setSelectedGenreId(genre.id)}
              >
                {genre.name}
              </button>
            ))
          )}
        </div>
      </div>
      
      {isLoadingMovies ? (
        <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-64 rounded-lg mb-6"></div>
      ) : moviesData?.results && moviesData.results.length > 0 ? (
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3">2. Select a movie you like:</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {moviesData.results.slice(0, 5).map((movie: Movie) => (
              <div 
                key={movie.id} 
                onClick={() => setSelectedMovieId(movie.id)}
                className={`cursor-pointer overflow-hidden rounded-lg shadow-md transition-all ${
                  selectedMovieId === movie.id 
                    ? 'ring-4 ring-primary scale-105' 
                    : 'hover:scale-105 hover:shadow-lg'
                }`}
              >
                <div className="relative aspect-[2/3]">
                  {movie.poster_path ? (
                    <img 
                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                      alt={`${movie.title} poster`} 
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <span className="material-icons text-4xl text-gray-400">movie</span>
                    </div>
                  )}
                </div>
                <div className="p-2">
                  <h4 className="font-medium text-sm truncate">{movie.title}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 text-center mb-6">
          <span className="material-icons text-yellow-500 text-3xl mb-2">search_off</span>
          <h3 className="text-lg font-medium text-yellow-800 dark:text-yellow-300 mb-1">No movies found for this genre</h3>
          <p className="text-yellow-600 dark:text-yellow-400">Try selecting a different genre</p>
        </div>
      )}
      
      {selectedMovie && (
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3">3. Because you like "{selectedMovie.title}":</h3>
          
          {isLoadingRecommendations ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="rounded-lg shadow-md bg-white dark:bg-darkCard">
                  <div className="aspect-[2/3] bg-gray-200 dark:bg-gray-700 animate-pulse rounded-t-lg"></div>
                  <div className="p-3">
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 animate-pulse rounded mb-2"></div>
                    <div className="h-4 bg-gray-100 dark:bg-gray-800 animate-pulse rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : recommendations.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
              {recommendations.slice(0, 10).map((movie: Movie) => (
                <MovieCard 
                  key={movie.id} 
                  item={movie} 
                  mediaType="movie" 
                />
              ))}
            </div>
          ) : (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 text-center">
              <span className="material-icons text-blue-500 text-3xl mb-2">movie_filter</span>
              <h3 className="text-lg font-medium text-blue-800 dark:text-blue-300 mb-1">No recommendations found</h3>
              <p className="text-blue-600 dark:text-blue-400">Try selecting a different movie</p>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default RecommendationsSection;