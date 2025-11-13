import { useState } from 'react';
import MovieCard from '@/components/MovieCard';
import { useTrendingMovies, useTrendingTvShows } from '@/hooks/useMovies';
import { Movie, TvShow } from '@/types';

const TrendingSection = () => {
  const [activeTab, setActiveTab] = useState<'movies' | 'tv'>('movies');
  const { 
    data: moviesData, 
    isLoading: isLoadingMovies, 
    error: moviesError 
  } = useTrendingMovies();
  
  const { 
    data: tvData, 
    isLoading: isLoadingTv, 
    error: tvError 
  } = useTrendingTvShows();
  
  const isLoading = activeTab === 'movies' ? isLoadingMovies : isLoadingTv;
  const error = activeTab === 'movies' ? moviesError : tvError;
  const data = activeTab === 'movies' ? moviesData : tvData;
  
  return (
    <section id="trending" className="mb-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold font-sans">Trending Radar</h2>
        <div className="flex space-x-3">
          <button 
            className={`px-4 py-2 rounded-full ${activeTab === 'movies' ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-800'} font-medium`}
            onClick={() => setActiveTab('movies')}
          >
            Movies
          </button>
          <button 
            className={`px-4 py-2 rounded-full ${activeTab === 'tv' ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-800'} font-medium`}
            onClick={() => setActiveTab('tv')}
          >
            TV Shows
          </button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="rounded-lg shadow-md bg-white dark:bg-darkCard">
              <div className="aspect-[2/3] bg-gray-200 dark:bg-gray-700 animate-pulse rounded-t-lg"></div>
              <div className="p-3">
                <div className="h-5 bg-gray-200 dark:bg-gray-700 animate-pulse rounded mb-2"></div>
                <div className="h-4 bg-gray-100 dark:bg-gray-800 animate-pulse rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-center">
          <span className="material-icons text-red-500 text-3xl mb-2">error_outline</span>
          <h3 className="text-lg font-medium text-red-800 dark:text-red-300 mb-1">Error loading trending content</h3>
          <p className="text-red-600 dark:text-red-400">Please try again later</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {data?.results?.slice(0, 10).map((item) => (
              <MovieCard 
                key={item.id} 
                item={item as (Movie | TvShow)} 
                mediaType={activeTab === 'movies' ? 'movie' : 'tv'} 
              />
            ))}
          </div>
          
          <div className="mt-6 text-center">
            <button className="px-6 py-2 border border-primary text-primary hover:bg-primary hover:text-white rounded-full font-medium transition-colors">
              Load More
            </button>
          </div>
        </>
      )}
    </section>
  );
};

export default TrendingSection;
