import { useQuery } from '@tanstack/react-query';
import { News, NewsApiResponse } from '@/types';

// Fetch all entertainment news
export const useNews = (category: string = 'all') => {
  const endpoint = category !== 'all' 
    ? `/api/news?category=${category}` 
    : '/api/news';
    
  return useQuery<NewsApiResponse>({
    queryKey: [endpoint],
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 15, // 15 minutes
  });
};
