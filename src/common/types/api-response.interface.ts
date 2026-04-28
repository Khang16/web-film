export interface EpisodeServer {
  server_name: string;
  server_data: Episode[];
}

export interface Episode {
  name: string;
  slug: string;
  filename: string;
  link_embed: string;
  link_m3u8: string;
}

export interface BaseResponse<T> {
  status: number;
  msg: string;
  items: T;
  movie?: T;
  episodes?: EpisodeServer[];
  errors?: any;
}

export interface PaginationMeta {
  totalItems: number;
  totalItemsPerPage: number;
  currentPage: number;
  totalPages: number;
}

export interface PaginatedData<T> {
  data: T[];
  meta: PaginationMeta;
}

export type PaginatedResponse<T> = BaseResponse<PaginatedData<T>>;
