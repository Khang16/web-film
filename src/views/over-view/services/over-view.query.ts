import { useQuery, type UseQueryOptions } from "@tanstack/vue-query";
import { unref, type MaybeRef } from "vue";
import { overViewApi } from "./over-view.api";
import type { IInforFilm } from "./types/infor-film.interface";
import type { EpisodeServer } from "../../../common/types/api-response.interface";
import type { IGenre } from "./types/genre.interface";
import type { ICountry } from "./types/country.interface";
import type { IFilmPageResult } from "./over-view.api";

export const useFetchGenres = (options?: UseQueryOptions<IGenre[], Error>) => {
  return useQuery({
    queryKey: ["over-view-genres"],
    queryFn: async () => overViewApi.getGenres(),
    staleTime: 1000 * 60 * 60,
    ...options,
  });
};

export const useFetchCountries = (options?: UseQueryOptions<ICountry[], Error>) => {
  return useQuery({
    queryKey: ["over-view-countries"],
    queryFn: async () => overViewApi.getCountries(),
    staleTime: 1000 * 60 * 60,
    ...options,
  });
};

export const useFetchOverViewFilm = (
  page: MaybeRef<number>,
  genreSlug?: MaybeRef<string>,
  yearSlug?: MaybeRef<string>,
  countrySlug?: MaybeRef<string>,
  keyword?: MaybeRef<string>,
  listType?: MaybeRef<string>,
  options?: UseQueryOptions<IFilmPageResult, Error>,
) => {
  return useQuery({
    queryKey: ["over-view-film", page, genreSlug, yearSlug, countrySlug, keyword, listType],
    queryFn: async () => {
      const currentPage = unref(page);
      const currentGenre = genreSlug ? unref(genreSlug) : "";
      const currentYear = yearSlug ? unref(yearSlug) : "";
      const currentCountry = countrySlug ? unref(countrySlug) : "";
      const currentKeyword = keyword ? unref(keyword) : "";
      const currentListType = listType ? unref(listType) : "";

      if (currentKeyword) {
        return overViewApi.getFilmsByKeyword(
          currentKeyword,
          currentPage,
          currentGenre || undefined,
          currentCountry || undefined,
          currentYear || undefined,
        );
      }

      if (currentListType) {
        return overViewApi.getFilmsByListType(
          currentListType,
          currentPage,
          currentGenre || undefined,
          currentCountry || undefined,
          currentYear || undefined,
        );
      }

      if (currentYear) {
        return overViewApi.getFilmsByYear(
          currentYear,
          currentPage,
          currentGenre || undefined,
          currentCountry || undefined,
        );
      }

      if (currentCountry) {
        return overViewApi.getFilmsByCountry(
          currentCountry,
          currentPage,
          currentGenre || undefined,
          currentYear || undefined,
        );
      }

      if (currentGenre) {
        return overViewApi.getFilmsByGenre(currentGenre, currentPage);
      }

      return overViewApi.getAll(currentPage);
    },
    ...options,
  });
};

export const useFetchCountrySpotlight = (
  countrySlug: MaybeRef<string>,
  options?: UseQueryOptions<IFilmPageResult, Error>,
) => {
  return useQuery({
    queryKey: ["over-view-spotlight", countrySlug],
    queryFn: async () => {
      const currentCountry = unref(countrySlug);
      return overViewApi.getFilmsByCountry(currentCountry, 1);
    },
    staleTime: 1000 * 60 * 10,
    ...options,
  });
};

export const useFetchListSpotlight = (
  listType: MaybeRef<string>,
  options?: UseQueryOptions<IFilmPageResult, Error>,
) => {
  return useQuery({
    queryKey: ["over-view-spotlight-list", listType],
    queryFn: async () => {
      const currentListType = unref(listType);
      return overViewApi.getFilmsByListType(currentListType, 1);
    },
    staleTime: 1000 * 60 * 10,
    ...options,
  });
};

export const useGetInforFilm = (
  slug: MaybeRef<string>,
  options?: UseQueryOptions<{ movie: IInforFilm | null; episodes: EpisodeServer[] }, Error>,
) => {
  return useQuery({
    queryKey: ["infor-film", slug],
    queryFn: async () => {
      const res = await overViewApi.getFilmBySlug(unref(slug));
      return res;
    },
    ...options,
  });
};