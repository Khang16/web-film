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

const extractItems = <T>(payload: unknown): T[] => {
  if (Array.isArray(payload)) {
    return payload as T[];
  }

  if (!payload || typeof payload !== "object") {
    return [];
  }

  const directItems = (payload as { items?: unknown }).items;
  if (Array.isArray(directItems)) {
    return directItems as T[];
  }

  const nestedData = (payload as { data?: unknown }).data;
  if (Array.isArray(nestedData)) {
    return nestedData as T[];
  }

  if (nestedData && typeof nestedData === "object") {
    const nestedItems = (nestedData as { items?: unknown }).items;
    if (Array.isArray(nestedItems)) {
      return nestedItems as T[];
    }
  }

  return [];
};

const filter18PlusItems = (items: IOverViewFilm[] = []): IOverViewFilm[] => {
  return items.filter((item: any) => {
    // Filter by category if available (from v1/api)
    if (item.category && Array.isArray(item.category)) {
      if (item.category.some((c: any) => c.slug === "phim-18" || c.slug === "18-plus" || c.slug === "18")) {
        return false;
      }
    }
    
    // Filter by name or origin_name as a fallback
    const nameStr = (item.name || "").toLowerCase();
    const originStr = (item.origin_name || "").toLowerCase();
    if (nameStr.includes("18+") || originStr.includes("18+")) {
      return false;
    }
    return true;
  });
};

export const overViewApi = {
  async getGenres(): Promise<IGenre[]> {
    const response = await axiosClient.get<unknown>("the-loai");
    const genres = extractItems<IGenre>(response);
    return genres.filter((g) => g.slug !== "phim-18" && g.slug !== "18-plus");
  },

  async getCountries(): Promise<ICountry[]> {
    const response = await axiosClient.get<unknown>("quoc-gia");
    return extractItems<ICountry>(response);
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
      items: filter18PlusItems(response.items ?? []),
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

    const movie = response.movie ?? null;
    let is18Plus = false;
    
    if (movie) {
      if (movie.category && Array.isArray(movie.category)) {
        is18Plus = movie.category.some(c => c.slug === "phim-18" || c.slug === "18-plus" || c.slug === "18");
      }
      if (!is18Plus) {
        const nameStr = (movie.name || "").toLowerCase();
        const originStr = (movie.origin_name || "").toLowerCase();
        if (nameStr.includes("18+") || originStr.includes("18+")) {
          is18Plus = true;
        }
      }
    }

    return {
      movie: is18Plus ? null : movie,
      episodes: is18Plus ? [] : (response.episodes ?? []),
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
      items: filter18PlusItems(response.data?.items ?? []),
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
      items: filter18PlusItems(response.data?.items ?? []),
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
      items: filter18PlusItems(response.data?.items ?? []),
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
      items: filter18PlusItems(response.data?.items ?? []),
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
      items: filter18PlusItems(response.data?.items ?? []),
      pagination: normalizePagination(response.data?.params?.pagination),
    };
  },
};
