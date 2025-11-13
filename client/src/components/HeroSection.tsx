import { useEffect, useState } from 'react';
import { Movie, ApiResponse } from '@/types';
import { useTrendingMovies } from '@/hooks/useMovies';
import { useBookmarks } from '@/hooks/useBookmarks';

const HeroSection = () => {
  const { data, isLoading, error } = useTrendingMovies();
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);
  const { isBookmarked, addBookmark, removeBookmark } = useBookmarks();
  
  useEffect(() => {
    if (data && data.results && Array.isArray(data.results) && data.results.length > 0) {
      // Pick one of the top 5 trending movies
      const randomIndex = Math.floor(Math.random() * Math.min(5, data.results.length));
      setFeaturedMovie(data.results[randomIndex]);
    }
  }, [data]);
  
  if (isLoading) {
    return (
      <section className="relative rounded-xl overflow-hidden mb-10 bg-gradient-to-r from-secondary to-primary animate-pulse h-[28rem]">
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40"></div>
        <div className="relative z-10 px-6 md:px-12 pt-24 max-w-2xl">
          <div className="h-8 bg-white/20 w-32 rounded-full mb-4"></div>
          <div className="h-12 bg-white/20 w-3/4 rounded mb-4"></div>
          <div className="flex space-x-3 mb-4">
            <div className="h-8 bg-black/30 w-20 rounded"></div>
            <div className="h-8 bg-black/30 w-24 rounded"></div>
            <div className="h-8 bg-black/30 w-16 rounded"></div>
          </div>
          <div className="h-24 bg-white/10 rounded mb-6"></div>
          <div className="flex space-x-4">
            <div className="h-12 bg-primary/50 w-36 rounded-lg"></div>
            <div className="h-12 bg-gray-700/50 w-32 rounded-lg"></div>
          </div>
        </div>
      </section>
    );
  }
  
  if (error || !featuredMovie) {
    return (
      <section className="relative rounded-xl overflow-hidden mb-10 bg-gradient-to-r from-secondary to-primary h-64">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white text-center">
            <span className="material-icons text-5xl mb-4">error_outline</span>
            <h2 className="text-2xl font-bold">Failed to load featured content</h2>
            <p className="mt-2">Please try again later</p>
          </div>
        </div>
      </section>
    );
  }
  
  const isMovieBookmarked = isBookmarked(featuredMovie.id, 'movie');
  
  const handleBookmarkToggle = () => {
    if (isMovieBookmarked) {
      removeBookmark(featuredMovie.id, 'movie');
    } else {
      addBookmark({
        id: featuredMovie.id,
        title: featuredMovie.title,
        poster_path: featuredMovie.poster_path,
        media_type: 'movie'
      });
    }
  };
  
  const handleTrailerClick = () => {
    // Fire custom event to open modal with trailer tab active
    const event = new CustomEvent('openMovieModal', { 
      detail: { id: featuredMovie.id, mediaType: 'movie', showTrailer: true } 
    });
    document.dispatchEvent(event);
  };
  
  return (
    <section className="relative rounded-2xl overflow-hidden mb-10 shadow-2xl">
      <div className="w-full h-[450px] sm:h-[500px] md:h-[550px] lg:h-[600px] bg-gradient-to-r from-secondary to-primary">
        {/* Overlay gradient - better mobile visibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30 md:bg-gradient-to-r md:from-black/80 md:via-black/40 md:to-transparent z-10"></div>
        
        {/* Background image */}
        {featuredMovie.backdrop_path && (
          <img 
            src={`https://image.tmdb.org/t/p/original${featuredMovie.backdrop_path}`} 
            alt={`${featuredMovie.title} backdrop`} 
            className="absolute inset-0 w-full h-full object-cover"
            loading="eager"
          />
        )}
        
        {/* Poster image - only visible on larger screens */}
        <div className="hidden lg:block absolute right-12 bottom-0 z-20 transform translate-y-16">
          {featuredMovie.poster_path && (
            <img 
              src={`https://image.tmdb.org/t/p/w500${featuredMovie.poster_path}`}
              alt={`${featuredMovie.title} poster`}
              className="w-64 rounded-t-xl shadow-2xl border-4 border-white/10"
              loading="eager"
            />
          )}
        </div>
        
        {/* Content - improved for mobile */}
        <div className="relative z-20 h-full flex flex-col justify-center px-6 md:px-12 w-full md:max-w-3xl lg:max-w-2xl">
          {/* Badge */}
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary text-white text-sm font-bold mb-4 shadow-lg backdrop-blur-sm">
            Featured Today
          </span>
          
          {/* Title - better responsive sizing */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-3 text-shadow-md leading-tight">
            {featuredMovie.title}
          </h2>
          
          {/* Year & Runtime */}
          <div className="flex flex-wrap gap-2 mb-4">
            {featuredMovie.release_date && (
              <span className="px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-sm font-medium">
                {new Date(featuredMovie.release_date).getFullYear()}
              </span>
            )}
            
            {/* Rating */}
            <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/90 backdrop-blur-sm text-black text-sm font-bold">
              <span className="material-icons text-sm">star</span>
              <span>{featuredMovie.vote_average.toFixed(1)}</span>
            </div>
          </div>
          
          {/* Genres - scrollable on mobile */}
          <div className="flex flex-nowrap overflow-x-auto hide-scrollbar gap-2 mb-4 pb-1">
            {featuredMovie.genre_ids?.slice(0, 3).map((genreId) => (
              <span key={genreId} className="px-3 py-1 rounded-full bg-gray-700/60 backdrop-blur-sm text-white text-sm whitespace-nowrap">
                {getGenreName(genreId)}
              </span>
            ))}
          </div>
          
          {/* Overview - shortened for mobile */}
          <p className="text-gray-100 mb-6 max-w-xl text-sm md:text-base font-medium leading-relaxed text-shadow line-clamp-3 sm:line-clamp-4 md:line-clamp-none">
            {featuredMovie.overview}
          </p>
          
          {/* Buttons - more mobile friendly */}
          <div className="flex flex-wrap gap-3">
            <button 
              className="bg-primary hover:bg-primary/90 text-white px-4 py-2.5 md:px-5 md:py-3 rounded-xl font-medium flex items-center gap-2 shadow-lg transition-transform hover:scale-105 text-sm md:text-base"
              onClick={handleTrailerClick}
            >
              <span className="material-icons">play_circle</span>
              <span>Watch Trailer</span>
            </button>
            <button 
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-4 py-2.5 md:px-5 md:py-3 rounded-xl font-medium flex items-center gap-2 shadow-lg border border-white/20 transition-transform hover:scale-105 text-sm md:text-base"
              onClick={handleBookmarkToggle}
            >
              <span className="material-icons">{isMovieBookmarked ? 'bookmark' : 'bookmark_border'}</span>
              <span>{isMovieBookmarked ? 'Saved' : 'Save for Later'}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

// Helper function to get genre name from ID
function getGenreName(genreId: number): string {
  const genres: Record<number, string> = {
    28: 'Action',
    12: 'Adventure',
    16: 'Animation',
    35: 'Comedy',
    80: 'Crime',
    99: 'Documentary',
    18: 'Drama',
    10751: 'Family',
    14: 'Fantasy',
    36: 'History',
    27: 'Horror',
    10402: 'Music',
    9648: 'Mystery',
    10749: 'Romance',
    878: 'Sci-Fi',
    10770: 'TV Movie',
    53: 'Thriller',
    10752: 'War',
    37: 'Western'
  };
  
  return genres[genreId] || 'Unknown';
}

export default HeroSection;
