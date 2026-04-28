import axiosClient from "../axios";
import type { LoginPayload } from "./auth.interface";

export const loginApi = (data: LoginPayload) =>
  axiosClient.post('/auth/login', data)
