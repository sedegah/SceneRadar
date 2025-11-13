import { Link } from 'wouter';

const Footer = () => {
  return (
    <footer className="bg-gray-800 dark:bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <span className="material-icons text-primary text-3xl">radar</span>
              <h2 className="text-2xl font-bold font-sans tracking-tight">
                Scene<span className="text-primary">Radar</span>
              </h2>
            </div>
            <p className="text-gray-400 mb-4">Scan the scene. Stay in the know.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Facebook">
                <span className="material-icons">facebook</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Twitter">
                <span className="material-icons">theater_comedy</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Instagram">
                <span className="material-icons">ondemand_video</span>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Navigation</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/#trending" className="hover:text-primary transition-colors">
                  Trending Radar
                </Link>
              </li>
              <li>
                <Link href="/#streaming" className="hover:text-primary transition-colors">
                  What's Streaming
                </Link>
              </li>
              <li>
                <Link href="/#genres" className="hover:text-primary transition-colors">
                  Explore Genres
                </Link>
              </li>
              <li>
                <Link href="/#news" className="hover:text-primary transition-colors">
                  Entertainment News
                </Link>
              </li>
              <li>
                <Link href="/bookmarks" className="hover:text-primary transition-colors">
                  Your Bookmarks
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">About</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-primary transition-colors">About SceneRadar</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Data Sources</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contact Us</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Data Providers</h3>
            <ul className="space-y-4 text-gray-400">
              <li className="flex items-center space-x-2">
                <img 
                  src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg" 
                  alt="TMDB" 
                  className="h-5" 
                />
                <span>TMDB API</span>
              </li>
              <li className="flex items-center space-x-2">
                <img 
                  src="https://m.media-amazon.com/images/G/01/imdb/images/desktop-favicon-2165806970._CB485916524_.ico" 
                  alt="IMDb" 
                  className="h-5" 
                />
                <span>OMDB API</span>
              </li>
              <li className="flex items-center space-x-2">
                <img 
                  src="https://newsapi.org/favicon-32x32.png" 
                  alt="NewsAPI" 
                  className="h-5" 
                />
                <span>NewsAPI</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Code Cadence. All data provided by our API partners. All rights reserved.</p>
          <p className="mt-2">This product uses the TMDB API but is not endorsed or certified by TMDB.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
