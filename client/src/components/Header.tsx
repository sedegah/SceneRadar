import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Search } from '@/components/Search';
import { Logo } from '@/components/Logo';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isScrolled, setIsScrolled] = useState(false);
  
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
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(theme);
      
      localStorage.setItem('theme', theme);
    }
  }, [theme]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <header className={`sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-700/50 transition-all duration-300 ${isScrolled ? 'shadow-lg' : 'shadow-sm'}`}>
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-16 md:h-18">
          <Link href="/" className="flex items-center group">
            <Logo className="transition-transform group-hover:scale-110 duration-300" />
          </Link>
                    ? 'bg-primary text-white shadow-md'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <span className="material-icons text-lg">{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>

          {/* Right Section: Search and Controls */}
          <div className="flex items-center space-x-2 md:space-x-3">
            {/* Search */}
            <div className="hidden sm:block">
              <Search />
          
          <div className="flex items-center space-x-2 md:space-x-3">
            <div className="hidden sm:block">
              <Search />
            </div>
            
            <button 
              onClick={toggleTheme}
              className="p-2 md:p-2.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all shadow-sm hover:shadow-md active:scale-95 touch-manipulation"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              <div className="relative w-5 h-5 flex items-center justify-center">
                <span className="material-icons text-amber-500 dark:text-transparent absolute transform transition-all duration-300 dark:rotate-180 dark:scale-0 text-base">light_mode</span>
                <span className="material-icons text-transparent dark:text-blue-400 absolute transform transition-all duration-300 -rotate-180 scale-0 dark:rotate-0 dark:scale-100 text-base">dark_mode</span>
              </div>
            </button>
          </div>
        </div>

        <div className="sm:hidden pb-3">
          <Search />
        </div>
      </div>
    </header>
  );
};

export default Header;
