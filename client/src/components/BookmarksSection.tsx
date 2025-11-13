import { useBookmarks } from '@/hooks/useBookmarks';
import { Link } from 'wouter';

const BookmarksSection = () => {
  const { bookmarks, removeBookmark } = useBookmarks();
  const isBookmarksEmpty = bookmarks.length === 0;

  return (
    <section id="bookmarks" className="mb-12">
      <h2 className="text-2xl font-bold font-sans mb-6">Your Bookmarks</h2>
      
      <div className="bg-white dark:bg-darkCard rounded-lg p-6 shadow-md">
        {isBookmarksEmpty ? (
          <div className="empty-state text-center py-10">
            <div className="material-icons text-4xl text-gray-400 mb-2">bookmark_border</div>
            <h3 className="text-lg font-medium text-gray-500 mb-2">No bookmarks yet</h3>
            <p className="text-sm text-gray-400 mb-4">Save your favorite movies and shows to access them quickly</p>
            <Link href="/#trending" className="inline-block px-4 py-2 bg-primary text-white rounded-lg">
              Explore Trending
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
            {bookmarks.map(bookmark => (
              <div key={`${bookmark.id}-${bookmark.media_type}`} className="movie-card group relative overflow-hidden rounded-lg shadow-md transition-transform hover:-translate-y-1 duration-200">
                <div className="relative aspect-[2/3] overflow-hidden">
                  {bookmark.poster_path ? (
                    <img 
                      src={`https://image.tmdb.org/t/p/w500${bookmark.poster_path}`} 
                      alt={`${bookmark.title} poster`} 
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <span className="material-icons text-4xl text-gray-400">movie</span>
                    </div>
                  )}
                </div>
                <div className="absolute top-2 right-2">
                  <button 
                    className="p-1.5 rounded-full bg-black/50 hover:bg-black/70 text-white"
                    onClick={() => removeBookmark(bookmark.id, bookmark.media_type)}
                    aria-label="Remove bookmark"
                  >
                    <span className="material-icons text-sm">bookmark</span>
                  </button>
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-black/60">
                  <h3 className="text-white text-sm font-medium truncate">{bookmark.title}</h3>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default BookmarksSection;
