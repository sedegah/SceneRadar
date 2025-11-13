import { useState, useEffect } from 'react';
import { useGenres, useMoviesByGenre } from '@/hooks/useMovies';
import MovieCard from '@/components/MovieCard';
import { Movie, Genre } from '@/types';

const GenreSection = () => {
  const { data: genresData, isLoading: isLoadingGenres } = useGenres();
  const [selectedGenreId, setSelectedGenreId] = useState<number>(28); // Default to Action genre
  const { data: moviesData, isLoading: isLoadingMovies } = useMoviesByGenre(selectedGenreId);
  
  // Set initial genre once data is loaded
  useEffect(() => {
    if (genresData?.genres && genresData.genres.length > 0 && !selectedGenreId) {
      setSelectedGenreId(genresData.genres[0].id);
    }
  }, [genresData, selectedGenreId]);
  
  return (
    <section id="genres" className="mb-12">
      <h2 className="text-2xl font-bold font-sans mb-6">Top Rated by Genre</h2>
      
      <div className="mb-6 flex overflow-x-auto space-x-2 py-2 hide-scrollbar">
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
      
      {isLoadingMovies ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="rounded-lg shadow-md bg-white dark:bg-darkCard">
              <div className="aspect-[2/3] bg-gray-200 dark:bg-gray-700 animate-pulse rounded-t-lg"></div>
              <div className="p-3">
                <div className="h-5 bg-gray-200 dark:bg-gray-700 animate-pulse rounded mb-2"></div>
                <div className="h-4 bg-gray-100 dark:bg-gray-800 animate-pulse rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      ) : !moviesData?.results || moviesData.results.length === 0 ? (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 text-center">
          <span className="material-icons text-yellow-500 text-3xl mb-2">search_off</span>
          <h3 className="text-lg font-medium text-yellow-800 dark:text-yellow-300 mb-1">No movies found for this genre</h3>
          <p className="text-yellow-600 dark:text-yellow-400">Try selecting a different genre</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {moviesData.results.slice(0, 10).map((movie: Movie) => (
            <div key={movie.id} className="movie-card group relative overflow-hidden rounded-lg shadow-lg bg-white dark:bg-darkCard transition-transform hover:-translate-y-1 duration-200">
              <div className="relative aspect-[2/3] overflow-hidden">
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
                
                <div className="absolute top-0 left-0 p-2">
                  <div className="flex items-center space-x-1 bg-yellow-500 text-black px-2 py-0.5 rounded text-xs font-medium">
                    <span className="material-icons text-xs">star</span>
                    <span>{movie.vote_average.toFixed(1)}</span>
                  </div>
                </div>
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end">
                  <div className="p-3 w-full">
                    <button className="w-full bg-primary hover:bg-primary/90 text-white py-2 rounded-lg flex items-center justify-center space-x-1">
                      <span className="material-icons text-sm">info</span>
                      <span>Details</span>
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="p-3">
                <h3 className="font-medium truncate-2 leading-tight mb-1">{movie.title}</h3>
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>
                    {genresData?.genres
                      ?.filter(g => movie.genre_ids.includes(g.id))
                      .slice(0, 2)
                      .map(g => g.name)
                      .join(', ')}
                  </span>
                  <span>{movie.release_date ? new Date(movie.release_date).getFullYear() : ''}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default GenreSection;
