# SceneRadar

SceneRadar is a modern movie and TV show discovery platform with ratings, news, and search functionality.

## Features

- Browse trending movies and TV shows
- Search for content across multiple platforms
- View detailed information about movies and TV shows
- Get personalized recommendations based on your preferences
- Stay updated with latest entertainment news
- Save your favorite content to bookmarks
- Responsive design for mobile and desktop

## Tech Stack

- **Frontend**: React, TailwindCSS, Shadcn/UI
- **Backend**: Node.js, Express
- **Database**: PostgreSQL with Drizzle ORM
- **APIs**: TMDB API, OMDB API, News API

## Development

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file based on `.env.example`
4. Run the development server:
   ```
   npm run dev
   ```

## Deployment on Render

SceneRadar is configured for easy deployment on Render:

1. Create a new Web Service in your Render dashboard
2. Connect your repository
3. Use the following settings:
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
   - **Environment Variables**: Add the required API keys and database URL

Alternatively, you can use the included `render.yaml` for a Blueprint deployment:

1. Push your code to GitHub
2. In Render, go to Blueprints
3. Connect your repository
4. Deploy the Blueprint

## Environment Variables

Create a `.env` file with the following variables:

```
DATABASE_URL=postgres://username:password@host:port/database
TMDB_API_KEY=your_tmdb_api_key
OMDB_API_KEY=your_omdb_api_key
NEWS_API_KEY=your_news_api_key
PORT=5000
NODE_ENV=production
```

## License

MIT