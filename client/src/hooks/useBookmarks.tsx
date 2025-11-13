import { useState, useEffect } from 'react';
import { BookmarkItem } from '@/types';

export const useBookmarks = () => {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  
  // Load bookmarks from localStorage on mount
  useEffect(() => {
    const storedBookmarks = localStorage.getItem('sceneradar-bookmarks');
    if (storedBookmarks) {
      try {
        setBookmarks(JSON.parse(storedBookmarks));
      } catch (error) {
        console.error('Failed to parse bookmarks from localStorage', error);
        // Reset corrupt data
        localStorage.removeItem('sceneradar-bookmarks');
      }
    }
  }, []);
  
  // Save bookmarks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('sceneradar-bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);
  
  // Add a new bookmark
  const addBookmark = (item: Omit<BookmarkItem, 'added_at'>) => {
    setBookmarks(prev => {
      // Check if already in bookmarks to prevent duplicates
      if (prev.some(bookmark => bookmark.id === item.id && bookmark.media_type === item.media_type)) {
        return prev;
      }
      
      // Add to bookmarks with timestamp
      return [...prev, { ...item, added_at: Date.now() }];
    });
  };
  
  // Remove a bookmark
  const removeBookmark = (id: number, media_type: 'movie' | 'tv') => {
    setBookmarks(prev => 
      prev.filter(bookmark => !(bookmark.id === id && bookmark.media_type === media_type))
    );
  };
  
  // Check if an item is bookmarked
  const isBookmarked = (id: number, media_type: 'movie' | 'tv') => {
    return bookmarks.some(bookmark => bookmark.id === id && bookmark.media_type === media_type);
  };
  
  // Clear all bookmarks
  const clearBookmarks = () => {
    setBookmarks([]);
  };
  
  return { 
    bookmarks, 
    addBookmark, 
    removeBookmark, 
    isBookmarked,
    clearBookmarks
  };
};
