import { useState, useEffect } from 'react';
import { useMovieDetails, useTvDetails } from '@/hooks/useMovies';
import { useBookmarks } from '@/hooks/useBookmarks';
import { MovieDetails } from '@/types';

export const MovieModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [itemId, setItemId] = useState<number | null>(null);
  const [mediaType, setMediaType] = useState<'movie' | 'tv'>('movie');
  const [showTrailer, setShowTrailer] = useState(false);
  
  const { data: movieData, isLoading: isLoadingMovie } = useMovieDetails(mediaType === 'movie' ? itemId || 0 : 0);
  const { data: tvData, isLoading: isLoadingTv } = useTvDetails(mediaType === 'tv' ? itemId || 0 : 0);
  
  const isLoading = mediaType === 'movie' ? isLoadingMovie : isLoadingTv;
  const data = mediaType === 'movie' ? movieData : tvData;
  
  const { isBookmarked, addBookmark, removeBookmark } = useBookmarks();
  
  // Listen for custom event to open modal
  useEffect(() => {
    const handleOpenModal = (event: CustomEvent) => {
      const { id, mediaType: type, showTrailer: trailer } = event.detail;
      setItemId(id);
      setMediaType(type || 'movie');
      setShowTrailer(!!trailer);
      setIsOpen(true);
    };
    
    document.addEventListener('openMovieModal', handleOpenModal as EventListener);
    
    return () => {
      document.removeEventListener('openMovieModal', handleOpenModal as EventListener);
      // Ensure modal-open class is removed on unmount
      document.body.classList.remove('modal-open');
    };
  }, []);
  
  const handleClose = () => {
    setIsOpen(false);
    setItemId(null);
  };

  // Ensure body overflow is properly managed when modal state changes
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [isOpen]);
  
  // Handle clicks outside the modal
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };
  
  // Handle bookmark toggling
  const handleBookmarkToggle = () => {
    if (!data) return;
    
    const itemTitle = mediaType === 'movie' 
      ? (data as any).title 
      : (data as any).name;
    
    if (isBookmarked(data.id, mediaType)) {
      removeBookmark(data.id, mediaType);
    } else {
      addBookmark({
        id: data.id,
        title: itemTitle,
        poster_path: data.poster_path,
        media_type: mediaType
      });
    }
  };
  
  // Handle sharing
  const handleShare = () => {
    if (!data) return;
    
    const itemTitle = mediaType === 'movie' 
      ? (data as any).title 
      : (data as any).name;
    
    if (navigator.share) {
      navigator.share({
        title: itemTitle,
        text: `Check out ${itemTitle} on SceneRadar!`,
        url: window.location.href
      }).catch(err => {
        console.error('Error sharing:', err);
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href)
        .then(() => {
          alert('Link copied to clipboard!');
        })
        .catch(err => {
          console.error('Error copying to clipboard:', err);
        });
    }
  };
  
  // Find trailer if available
  const getTrailerKey = () => {
    if (!data?.videos?.results) return null;
    
    const trailer = data.videos.results.find(
      video => video.type === 'Trailer' && video.site === 'YouTube'
    );
    
    return trailer ? trailer.key : null;
  };
  
  const trailerKey = getTrailerKey();
  const bookmarked = data ? isBookmarked(data.id, mediaType) : false;
  
  if (!isOpen) return null;
  
  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title" 
      role="dialog" 
      aria-modal="true"
      onClick={handleBackdropClick}
    >
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 bg-black/75 transition-opacity" aria-hidden="true"></div>
        
        {/* Modal panel */}
        <div className="relative inline-block align-bottom rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <button 
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
            onClick={handleClose}
          >
            <span className="material-icons">close</span>
          </button>
          
          {isLoading ? (
            // Loading state
            <div className="bg-white dark:bg-darkCard p-8 flex flex-col items-center justify-center min-h-[50vh]">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
              <p className="mt-4 text-gray-500 dark:text-gray-400">Loading details...</p>
            </div>
          ) : !data ? (
            // Error state
            <div className="bg-white dark:bg-darkCard p-8 flex flex-col items-center justify-center min-h-[50vh]">
              <span className="material-icons text-red-500 text-5xl mb-4">error_outline</span>
              <h3 className="text-xl font-bold mb-2">Failed to load content</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">Please try again later</p>
              <button 
                className="px-4 py-2 bg-primary text-white rounded-lg"
                onClick={handleClose}
              >
                Close
              </button>
            </div>
          ) : (
            <>
              {/* Backdrop with poster */}
              <div className="relative h-64 sm:h-80 md:h-96 bg-gradient-to-r from-secondary to-primary">
                {data.backdrop_path && (
                  <img 
                    src={`https://image.tmdb.org/t/p/original${data.backdrop_path}`} 
                    alt={`${mediaType === 'movie' ? (data as any).title : (data as any).name} backdrop`} 
                    className="absolute inset-0 w-full h-full object-cover opacity-50"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent"></div>
                
                <div className="absolute bottom-0 left-0 p-6 flex space-x-6">
                  <div className="hidden sm:block w-32 h-48 rounded-lg overflow-hidden shadow-lg">
                    {data.poster_path ? (
                      <img 
                        src={`https://image.tmdb.org/t/p/w500${data.poster_path}`} 
                        alt={`${mediaType === 'movie' ? (data as any).title : (data as any).name} poster`} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <span className="material-icons text-4xl text-gray-400">movie</span>
                      </div>
                    )}
                  </div>
                  <div className="text-white max-w-xl">
                    <h2 id="modal-title" className="text-2xl md:text-3xl font-bold mb-2">
                      {mediaType === 'movie' ? (data as any).title : (data as any).name}
                    </h2>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {data.genres?.slice(0, 3).map(genre => (
                        <span key={genre.id} className="px-2 py-1 rounded bg-gray-800/80 text-white text-xs">
                          {genre.name}
                        </span>
                      ))}
                      <span className="px-2 py-1 rounded bg-gray-800/80 text-white text-xs">
                        {mediaType === 'movie'
                          ? (data as any).release_date && new Date((data as any).release_date).getFullYear()
                          : (data as any).first_air_date && new Date((data as any).first_air_date).getFullYear()
                        }
                      </span>
                      {mediaType === 'movie' && (data as any).runtime && (
                        <span className="px-2 py-1 rounded bg-gray-800/80 text-white text-xs">
                          {Math.floor((data as any).runtime / 60)}h {(data as any).runtime % 60}m
                        </span>
                      )}
                      {mediaType === 'tv' && (data as any).number_of_seasons && (
                        <span className="px-2 py-1 rounded bg-gray-800/80 text-white text-xs">
                          {(data as any).number_of_seasons} Season{(data as any).number_of_seasons !== 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {(data as MovieDetails).ratings && (
                        <>
                          <div className="rating-imdb text-black px-2 py-1 rounded text-xs font-medium">
                            IMDb: {(data as MovieDetails).ratings?.imdb || 'N/A'}
                          </div>
                          <div className="rating-rotten text-white px-2 py-1 rounded text-xs font-medium">
                            Rotten Tomatoes: {(data as MovieDetails).ratings?.rottenTomatoes || 'N/A'}
                          </div>
                          <div className="rating-metacritic text-white px-2 py-1 rounded text-xs font-medium">
                            Metacritic: {(data as MovieDetails).ratings?.metacritic || 'N/A'}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Content section */}
              <div className="bg-white dark:bg-darkCard p-6">
                <div className="mt-4 sm:mt-0">
                  <h3 className="text-lg font-bold mb-2">Overview</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">{data.overview}</p>
                  
                  {trailerKey && (
                    <>
                      <h3 className="text-lg font-bold mb-2">Trailer</h3>
                      <div className="relative pb-[56.25%] mb-6">
                        <iframe 
                          src={`https://www.youtube.com/embed/${trailerKey}?autoplay=${showTrailer ? '1' : '0'}`}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="absolute inset-0 w-full h-full rounded-lg"
                        ></iframe>
                      </div>
                    </>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {data.credits?.cast && (
                      <div>
                        <h3 className="text-lg font-bold mb-3">Cast</h3>
                        <ul className="space-y-2">
                          {data.credits.cast.slice(0, 5).map(person => (
                            <li key={person.id} className="flex items-center space-x-3">
                              <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                                {person.profile_path ? (
                                  <img 
                                    src={`https://image.tmdb.org/t/p/w92${person.profile_path}`} 
                                    alt={person.name} 
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <span className="material-icons text-gray-400">person</span>
                                  </div>
                                )}
                              </div>
                              <div>
                                <p className="font-medium">{person.name}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{person.character}</p>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <div>
                      <h3 className="text-lg font-bold mb-3">Details</h3>
                      <div className="space-y-2 text-sm">
                        {mediaType === 'movie' && data.credits?.crew && (
                          <div className="flex">
                            <span className="w-24 text-gray-500 dark:text-gray-400">Director:</span>
                            <span>
                              {data.credits.crew.find(p => p.job === 'Director')?.name || 'Unknown'}
                            </span>
                          </div>
                        )}
                        <div className="flex">
                          <span className="w-24 text-gray-500 dark:text-gray-400">Release Date:</span>
                          <span>
                            {mediaType === 'movie'
                              ? (data as any).release_date && new Date((data as any).release_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                              : (data as any).first_air_date && new Date((data as any).first_air_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                            }
                          </span>
                        </div>
                        {mediaType === 'movie' && (data as any).budget > 0 && (
                          <div className="flex">
                            <span className="w-24 text-gray-500 dark:text-gray-400">Budget:</span>
                            <span>
                              ${new Intl.NumberFormat('en-US').format((data as any).budget)}
                            </span>
                          </div>
                        )}
                        {mediaType === 'movie' && (data as any).revenue > 0 && (
                          <div className="flex">
                            <span className="w-24 text-gray-500 dark:text-gray-400">Revenue:</span>
                            <span>
                              ${new Intl.NumberFormat('en-US').format((data as any).revenue)}
                            </span>
                          </div>
                        )}
                        <div className="flex">
                          <span className="w-24 text-gray-500 dark:text-gray-400">
                            {mediaType === 'movie' ? 'Original Title:' : 'Original Name:'}
                          </span>
                          <span>
                            {mediaType === 'movie'
                              ? (data as any).original_title || (data as any).title
                              : (data as any).original_name || (data as any).name
                            }
                          </span>
                        </div>
                        {data.production_companies && data.production_companies.length > 0 && (
                          <div className="flex">
                            <span className="w-24 text-gray-500 dark:text-gray-400">Production:</span>
                            <span>
                              {data.production_companies.slice(0, 2).map(company => company.name).join(', ')}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-between">
                    <button 
                      className="inline-flex items-center px-4 py-2 border border-primary text-primary hover:bg-primary hover:text-white rounded-lg transition-colors"
                      onClick={handleBookmarkToggle}
                    >
                      <span className="material-icons mr-1 text-sm">
                        {bookmarked ? 'bookmark' : 'bookmark_border'}
                      </span> 
                      {bookmarked ? 'Saved' : 'Save'}
                    </button>
                    <button 
                      className="inline-flex items-center px-4 py-2 border border-primary text-primary hover:bg-primary hover:text-white rounded-lg transition-colors"
                      onClick={handleShare}
                    >
                      <span className="material-icons mr-1 text-sm">share</span> Share
                    </button>
                    <a 
                      href={`https://www.justwatch.com/us/search?q=${encodeURIComponent(
                        mediaType === 'movie' ? (data as any).title : (data as any).name
                      )}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      <span className="material-icons mr-1 text-sm">ondemand_video</span> Where to Watch
                    </a>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
