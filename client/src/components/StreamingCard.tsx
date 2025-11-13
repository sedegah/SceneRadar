import { StreamingContent } from '@/types';
import { queryClient } from '@/lib/queryClient';

interface StreamingCardProps {
  item: StreamingContent;
}

const StreamingCard = ({ item }: StreamingCardProps) => {
  const title = item.title || item.name || 'Unknown Title';
  const releaseYear = item.release_date
    ? new Date(item.release_date).getFullYear()
    : item.first_air_date
    ? new Date(item.first_air_date).getFullYear()
    : '';
    
  const handleOpenDetails = () => {
    // Prefetch details for faster loading
    queryClient.prefetchQuery({
      queryKey: [`/api/movies/${item.media_type}/${item.id}`]
    });

    // Fire custom event to open modal
    const event = new CustomEvent('openMovieModal', { 
      detail: { id: item.id, mediaType: item.media_type } 
    });
    document.dispatchEvent(event);
  };
  
  // Get provider logo
  const providerLogo = item.provider_logo || getProviderLogo(item.provider);
  
  function getProviderLogo(provider: string) {
    switch (provider.toLowerCase()) {
      case 'netflix':
        return 'https://upload.wikimedia.org/wikipedia/commons/7/7a/Logonetflix.png';
      case 'hbo max':
      case 'hbo':
        return 'https://upload.wikimedia.org/wikipedia/commons/1/17/HBO_Max_Logo.svg';
      case 'disney+':
      case 'disney plus':
        return 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Disney%2B_logo.svg';
      case 'hulu':
        return 'https://upload.wikimedia.org/wikipedia/commons/e/e4/Hulu_Logo.svg';
      case 'prime video':
      case 'amazon prime':
        return 'https://upload.wikimedia.org/wikipedia/commons/f/f1/Prime_Video.png';
      case 'apple tv+':
      case 'apple tv plus':
        return 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Apple_TV_Plus_logo.svg';
      default:
        return '';
    }
  }

  return (
    <div className="flex bg-white dark:bg-darkCard rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 card-hover">
      <div className="w-1/3 relative">
        {item.poster_path ? (
          <div className="image-loading w-full h-full">
            <img 
              src={`https://image.tmdb.org/t/p/w500${item.poster_path}`} 
              alt={`${title} poster`} 
              className="w-full h-full object-cover optimize-image"
              loading="lazy"
              onLoad={(e) => (e.target as HTMLImageElement).parentElement?.classList.remove('image-loading')}
            />
          </div>
        ) : (
          <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <span className="material-icons text-4xl text-gray-400">movie</span>
          </div>
        )}
        
        {/* Provider logo with improved styling */}
        <div className="absolute top-2 left-2">
          {providerLogo && (
            <div className="bg-white/80 dark:bg-black/70 backdrop-blur-sm p-1 rounded shadow-sm">
              <img 
                src={providerLogo} 
                alt={item.provider} 
                className="h-4 sm:h-5"
              />
            </div>
          )}
        </div>
        
        {/* Rating badge */}
        <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm text-white px-1.5 py-0.5 rounded-md text-xs flex items-center space-x-0.5 shadow-md">
          <span className="material-icons text-amber-400" style={{ fontSize: '12px' }}>star</span>
          <span>{item.vote_average.toFixed(1)}</span>
        </div>
      </div>
      
      <div className="w-2/3 p-3 sm:p-4 flex flex-col">
        {/* Title with better wrapping for mobile */}
        <div className="flex-1">
          <h3 className="font-medium text-sm sm:text-base line-clamp-1 mobile-text-sm">{title}</h3>
          
          {/* Media info with better spacing for mobile */}
          <span className="text-xs text-gray-500 dark:text-gray-400 mb-1 sm:mb-2 block mt-0.5">
            {item.media_type === 'tv' ? 'TV Show' : 'Movie'}
            {item.media_type === 'tv' && item.number_of_seasons && ` • ${item.number_of_seasons} Season${item.number_of_seasons > 1 ? 's' : ''}`}
            {releaseYear && ` • ${releaseYear}`}
          </span>
          
          {/* Overview with improved truncation for mobile */}
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-2 sm:mb-3 line-clamp-2 sm:line-clamp-3">{item.overview}</p>
        </div>
        
        {/* Button with better touch target for mobile */}
        <div className="mt-auto">
          <button 
            className="w-full bg-primary hover:bg-primary/90 text-white py-2 sm:py-1.5 rounded font-medium text-xs sm:text-sm transition-transform active:scale-98 mobile-touch-target"
            onClick={handleOpenDetails}
          >
            <span className="flex items-center justify-center gap-1">
              <span className="material-icons text-sm">play_circle</span>
              <span>Watch Now</span>
            </span>
          </button>
        </div>
      </div>
      
      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-black/0 hover:bg-black/5 dark:hover:bg-white/5 transition-colors duration-300 pointer-events-none"></div>
    </div>
  );
};

export default StreamingCard;
