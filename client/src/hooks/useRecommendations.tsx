import { useState, useEffect } from 'react';
import { Movie } from '@/types';
import { apiRequest } from '@/lib/queryClient';

export const useRecommendations = (movieId: number | null) => {
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!movieId) {
      setRecommendations([]);
      return;
    }

    const fetchRecommendations = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await apiRequest('GET', `/api/movies/recommendations/${movieId}`, undefined);
        const data = await response.json();
        setRecommendations(data.results || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch recommendations');
        setRecommendations([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, [movieId]);

  return {
    recommendations,
    isLoading,
    error,
  };
};