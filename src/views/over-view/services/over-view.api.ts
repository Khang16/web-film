import axiosClient from "../../../services/axios";
import type { PaginationMeta } from "../../../common/types/api-response.interface";
import type { IOverViewFilm } from "./types/over-view.interface";
import type { IInforFilm } from "./types/infor-film.interface";
import type { IGenre } from "./types/genre.interface";
import type { ICountry } from "./types/country.interface";

export interface IFilmPageResult {
  items: IOverViewFilm[];
  pagination: PaginationMeta;
}

const emptyPagination: PaginationMeta = {
  totalItems: 0,
  totalItemsPerPage: 0,
  currentPage: 1,
  totalPages: 1,
};

const normalizePagination = (pagination?: Partial<PaginationMeta>): PaginationMeta => ({
  totalItems: pagination?.totalItems ?? 0,
  totalItemsPerPage: pagination?.totalItemsPerPage ?? 0,
  currentPage: pagination?.currentPage ?? 1,
  totalPages: pagination?.totalPages ?? 1,
});

export const overViewApi = {
  async getGenres(): Promise<IGenre[]> {
    const response = await axiosClient.get<IGenre[]>("the-loai") as unknown as IGenre[];
    return Array.isArray(response) ? response : [];
  },

  async getCountries(): Promise<ICountry[]> {
    const response = await axiosClient.get<ICountry[]>("quoc-gia") as unknown as ICountry[];
    return Array.isArray(response) ? response : [];
  },

  async getAll(page: number): Promise<IFilmPageResult> {
    const response = await axiosClient.get<{
      items?: IOverViewFilm[];
      pagination?: PaginationMeta;
    }>(`danh-sach/phim-moi-cap-nhat?page=${page}`) as unknown as {
      items?: IOverViewFilm[];
      pagination?: PaginationMeta;
    };

    return {
      items: response.items ?? [],
      pagination: normalizePagination(response.pagination ?? emptyPagination),
    };
  },

  async getFilmBySlug(slug: string): Promise<{ movie: IInforFilm | null; episodes: any[] }> {
    const response = await axiosClient.get<{
      movie?: IInforFilm | null;
      episodes?: any[];
    }>(`phim/${slug}`) as unknown as {
      movie?: IInforFilm | null;
      episodes?: any[];
    };

    return {
      movie: response.movie ?? null,
      episodes: response.episodes ?? [],
    };
  },

  async getFilmsByGenre(genreSlug: string, page: number): Promise<IFilmPageResult> {
    const response = await axiosClient.get<{
      data?: {
        items?: IOverViewFilm[];
        params?: {
          pagination?: PaginationMeta;
        };
      };
    }>(
      `v1/api/the-loai/${genreSlug}?page=${page}&sort_field=modified.time&sort_type=desc&sort_lang=vietsub&limit=10`,
    ) as unknown as {
      data?: {
        items?: IOverViewFilm[];
        params?: {
          pagination?: PaginationMeta;
        };
      };
    };

    return {
      items: response.data?.items ?? [],
      pagination: normalizePagination(response.data?.params?.pagination),
    };
  },

  async getFilmsByYear(
    year: string,
    page: number,
    categorySlug?: string,
    countrySlug?: string,
  ): Promise<IFilmPageResult> {
    const queryParts = new URLSearchParams({
      page: String(page),
      sort_field: "modified.time",
      sort_type: "desc",
      sort_lang: "vietsub",
      limit: "10",
    });

    if (categorySlug) {
      queryParts.set("category", categorySlug);
    }

    if (countrySlug) {
      queryParts.set("country", countrySlug);
    }

    const response = await axiosClient.get<{
      data?: {
        items?: IOverViewFilm[];
        params?: {
          pagination?: PaginationMeta;
        };
      };
    }>(`v1/api/nam/${year}?${queryParts.toString()}`) as unknown as {
      data?: {
        items?: IOverViewFilm[];
        params?: {
          pagination?: PaginationMeta;
        };
      };
    };

    return {
      items: response.data?.items ?? [],
      pagination: normalizePagination(response.data?.params?.pagination),
    };
  },

  async getFilmsByCountry(
    countrySlug: string,
    page: number,
    categorySlug?: string,
    yearSlug?: string,
  ): Promise<IFilmPageResult> {
    const queryParts = new URLSearchParams({
      page: String(page),
      sort_field: "modified.time",
      sort_type: "desc",
      sort_lang: "vietsub",
      limit: "10",
    });

    if (categorySlug) {
      queryParts.set("category", categorySlug);
    }

    if (yearSlug) {
      queryParts.set("year", yearSlug);
    }

    const response = await axiosClient.get<{
      data?: {
        items?: IOverViewFilm[];
        params?: {
          pagination?: PaginationMeta;
        };
      };
    }>(`v1/api/quoc-gia/${countrySlug}?${queryParts.toString()}`) as unknown as {
      data?: {
        items?: IOverViewFilm[];
        params?: {
          pagination?: PaginationMeta;
        };
      };
    };

    return {
      items: response.data?.items ?? [],
      pagination: normalizePagination(response.data?.params?.pagination),
    };
  },

  async getFilmsByKeyword(
    keyword: string,
    page: number,
    categorySlug?: string,
    countrySlug?: string,
    yearSlug?: string,
  ): Promise<IFilmPageResult> {
    const queryParts = new URLSearchParams({
      keyword,
      page: String(page),
      sort_field: "modified.time",
      sort_type: "desc",
      sort_lang: "vietsub",
      limit: "10",
    });

    if (categorySlug) {
      queryParts.set("category", categorySlug);
    }

    if (countrySlug) {
      queryParts.set("country", countrySlug);
    }

    if (yearSlug) {
      queryParts.set("year", yearSlug);
    }

    const response = await axiosClient.get<{
      data?: {
        items?: IOverViewFilm[] | null;
        params?: {
          pagination?: PaginationMeta;
        };
      };
    }>(`v1/api/tim-kiem?${queryParts.toString()}`) as unknown as {
      data?: {
        items?: IOverViewFilm[] | null;
        params?: {
          pagination?: PaginationMeta;
        };
      };
    };

    return {
      items: response.data?.items ?? [],
      pagination: normalizePagination(response.data?.params?.pagination),
    };
  },

  async getFilmsByListType(
    listType: string,
    page: number,
    categorySlug?: string,
    countrySlug?: string,
    yearSlug?: string,
  ): Promise<IFilmPageResult> {
    const queryParts = new URLSearchParams({
      page: String(page),
      sort_field: "modified.time",
      sort_type: "desc",
      sort_lang: "vietsub",
      limit: "10",
    });

    if (categorySlug) {
      queryParts.set("category", categorySlug);
    }

    if (countrySlug) {
      queryParts.set("country", countrySlug);
    }

    if (yearSlug) {
      queryParts.set("year", yearSlug);
    }

    const response = await axiosClient.get<{
      data?: {
        items?: IOverViewFilm[] | null;
        params?: {
          pagination?: PaginationMeta;
        };
      };
    }>(`v1/api/danh-sach/${listType}?${queryParts.toString()}`) as unknown as {
      data?: {
        items?: IOverViewFilm[] | null;
        params?: {
          pagination?: PaginationMeta;
        };
      };
    };

    return {
      items: response.data?.items ?? [],
      pagination: normalizePagination(response.data?.params?.pagination),
    };
  },
};
