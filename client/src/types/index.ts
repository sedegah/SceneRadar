export interface Movie {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path: string;
  overview: string;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
  runtime?: number;
  genres?: Genre[];
}

export interface TvShow {
  id: number;
  name: string;
  poster_path: string;
  backdrop_path: string;
  overview: string;
  first_air_date: string;
  vote_average: number;
  genre_ids: number[];
  number_of_seasons?: number;
  genres?: Genre[];
}

export interface StreamingContent {
  id: number;
  title?: string;
  name?: string;
  poster_path: string;
  vote_average: number;
  overview: string;
  media_type: 'movie' | 'tv';
  provider: string;
  provider_logo?: string;
  number_of_seasons?: number;
  release_date?: string;
  first_air_date?: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface News {
  source: {
    id: string | null;
    name: string;
  };
  author: string;
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  content: string;
  category?: string;
}

export interface SearchResult {
  id: number;
  media_type: string;
  title?: string;
  name?: string;
  poster_path: string | null;
  release_date?: string;
  first_air_date?: string;
}

export interface MovieDetails extends Movie {
  credits?: {
    cast: Cast[];
    crew: Crew[];
  };
  videos?: {
    results: Video[];
  };
  budget?: number;
  revenue?: number;
  production_companies?: ProductionCompany[];
  ratings?: {
    imdb: string;
    rottenTomatoes: string;
    metacritic: string;
  };
}

export interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface Crew {
  id: number;
  name: string;
  job: string;
  profile_path: string | null;
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
}

export interface ProductionCompany {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
}

export interface ApiResponse<T> {
  page?: number;
  results: T[];
  total_pages?: number;
  total_results?: number;
}

export interface NewsApiResponse {
  status: string;
  totalResults: number;
  articles: News[];
}

export interface BookmarkItem {
  id: number;
  title: string;
  poster_path: string;
  media_type: 'movie' | 'tv';
  added_at: number;
}
