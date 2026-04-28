import axios from "axios";
import type { Product } from "./product.interface";

export const productApi = {
  getAll(): Promise<{ products: Product[] }> {
    return axios.get<{ products: Product[] }>("https://dummyjson.com/products").then((response) => response.data);
  },
};
