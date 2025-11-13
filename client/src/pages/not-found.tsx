import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background text-foreground">
      <div className="w-full max-w-2xl mx-4 text-center">
        <div className="mb-6">
          <span className="material-icons text-8xl text-primary">movie_filter</span>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold font-display mb-4">404: Scene Not Found</h1>
        
        <p className="text-lg md:text-xl mb-8 text-gray-600 dark:text-gray-300">
          Oops! This scene didn't make the final cut.
        </p>
        
        <p className="text-base md:text-lg mb-8">
          The page you're looking for is missing or doesn't exist. 
          Maybe it was just a blooper reel or perhaps you took a wrong turn on the set.
        </p>
        
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Link href="/" className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium">
            Back to Main Feature
          </Link>
          <button 
            onClick={() => window.history.back()}
            className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-medium"
          >
            Previous Scene
          </button>
        </div>
      </div>
    </div>
  );
}
