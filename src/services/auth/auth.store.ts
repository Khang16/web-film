// store/auth.store.ts
import { defineStore } from "pinia";
import type { User } from "./auth.interface";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as User | null,
    token: localStorage.getItem("accessToken") || "",
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
  },

  actions: {
    setAuth(data: any) {
      this.user = data;
      this.token = data.accessToken;
      localStorage.setItem("accessToken", data.accessToken);
    },

    logout() {
      this.user = null;
      this.token = "";
      localStorage.removeItem("accessToken");
    },
  },
});