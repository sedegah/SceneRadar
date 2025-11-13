import { useState } from 'react';
import { useStreamingContent } from '@/hooks/useMovies';
import { StreamingContent } from '@/types';
import StreamingCard from '@/components/StreamingCard';

const StreamingSection = () => {
  const [activeProvider, setActiveProvider] = useState('all');
  const { data, isLoading, error } = useStreamingContent(
    activeProvider !== 'all' ? activeProvider : undefined
  );
  
  const providers = [
    { id: 'all', name: 'All Services' },
    { id: 'netflix', name: 'Netflix' },
    { id: 'hbo', name: 'HBO Max' },
    { id: 'disney', name: 'Disney+' },
    { id: 'hulu', name: 'Hulu' },
    { id: 'prime', name: 'Prime Video' },
    { id: 'apple', name: 'Apple TV+' }
  ];

  return (
    <section id="streaming" className="mb-16">
      <div className="mb-8">
        <h2 className="text-3xl font-display font-bold mb-3 text-center md:text-left">
          What's <span className="text-primary">Streaming</span> Now
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-center md:text-left max-w-2xl mb-6">
          Browse popular titles from your favorite streaming services
        </p>
      </div>
      
      {/* Provider Tabs - improved for mobile */}
      <div className="mb-8 flex overflow-x-auto space-x-3 py-2 hide-scrollbar">
        {providers.map(provider => (
          <button 
            key={provider.id}
            className={`whitespace-nowrap px-4 py-2.5 rounded-full transition-all duration-200 ${
              activeProvider === provider.id 
                ? 'bg-primary text-white shadow-md scale-105' 
                : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
            } font-medium text-sm md:text-base`}
            onClick={() => setActiveProvider(provider.id)}
          >
            {provider.name}
          </button>
        ))}
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 mobile-card-grid">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md animate-pulse">
              <div className="w-1/3 bg-gray-200 dark:bg-gray-700"></div>
              <div className="w-2/3 p-4">
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-4 bg-gray-100 dark:bg-gray-600 rounded w-1/3 mb-3"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-100 dark:bg-gray-600 rounded"></div>
                  <div className="h-3 bg-gray-100 dark:bg-gray-600 rounded"></div>
                  <div className="h-3 bg-gray-100 dark:bg-gray-600 rounded w-2/3"></div>
                </div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mt-4"></div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-800/20 rounded-xl p-8 text-center shadow-md">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 text-red-500 mb-4">
            <span className="material-icons text-3xl">error_outline</span>
          </div>
          <h3 className="text-xl font-bold text-red-800 dark:text-red-300 mb-2">Content Unavailable</h3>
          <p className="text-red-600 dark:text-red-400 mb-6 max-w-md mx-auto">
            We're having trouble connecting to our streaming partners. Please check back later.
          </p>
          <button 
            onClick={() => setActiveProvider(activeProvider)} 
            className="px-6 py-3 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-700 dark:text-red-300 rounded-full font-medium transition-colors inline-flex items-center"
          >
            <span className="material-icons mr-2 text-sm">refresh</span>
            Try Again
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 mobile-card-grid">
          {data?.results?.slice(0, 6).map((item: StreamingContent) => (
            <StreamingCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </section>
  );
};

export default StreamingSection;
