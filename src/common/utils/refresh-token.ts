// utils/refresh-token.ts
import tokenManager from './token-manager';
import notify from '../../services/notification';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import axios from 'axios';

// Mở rộng AxiosRequestConfig để thêm thuộc tính _retry (đánh dấu đã thử refresh)
export interface IOriginRequest extends AxiosRequestConfig {
  _retry?: boolean;
}

// Kiểu cho hàng đợi (queue) các request đang chờ refresh token
interface QueueItem {
  resolve: (value: any) => void;
  reject: (reason?: any) => void;
}

let isRefreshing = false;
let failedQueue: QueueItem[] = [];

const processQueue = (error: any, token: string | null = null): void => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

export const handleRefreshToken = async (
  originalRequest: IOriginRequest
): Promise<AxiosResponse> => {
  // Nếu đang refresh, đưa request vào hàng đợi
  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      failedQueue.push({ resolve, reject });
    })
      .then((token) => {
        // Gắn token mới vào request ban đầu
        if (originalRequest.headers) {
          originalRequest.headers['Authorization'] = 'Bearer ' + token;
        }
        return axios(originalRequest);
      })
      .catch((err) => Promise.reject(err));
  }

  isRefreshing = true;
  originalRequest._retry = true;

  const refreshToken = tokenManager.getRefreshToken();
  if (!refreshToken) {
    // Không có refresh token → xoá token cũ và chuyển hướng đăng nhập
    tokenManager.clearTokens();
    notify.error('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
    window.location.href = '/login'; // tuỳ chỉnh theo router của bạn
    return Promise.reject(new Error('No refresh token'));
  }

  try {
    // Gọi API refresh token (thay URL và payload cho đúng với backend)
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/auth/refresh`,
      { refreshToken }
    );

    // Tuỳ chỉnh theo cấu trúc response thực tế của API
    const newAccessToken = response.data?.data?.accessToken;
    const newRefreshToken = response.data?.data?.refreshToken;

    if (newAccessToken) {
      tokenManager.setAccessToken(newAccessToken);
      if (newRefreshToken) tokenManager.setRefreshToken(newRefreshToken);

      // Gắn token mới vào request gốc
      if (originalRequest.headers) {
        originalRequest.headers['Authorization'] = 'Bearer ' + newAccessToken;
      }

      // Xử lý hàng đợi thành công
      processQueue(null, newAccessToken);

      // Thực hiện lại request ban đầu
      return axios(originalRequest);
    } else {
      throw new Error('Refresh token response invalid');
    }
  } catch (error) {
    // Xử lý hàng đợi thất bại
    processQueue(error, null);
    tokenManager.clearTokens();
    notify.error('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
    window.location.href = '/login';
    return Promise.reject(error);
  } finally {
    isRefreshing = false;
  }
};