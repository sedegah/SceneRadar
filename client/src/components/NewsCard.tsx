import { News } from '@/types';
import { useState } from 'react';
import { useBookmarks } from '@/hooks/useBookmarks';

interface NewsCardProps {
  news: News;
}

const NewsCard = ({ news }: NewsCardProps) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  
  const formatTimeDifference = (publishedAt: string) => {
    const publishedDate = new Date(publishedAt);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - publishedDate.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`;
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
      return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
    }
    
    const diffInMonths = Math.floor(diffInDays / 30);
    return `${diffInMonths} ${diffInMonths === 1 ? 'month' : 'months'} ago`;
  };
  
  const handleBookmarkToggle = () => {
    setIsBookmarked(!isBookmarked);
    // In a real app, would save to storage
  };
  
  const handleShareClick = () => {
    if (navigator.share) {
      navigator.share({
        title: news.title,
        url: news.url
      }).catch(err => {
        console.error('Error sharing:', err);
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(news.url)
        .then(() => {
          alert('Link copied to clipboard!');
        })
        .catch(err => {
          console.error('Error copying to clipboard:', err);
        });
    }
  };

  return (
    <div className="bg-white dark:bg-darkCard rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 card-hover">
      <div className="relative h-40 sm:h-48">
        {news.urlToImage ? (
          <div className="image-loading w-full h-full">
            <img 
              src={news.urlToImage} 
              alt={news.title} 
              className="w-full h-full object-cover optimize-image"
              loading="lazy"
              onLoad={(e) => (e.target as HTMLImageElement).parentElement?.classList.remove('image-loading')}
            />
          </div>
        ) : (
          <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <span className="material-icons text-4xl text-gray-400">article</span>
          </div>
        )}
        
        {/* Category badge with enhanced styling */}
        <div className="absolute top-2 left-2">
          <span className="bg-primary text-white text-xs px-2 py-1 rounded shadow-md backdrop-blur-sm">
            {news.category || 'Latest News'}
          </span>
        </div>
        
        {/* Source logo badge - if available */}
        {news.source.name && (
          <div className="absolute bottom-2 right-2 bg-white/80 dark:bg-black/70 backdrop-blur-sm py-0.5 px-2 rounded-md shadow-md">
            <span className="text-xs font-medium">{news.source.name}</span>
          </div>
        )}
        
        {/* Gradient overlay for better text visibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-50"></div>
      </div>
      
      <div className="p-3 sm:p-4">
        {/* Title with improved mobile typography */}
        <h3 className="font-bold mb-1 sm:mb-2 text-base sm:text-lg line-clamp-2 mobile-title">{news.title}</h3>
        
        {/* Description with improved truncation for mobile */}
        <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm mb-2 sm:mb-3 line-clamp-2 sm:line-clamp-3">{news.description}</p>
        
        {/* Footer with improved spacing for mobile */}
        <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
          <span className="truncate max-w-[60%]">{formatTimeDifference(news.publishedAt)}</span>
          <div className="flex items-center space-x-1">
            <button 
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 active:scale-95 transition-transform mobile-touch-target"
              onClick={handleBookmarkToggle}
              aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
            >
              <span className="material-icons text-base">
                {isBookmarked ? 'bookmark' : 'bookmark_border'}
              </span>
            </button>
            <a 
              href={news.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 active:scale-95 transition-transform mobile-touch-target"
              aria-label="Read article"
            >
              <span className="material-icons text-base">open_in_new</span>
            </a>
            <button 
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 active:scale-95 transition-transform mobile-touch-target"
              onClick={handleShareClick}
              aria-label="Share article"
            >
              <span className="material-icons text-base">share</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Read more link - visible on hover/tap */}
      <a
        href={news.url}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/50 opacity-0 hover:opacity-100 transition-all duration-300"
      >
        <div className="bg-primary hover:bg-primary/90 text-white py-2 px-4 rounded-full font-medium shadow-lg transform transition-transform hover:scale-105 hidden md:block">
          Read Article
        </div>
      </a>
    </div>
  );
};

export default NewsCard;
