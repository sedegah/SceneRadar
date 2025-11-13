import { useQuery } from '@tanstack/react-query';
import { Movie, TvShow, Genre, MovieDetails, ApiResponse, StreamingContent } from '@/types';

// Fetch trending movies
export const useTrendingMovies = () => {
  return useQuery<ApiResponse<Movie>>({
    queryKey: ['/api/movies/trending/movie'],
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Fetch trending TV shows
export const useTrendingTvShows = () => {
  return useQuery({
    queryKey: ['/api/movies/trending/tv'],
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Fetch movies by genre
export const useMoviesByGenre = (genreId: number) => {
  return useQuery({
    queryKey: [`/api/movies/discover/movie?with_genres=${genreId}`],
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 10, // 10 minutes
    enabled: !!genreId,
  });
};

// Fetch movie details
export const useMovieDetails = (movieId: number) => {
  return useQuery({
    queryKey: [`/api/movies/movie/${movieId}`],
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 10, // 10 minutes
    enabled: !!movieId,
  });
};

// Fetch TV show details
export const useTvDetails = (tvId: number) => {
  return useQuery({
    queryKey: [`/api/movies/tv/${tvId}`],
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 10, // 10 minutes
    enabled: !!tvId,
  });
};

// Fetch streaming content
export const useStreamingContent = (provider: string = '') => {
  const endpoint = provider 
    ? `/api/movies/streaming?provider=${provider}` 
    : '/api/movies/streaming';
    
  return useQuery<{results: StreamingContent[]}>({
    queryKey: [endpoint],
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
};

// Fetch movie genres
export const useGenres = () => {
  return useQuery({
    queryKey: ['/api/movies/genres'],
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};
