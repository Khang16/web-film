import axiosClient from "../../../services/axios";
import type { BaseResponse } from "../../../common/types/api-response.interface";
import type { IOverViewFilm } from "./types/over-view.interface";
import type { IInforFilm } from "./types/infor-film.interface";

export const overViewApi = {
  getAll(page: number): Promise<BaseResponse<IOverViewFilm[]>> {
    return axiosClient.get<BaseResponse<IOverViewFilm[]>>(
      `danh-sach/phim-moi-cap-nhat?page=${page}`,
    ) as unknown as Promise<BaseResponse<IOverViewFilm[]>>;
  },

  getFilmBySlug(slug: string): Promise<BaseResponse<IInforFilm>> {
    return axiosClient.get<BaseResponse<IInforFilm>>(`phim/${slug}`) as unknown as Promise<
      BaseResponse<IInforFilm>
    >;
  },
};
