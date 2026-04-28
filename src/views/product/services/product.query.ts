import { useQuery, type UseQueryOptions } from "@tanstack/vue-query";
import { productApi } from "./product.api";
import type { Product } from "./product.interface";

export const useFetchProducts = (options?: UseQueryOptions<Product[], Error>) => {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await productApi.getAll();
      return res.products as Product[];
    },
    ...options,
  });
};
