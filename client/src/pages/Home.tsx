import HeroSection from '@/components/HeroSection';
import TrendingSection from '@/components/TrendingSection';
import StreamingSection from '@/components/StreamingSection';
import GenreSection from '@/components/GenreSection';
import RecommendationsSection from '@/components/RecommendationsSection';
import NewsSection from '@/components/NewsSection';
import BookmarksSection from '@/components/BookmarksSection';

const Home = () => {
  return (
    <main className="container mx-auto px-4 py-6">
      <HeroSection />
      <TrendingSection />
      <StreamingSection />
      <GenreSection />
      <RecommendationsSection />
      <NewsSection />
      <BookmarksSection />
    </main>
  );
};

export default Home;
