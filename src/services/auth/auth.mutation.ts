import { useMutation } from "@tanstack/vue-query"
import { loginApi } from "./auth.api";
import type { LoginPayload } from "./auth.interface";

export const useLogin = () => {
  return useMutation({
    mutationFn: (data: LoginPayload) => loginApi(data),
  });
};