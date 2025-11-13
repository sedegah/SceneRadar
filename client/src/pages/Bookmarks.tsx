import { useBookmarks } from '@/hooks/useBookmarks';
import { Link } from 'wouter';
import { useState } from 'react';

const Bookmarks = () => {
  const { bookmarks, removeBookmark, clearBookmarks } = useBookmarks();
  const [showConfirm, setShowConfirm] = useState(false);
  
  const handleClearAll = () => {
    setShowConfirm(true);
  };
  
  const confirmClearAll = () => {
    clearBookmarks();
    setShowConfirm(false);
  };
  
  const cancelClearAll = () => {
    setShowConfirm(false);
  };

  return (
    <main className="container mx-auto px-4 py-6">
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Your Bookmarks</h1>
        {bookmarks.length > 0 && (
          <button 
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
            onClick={handleClearAll}
          >
            Clear All
          </button>
        )}
      </div>
      
      {/* Confirmation Dialog */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-white dark:bg-darkCard rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Clear all bookmarks?</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              This action cannot be undone. All your saved bookmarks will be permanently removed.
            </p>
            <div className="flex justify-end space-x-3">
              <button 
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                onClick={cancelClearAll}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 bg-red-500 text-white rounded-lg"
                onClick={confirmClearAll}
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}
      
      {bookmarks.length === 0 ? (
        <div className="bg-white dark:bg-darkCard rounded-lg p-8 shadow-md text-center">
          <div className="material-icons text-6xl text-gray-400 mb-4">bookmark_border</div>
          <h2 className="text-2xl font-bold mb-3">No bookmarks yet</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
            Start exploring movies and TV shows, and save your favorites to access them quickly.
          </p>
          <Link href="/">
            <a className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
              Start Exploring
            </a>
          </Link>
        </div>
      ) : (
        <>
          <div className="mb-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
              {bookmarks.map(bookmark => (
                <div key={`${bookmark.id}-${bookmark.media_type}`} className="relative overflow-hidden rounded-lg shadow-lg bg-white dark:bg-darkCard transition-transform hover:-translate-y-1 duration-200">
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
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end">
                      <div className="p-3 w-full">
                        <button 
                          className="w-full bg-primary hover:bg-primary/90 text-white py-2 rounded-lg flex items-center justify-center space-x-1"
                          onClick={() => {
                            // Fire custom event to open modal
                            const event = new CustomEvent('openMovieModal', { 
                              detail: { id: bookmark.id, mediaType: bookmark.media_type } 
                            });
                            document.dispatchEvent(event);
                          }}
                        >
                          <span className="material-icons text-sm">info</span>
                          <span>Details</span>
                        </button>
                      </div>
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
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium mb-1 truncate-2">{bookmark.title}</h3>
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>{bookmark.media_type === 'movie' ? 'Movie' : 'TV Show'}</span>
                      <span>
                        {new Date(bookmark.added_at).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </main>
  );
};

export default Bookmarks;
