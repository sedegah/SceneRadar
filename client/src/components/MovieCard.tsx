import { useState } from 'react';
import { Movie, TvShow } from '@/types';
import { useBookmarks } from '@/hooks/useBookmarks';
import { queryClient } from '@/lib/queryClient';

interface MovieCardProps {
  item: Movie | TvShow;
  mediaType: 'movie' | 'tv';
}

const MovieCard = ({ item, mediaType }: MovieCardProps) => {
  const { isBookmarked, addBookmark, removeBookmark } = useBookmarks();
  const bookmarked = isBookmarked(item.id, mediaType);
  
  // Get the item title based on media type
  const title = mediaType === 'movie' 
    ? (item as Movie).title 
    : (item as TvShow).name;
  
  // Get the release date based on media type
  const releaseDate = mediaType === 'movie'
    ? (item as Movie).release_date
    : (item as TvShow).first_air_date;
  
  // Get release year if available
  const releaseYear = releaseDate 
    ? new Date(releaseDate).getFullYear() 
    : '';

  // Get genre names from our genres or genre_ids
  const getGenres = () => {
    if ('genres' in item && item.genres) {
      return item.genres.slice(0, 2).map(g => g.name).join(', ');
    } else if ('genre_ids' in item) {
      // To resolve genre names from IDs, you'd need a genres lookup
      return 'Loading genres...';
    }
    return '';
  };

  const handleBookmarkToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (bookmarked) {
      removeBookmark(item.id, mediaType);
    } else {
      addBookmark({
        id: item.id,
        title,
        poster_path: item.poster_path,
        media_type: mediaType
      });
    }
  };

  const handleOpenDetails = () => {
    // Prefetch details for faster loading
    queryClient.prefetchQuery({
      queryKey: [`/api/movies/${mediaType}/${item.id}`]
    });

    // Fire custom event to open modal
    const event = new CustomEvent('openMovieModal', { 
      detail: { id: item.id, mediaType } 
    });
    document.dispatchEvent(event);
  };

  return (
    <div 
      className="movie-card group relative overflow-hidden rounded-xl shadow-md hover:shadow-xl bg-white dark:bg-gray-800 transition-all duration-300 
      hover:-translate-y-1 active:scale-98 cursor-pointer touch-manipulation card-hover"
      onClick={handleOpenDetails}
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-t-xl">
        {item.poster_path ? (
          <div className="image-loading w-full h-full">
            <img 
              src={`https://image.tmdb.org/t/p/w500${item.poster_path}`} 
              alt={`${title} poster`} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 optimize-image"
              loading="lazy"
              onLoad={(e) => (e.target as HTMLImageElement).parentElement?.classList.remove('image-loading')}
            />
          </div>
        ) : (
          <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <span className="material-icons text-4xl text-gray-400 dark:text-gray-500">movie</span>
          </div>
        )}
        
        {/* Rating badge - improved for mobile */}
        <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-bold flex items-center shadow-md">
          <span className="material-icons text-amber-400 mr-1" style={{ fontSize: '14px' }}>star</span>
          <span>{item.vote_average.toFixed(1)}</span>
        </div>
        
        {/* Media type badge */}
        <div className="absolute bottom-2 left-2 bg-primary/80 backdrop-blur-sm text-white px-2 py-0.5 rounded-full text-xs uppercase font-bold shadow-md">
          {mediaType}
        </div>
        
        {/* Bookmark button - larger touch target for mobile */}
        <div className="absolute top-1.5 right-1.5 z-10">
          <button 
            className="p-2.5 rounded-full bg-black/40 backdrop-blur-sm hover:bg-black/60 text-white transition-all
            shadow-lg transform group-hover:scale-110 active:scale-95 mobile-touch-target"
            onClick={(e) => {
              e.stopPropagation();
              handleBookmarkToggle(e);
            }}
            aria-label={bookmarked ? "Remove from bookmarks" : "Add to bookmarks"}
          >
            <span className="material-icons text-base">
              {bookmarked ? 'bookmark' : 'bookmark_border'}
            </span>
          </button>
        </div>
        
        {/* Hover overlay - optimized for desktop with improved animations */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent
          opacity-0 group-hover:opacity-100 transition-opacity duration-300
          sm:flex flex-col justify-end p-4 text-white hidden animate-on-scroll"
          data-aos="fade-up">
          <h3 className="font-bold text-lg text-shadow-lg mobile-title">{title}</h3>
          {releaseYear && <p className="text-sm opacity-90 mb-2">{releaseYear}</p>}
          <button 
            className="bg-primary hover:bg-primary/90 text-white py-2 rounded-lg flex items-center justify-center gap-1.5 mt-2 transition-transform hover:scale-105 active:scale-95"
          >
            <span className="material-icons text-sm">info</span>
            <span>View Details</span>
          </button>
        </div>
        
        {/* Mobile touch overlay with ripple effect */}
        <div className="absolute inset-0 sm:hidden active:bg-black/30 transition-colors"></div>
      </div>
      
      {/* Info area - with improved mobile layout */}
      <div className="p-3 sm:p-3.5 md:p-4">
        <h3 className="font-medium line-clamp-1 text-sm md:text-base leading-snug mobile-text-sm">{title}</h3>
        <div className="flex justify-between items-center mt-1.5 text-xs text-gray-500 dark:text-gray-400">
          <div className="truncate max-w-[65%]">{getGenres()}</div>
          <div className="flex items-center shrink-0">
            <span className="material-icons text-xs mr-1">calendar_today</span>
            <span>{releaseYear || 'N/A'}</span>
          </div>
        </div>
      </div>
      
      {/* Mobile-only quick actions - visible on long press */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black to-transparent p-4 flex justify-center gap-4
        opacity-0 group-active:opacity-100 transition-opacity duration-200 sm:hidden">
        <button className="p-2 rounded-full bg-white/20 backdrop-blur-sm">
          <span className="material-icons text-white text-lg">info</span>
        </button>
        <button 
          className="p-2 rounded-full bg-white/20 backdrop-blur-sm"
          onClick={(e) => handleBookmarkToggle(e)}
        >
          <span className="material-icons text-white text-lg">
            {bookmarked ? 'bookmark' : 'bookmark_border'}
          </span>
        </button>
      </div>
    </div>
  );
};

export default MovieCard;
