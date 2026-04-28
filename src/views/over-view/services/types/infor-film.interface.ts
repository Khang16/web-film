import type { Imdb, Tmdb } from "./over-view.interface";

export interface TimeInfo {
  time: string; // ISO date
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Country {
  id: string;
  name: string;
  slug: string;
}

export interface IInforFilm {
  tmdb: Tmdb;
  imdb: Imdb;
  created: TimeInfo;
  modified: TimeInfo;

  _id: string;
  name: string;
  slug: string;
  origin_name: string;
  content: string;

  type: string;
  status: string;

  poster_url: string;
  thumb_url: string;

  is_copyright: boolean;
  sub_docquyen: boolean;
  chieurap: boolean;

  trailer_url: string;

  time: string;
  episode_current: string;
  episode_total: string;

  quality: string;
  lang: string;

  notify: string;
  showtimes: string;

  year: number;
  view: number;

  actor: string[];
  director: string[];

  category: Category[];
  country: Country[];
}
