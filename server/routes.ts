import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint for deployment
  app.get('/api/health', (_req, res) => {
    res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
  });
  // TMDB API proxy routes
  app.get('/api/movies/trending/:media_type', async (req, res) => {
    try {
      const { media_type } = req.params;
      const response = await fetch(
        `https://api.themoviedb.org/3/trending/${media_type}/week?api_key=${process.env.TMDB_API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error(`TMDB API responded with ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error('Error fetching trending content:', error);
      res.status(500).json({ error: 'Failed to fetch trending content' });
    }
  });

  app.get('/api/movies/discover/:media_type', async (req, res) => {
    try {
      const { media_type } = req.params;
      const { with_genres } = req.query;
      
      const response = await fetch(
        `https://api.themoviedb.org/3/discover/${media_type}?api_key=${process.env.TMDB_API_KEY}&with_genres=${with_genres}&sort_by=popularity.desc`
      );
      
      if (!response.ok) {
        throw new Error(`TMDB API responded with ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error('Error discovering content:', error);
      res.status(500).json({ error: 'Failed to discover content' });
    }
  });

  app.get('/api/movies/genres', async (req, res) => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.TMDB_API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error(`TMDB API responded with ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error('Error fetching genres:', error);
      res.status(500).json({ error: 'Failed to fetch genres' });
    }
  });

  app.get('/api/movies/movie/:id', async (req, res) => {
    try {
      const { id } = req.params;
      
      // Fetch movie details with credits and videos
      const movieResponse = await fetch(
        `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.TMDB_API_KEY}&append_to_response=credits,videos`
      );
      
      if (!movieResponse.ok) {
        throw new Error(`TMDB API responded with ${movieResponse.status}: ${movieResponse.statusText}`);
      }
      
      const movieData = await movieResponse.json();
      
      // Additionally fetch OMDB ratings if we have an OMDB API key
      if (process.env.OMDB_API_KEY) {
        try {
          const omdbResponse = await fetch(
            `https://www.omdbapi.com/?t=${encodeURIComponent(movieData.title)}&apikey=${process.env.OMDB_API_KEY}`
          );
          
          if (omdbResponse.ok) {
            const omdbData = await omdbResponse.json();
            
            if (omdbData.Response === "True") {
              // Add ratings from OMDB
              movieData.ratings = {
                imdb: omdbData.imdbRating ? `${omdbData.imdbRating}/10` : 'N/A',
                rottenTomatoes: omdbData.Ratings?.find((r: {Source: string, Value: string}) => r.Source === "Rotten Tomatoes")?.Value || 'N/A',
                metacritic: omdbData.Metascore ? `${omdbData.Metascore}/100` : 'N/A'
              };
            }
          }
        } catch (omdbError) {
          console.error('Error fetching OMDB data:', omdbError);
          // Continue without OMDB data if there's an error
        }
      }
      
      res.json(movieData);
    } catch (error) {
      console.error('Error fetching movie details:', error);
      res.status(500).json({ error: 'Failed to fetch movie details' });
    }
  });

  app.get('/api/movies/tv/:id', async (req, res) => {
    try {
      const { id } = req.params;
      
      // Fetch TV show details with credits and videos
      const tvResponse = await fetch(
        `https://api.themoviedb.org/3/tv/${id}?api_key=${process.env.TMDB_API_KEY}&append_to_response=credits,videos`
      );
      
      if (!tvResponse.ok) {
        throw new Error(`TMDB API responded with ${tvResponse.status}: ${tvResponse.statusText}`);
      }
      
      const tvData = await tvResponse.json();
      res.json(tvData);
    } catch (error) {
      console.error('Error fetching TV details:', error);
      res.status(500).json({ error: 'Failed to fetch TV details' });
    }
  });

  app.get('/api/search', async (req, res) => {
    try {
      const { query } = req.query;
      
      if (!query || typeof query !== 'string') {
        return res.status(400).json({ error: 'Query parameter is required' });
      }
      
      const response = await fetch(
        `https://api.themoviedb.org/3/search/multi?api_key=${process.env.TMDB_API_KEY}&query=${encodeURIComponent(query)}&page=1`
      );
      
      if (!response.ok) {
        throw new Error(`TMDB API responded with ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Filter out person results and only keep movies and tv shows
      data.results = data.results
        .filter((item: {media_type: string}) => item.media_type === 'movie' || item.media_type === 'tv')
        .slice(0, 8); // Limit to 8 results
      
      res.json(data);
    } catch (error) {
      console.error('Error searching content:', error);
      res.status(500).json({ error: 'Failed to search content' });
    }
  });

  // Streaming content (for demo purposes, we'll use trending with provider filter)
  app.get('/api/movies/streaming', async (req, res) => {
    try {
      const { provider } = req.query;
      
      // For demo purposes, we'll combine some movies and TV shows
      const [moviesResponse, tvResponse] = await Promise.all([
        fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${process.env.TMDB_API_KEY}`),
        fetch(`https://api.themoviedb.org/3/trending/tv/week?api_key=${process.env.TMDB_API_KEY}`)
      ]);
      
      if (!moviesResponse.ok || !tvResponse.ok) {
        throw new Error('Failed to fetch streaming content');
      }
      
      const moviesData = await moviesResponse.json();
      const tvData = await tvResponse.json();
      
      // Combine and map with streaming providers
      const providers = ['Netflix', 'HBO Max', 'Disney+', 'Hulu', 'Prime Video', 'Apple TV+'];
      
      let results = [
        ...moviesData.results.slice(0, 10).map((movie: any) => ({
          ...movie,
          media_type: 'movie',
          provider: providers[Math.floor(Math.random() * providers.length)]
        })),
        ...tvData.results.slice(0, 10).map((show: any) => ({
          ...show,
          media_type: 'tv',
          provider: providers[Math.floor(Math.random() * providers.length)]
        }))
      ];
      
      // Filter by provider if requested
      if (provider && typeof provider === 'string') {
        results = results.filter(item => {
          const itemProvider = item.provider.toLowerCase();
          return itemProvider.includes(provider.toLowerCase());
        });
      }
      
      // Shuffle and limit
      results = results.sort(() => 0.5 - Math.random()).slice(0, 6);
      
      res.json({ results });
    } catch (error) {
      console.error('Error fetching streaming content:', error);
      res.status(500).json({ error: 'Failed to fetch streaming content' });
    }
  });

  // Movie recommendations route
  app.get('/api/movies/recommendations/:id', async (req, res) => {
    try {
      const { id } = req.params;
      
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${id}/recommendations?api_key=${process.env.TMDB_API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error(`TMDB API responded with ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error('Error fetching movie recommendations:', error);
      res.status(500).json({ error: 'Failed to fetch movie recommendations' });
    }
  });

  // NewsAPI proxy routes
  app.get('/api/news', async (req, res) => {
    try {
      const { category } = req.query;
      let query = 'movies OR tv shows OR cinema OR entertainment';
      
      // Add category filters
      if (category === 'upcoming') {
        query += ' AND (upcoming OR "coming soon" OR anticipated)';
      } else if (category === 'box_office') {
        query += ' AND ("box office" OR earnings OR revenue)';
      } else if (category === 'reviews') {
        query += ' AND (review OR rating OR critic)';
      } else if (category === 'celebrity') {
        query += ' AND (actor OR actress OR director OR celebrity)';
      }
      
      // Verify that we have an API key before making the request
      if (!process.env.NEWS_API_KEY) {
        console.error('NEWS_API_KEY is missing or undefined');
        return res.status(500).json({ 
          error: 'Missing API key configuration',
          message: 'The NewsAPI integration is currently unavailable. Please try again later.'
        });
      }
      
      // Construct the URL
      const apiUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&sortBy=publishedAt&pageSize=10&apiKey=${process.env.NEWS_API_KEY}`;
      
      console.log('Making request to NewsAPI with key present:', !!process.env.NEWS_API_KEY);
      
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`NewsAPI error (${response.status}): ${errorText}`);
        throw new Error(`NewsAPI responded with ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Attach category to each article for display
      if (data.articles && Array.isArray(data.articles)) {
        data.articles = data.articles.map((article: any) => {
          let assignedCategory;
          
          if (category && category !== 'all') {
            // Use the requested category
            switch (category) {
              case 'upcoming': assignedCategory = 'Upcoming'; break;
              case 'box_office': assignedCategory = 'Box Office'; break;
              case 'reviews': assignedCategory = 'Reviews'; break;
              case 'celebrity': assignedCategory = 'Celebrity'; break;
              default: assignedCategory = 'Latest News';
            }
          } else {
            // Assign a random category for the 'all' filter
            const categories = ['Latest News', 'Upcoming', 'Box Office', 'Reviews', 'Celebrity'];
            assignedCategory = categories[Math.floor(Math.random() * categories.length)];
          }
          
          return {
            ...article,
            category: assignedCategory
          };
        });
      }
      
      res.json(data);
    } catch (error) {
      console.error('Error fetching news:', error);
      res.status(500).json({ error: 'Failed to fetch news' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
