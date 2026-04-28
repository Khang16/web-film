// utils/token-manager.js
const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

const tokenManager = {
  // Lưu access token
  setAccessToken(token: string) {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  },

  // Lấy access token
  getAccessToken() {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  // Lưu refresh token
  setRefreshToken(token: string) {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  },

  // Lấy refresh token
  getRefreshToken() {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  // Xóa tất cả token
  clearTokens() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },

  // Kiểm tra xem có token không
  hasToken() {
    return !!this.getAccessToken();
  }
};

export default tokenManager;