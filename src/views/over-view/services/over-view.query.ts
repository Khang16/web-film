import { useQuery, type UseQueryOptions } from "@tanstack/vue-query";
import { unref, type MaybeRef } from "vue";
import type { IOverViewFilm } from "./types/over-view.interface";
import { overViewApi } from "./over-view.api";
import type { IInforFilm } from "./types/infor-film.interface";
import type { BaseResponse } from "../../../common/types/api-response.interface";

export const useFetchOverViewFilm = (page: MaybeRef<number>, options?: UseQueryOptions<IOverViewFilm[], Error>) => {
  return useQuery({
    queryKey: ["over-view-film", page],
    queryFn: async () => {
      const res = await overViewApi.getAll(unref(page));
      return res.items;
    },
    ...options,
  });
};

export const useGetInforFilm = (
  slug: MaybeRef<string>,
  options?: UseQueryOptions<BaseResponse<IInforFilm>, Error>,
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