import { useState } from 'react';
import { useNews } from '@/hooks/useNews';
import NewsCard from '@/components/NewsCard';
import { News } from '@/types';

const NewsSection = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const { data, isLoading, error } = useNews(activeCategory);
  
  const categories = [
    { id: 'all', name: 'All News' },
    { id: 'upcoming', name: 'Upcoming' },
    { id: 'box_office', name: 'Box Office' },
    { id: 'reviews', name: 'Reviews' },
    { id: 'celebrity', name: 'Celebrity' }
  ];

  return (
    <section id="news" className="mb-16">
      <div className="mb-8">
        <h2 className="text-3xl font-display font-bold mb-3 text-center md:text-left">
          Entertainment <span className="text-primary">Pulse</span>
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-center md:text-left max-w-2xl mb-6">
          Stay updated with the latest news from the entertainment world
        </p>
        
        {/* Category Pills */}
        <div className="flex overflow-x-auto py-2 space-x-3 hide-scrollbar">
          {categories.map(category => (
            <button 
              key={category.id}
              className={`whitespace-nowrap px-5 py-2.5 rounded-full transition-all duration-200 ${
                activeCategory === category.id 
                  ? 'bg-primary text-white shadow-md scale-105' 
                  : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
              } font-medium text-sm`}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg animate-pulse">
              <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
              <div className="p-5">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-24 mb-3"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
                <div className="space-y-2 mb-4">
                  <div className="h-4 bg-gray-100 dark:bg-gray-600 rounded-full"></div>
                  <div className="h-4 bg-gray-100 dark:bg-gray-600 rounded-full"></div>
                  <div className="h-4 bg-gray-100 dark:bg-gray-600 rounded-full w-2/3"></div>
                </div>
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <div className="h-5 bg-gray-100 dark:bg-gray-600 rounded-full w-1/3"></div>
                  <div className="h-8 w-8 bg-gray-100 dark:bg-gray-600 rounded-full"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-800/20 rounded-xl p-8 text-center shadow-md">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 text-red-500 mb-4">
            <span className="material-icons text-3xl">error_outline</span>
          </div>
          <h3 className="text-xl font-bold text-red-800 dark:text-red-300 mb-2">News Feed Unavailable</h3>
          <p className="text-red-600 dark:text-red-400 mb-6 max-w-md mx-auto">
            We're having trouble connecting to our news sources at the moment. Please try again later.
          </p>
          <button 
            onClick={() => setActiveCategory(activeCategory)} 
            className="px-6 py-3 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-700 dark:text-red-300 rounded-full font-medium transition-colors inline-flex items-center"
          >
            <span className="material-icons mr-2 text-sm">refresh</span>
            Try Again
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.articles && Array.isArray(data.articles) 
              ? data.articles.slice(0, 6).map((article: News, index: number) => (
                <NewsCard key={index} news={article} />
              ))
              : null
            }
          </div>
          
          <div className="mt-10 text-center">
            <button className="px-8 py-3 border-2 border-primary text-primary hover:bg-primary hover:text-white rounded-xl font-bold transition-all duration-300 hover:shadow-lg inline-flex items-center">
              <span className="material-icons mr-2">article</span>
              Load More News
            </button>
          </div>
        </>
      )}
    </section>
  );
};

export default NewsSection;
