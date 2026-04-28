import { loginApi } from "../services/auth/auth.api";
import { useAuthStore } from "../services/auth/auth.store";

export function useAuth() {
	const authStore = useAuthStore();

	const login = async (formData: { username: string; password: string }) => {
		const response = await loginApi(formData);
		const payload = response.data ?? response;

		authStore.setAuth(payload);

		return payload;
	};

	return {
		login,
		logout: authStore.logout,
		user: authStore.user,
		isAuthenticated: authStore.isAuthenticated,
	};
}