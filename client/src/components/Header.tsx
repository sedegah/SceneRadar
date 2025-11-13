import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Search } from '@/components/Search';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [location] = useLocation();
  
  // Initialize theme from localStorage or system preference
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
      if (savedTheme === 'light' || savedTheme === 'dark') {
        setTheme(savedTheme);
      } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setTheme('dark');
      }
    }
  }, []);
  
  // Apply theme changes to document and localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Update document class
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(theme);
      
      // Save to localStorage
      localStorage.setItem('theme', theme);
    }
  }, [theme]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const isActive = (path: string) => location === path;

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="material-icons text-primary text-3xl">radar</span>
            <h1 className="text-2xl font-bold font-sans tracking-tight">
              Scene<span className="text-primary">Radar</span>
            </h1>
          </Link>
          
          {/* Search and Theme Toggle */}
          <div className="flex items-center space-x-3">
            {/* Search */}
            <Search />
            
            {/* Theme Toggle - Smaller button */}
            <button 
              onClick={toggleTheme}
              className="p-1.5 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all shadow-sm flex items-center justify-center"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              <div className="relative w-5 h-5 flex items-center justify-center overflow-hidden">
                <span className="material-icons text-amber-500 dark:text-transparent absolute transform transition-all duration-300 dark:rotate-90 dark:scale-0 text-sm">light_mode</span>
                <span className="material-icons text-transparent dark:text-blue-400 absolute transform transition-all duration-300 -rotate-90 scale-0 dark:rotate-0 dark:scale-100 text-sm">dark_mode</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
