export interface Tmdb {
  type: string | null;
  id: string | number | null;
  season: number | null;
  vote_average: number;
  vote_count: number;
}

export interface Imdb {
  id: string | null;
}

export interface Modified {
  time: string; // ISO date string
}

export interface IOverViewFilm {
  tmdb: Tmdb;
  imdb: Imdb;
  modified: Modified;
  _id: string;
  name: string;
  slug: string;
  origin_name: string;
  poster_url: string;
  thumb_url: string;
  year: number;
}