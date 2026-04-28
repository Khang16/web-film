// axios-client.js
import axios, { type AxiosRequestConfig } from 'axios';
import tokenManager from '../common/utils/token-manager';
import notify from './notification';
import { handleRefreshToken } from '../common/utils/refresh-token';


export interface IOriginRequest extends AxiosRequestConfig {
  _retry: boolean;
}

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://phimapi.com/',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// ----- Request Interceptor -----
axiosClient.interceptors.request.use(
  (config) => {
    // Thêm access token vào header nếu có
    const accessToken = tokenManager.getAccessToken();
    if (accessToken && config.headers) {
      config.headers['Authorization'] = 'Bearer ' + accessToken;
    }

    // Tuỳ chọn: chỉ chấp nhận status 2xx
    config.validateStatus = (status) => status >= 200 && status < 300;

    return config;
  },
  (error) => Promise.reject(error)
);

// ----- Response Interceptor -----
axiosClient.interceptors.response.use(
  (response) => {
    // Tuỳ chỉnh dữ liệu trả về theo format API của bạn
    // Nếu API trả về { data, message, ... } thì có thể xử lý ở đây
    // Hiện tại giữ nguyên response.data (giống code cũ của bạn)
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;

    // Nếu không có response (mạng, timeout...)
    if (!error.response) {
      notify.error('Không thể kết nối đến máy chủ. Vui lòng kiểm tra mạng.');
      return Promise.reject(error);
    }

    const status = error.response.status;

    // Trường hợp 401 và chưa thử retry -> xử lý refresh token
    if (status === 401 && !originalRequest._retry) {
      return handleRefreshToken(originalRequest);
    }

    // Các mã lỗi khác
    if (status === 403) {
      notify.warning('Bạn không có quyền thực hiện hành động này.');
    } else if (status === 404) {
      notify.warning('Không tìm thấy tài nguyên hoặc đường dẫn yêu cầu.');
    } else if (status >= 500) {
      notify.error('Máy chủ gặp sự cố. Vui lòng thử lại sau ít phút.');
    } else {
      const message = error.response.data?.message || error.message || 'Đã có lỗi xảy ra.';
      notify.error(message);
    }

    return Promise.reject(error.response || error);
  }
);

export default axiosClient;