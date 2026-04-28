import { notification } from 'ant-design-vue';
import tokenManager from '../common/utils/token-manager';
import notificationBadge from './notification-badge';


// Vị trí hiển thị mặc định: góc trên phải
const defaultPlacement = 'topRight';

// Style dùng chung với đơn vị rem
const baseStyle = {
  borderRadius: '0.3125rem', // 5px chuyển sang rem (5/16)
};

const notify = {
  /**
   * Hiển thị thông báo thành công (luôn hiển thị popup)
   * @param {string} description - Nội dung thông báo
   */
  success(description = '') {
    notification.success({
      message: 'Thành công',
      description,
      placement: defaultPlacement,
      duration: 1, // 1 giây
      style: {
        ...baseStyle,
        backgroundColor: '#f0fdf4', // Tailwind: green-50
      },
    });
  },

  /**
   * Xử lý lỗi:
   * - Nếu chưa đăng nhập: hiển thị popup lỗi
   * - Nếu đã đăng nhập: đưa vào badge (không hiển thị popup)
   * @param {string} description - Nội dung lỗi
   */
  error(description = '') {
    const isLogged = !!tokenManager.getAccessToken();
    if (isLogged) {
      notificationBadge.addError(description || 'Đã xảy ra lỗi');
    } else {
      notification.error({
        message: 'Lỗi',
        description: description || 'Đã xảy ra lỗi',
        placement: defaultPlacement,
        duration: 3,
        style: {
          ...baseStyle,
          backgroundColor: '#fef2f2', // Tailwind: red-50
        },
      });
    }
  },

  /**
   * Xử lý cảnh báo:
   * - Nếu chưa đăng nhập: hiển thị popup cảnh báo
   * - Nếu đã đăng nhập: đưa vào badge
   * @param {string} description - Nội dung cảnh báo
   */
  warning(description = '') {
    const isLogged = !!tokenManager.getAccessToken();
    if (isLogged) {
      notificationBadge.addWarning(description || 'Cảnh báo');
    } else {
      notification.warning({
        message: 'Cảnh báo',
        description: description || 'Cảnh báo',
        placement: defaultPlacement,
        duration: 3,
        style: {
          ...baseStyle,
          backgroundColor: '#fffbeb', // Tailwind: amber-50
        },
      });
    }
  },

  /**
   * Thông báo thông tin (luôn hiển thị popup)
   * @param {string} description - Nội dung thông báo
   */
  info(description = '') {
    notification.info({
      message: 'Thông báo',
      description,
      placement: defaultPlacement,
      duration: 2,
      style: {
        ...baseStyle,
        backgroundColor: '#eff6ff', // Tailwind: blue-50
      },
    });
  },
};

export default notify;