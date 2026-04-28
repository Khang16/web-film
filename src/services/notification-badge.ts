import { reactive } from 'vue';

// Định nghĩa kiểu cho một thông báo (lỗi/cảnh báo)
export interface NotificationItem {
  id: number;
  message: string;
  timestamp: Date;
}

// Định nghĩa kiểu cho state
export interface NotificationBadgeState {
  errors:  NotificationItem[];
  warnings:  NotificationItem[];
}

// State dùng chung (reactive)
const state = reactive<NotificationBadgeState>({
  errors: [],
  warnings: [],
});

const notificationBadge = {
  /**
   * Đọc state (chỉ đọc) để dùng trong component
   */
  // get state(): Readonly<NotificationBadgeState> {
  //   return readonly(state);
  // },

  /**
   * Thêm một lỗi vào danh sách
   * @param message - Nội dung lỗi
   */
  addError(message: string): void {
    state.errors.push({
      id: Date.now() + Math.random(),
      message,
      timestamp: new Date(),
    });
  },

  /**
   * Thêm một cảnh báo vào danh sách
   * @param message - Nội dung cảnh báo
   */
  addWarning(message: string): void {
    state.warnings.push({
      id: Date.now() + Math.random(),
      message,
      timestamp: new Date(),
    });
  },

  /**
   * Xoá một lỗi theo id
   * @param id - id của lỗi cần xoá
   */
  removeError(id: number): void {
    const index = state.errors.findIndex((item) => item.id === id);
    if (index !== -1) state.errors.slice(index, 1);
  },

  /**
   * Xoá một cảnh báo theo id
   * @param id - id của cảnh báo cần xoá
   */
  removeWarning(id: number): void {
    const index = state.warnings.findIndex((item) => item.id === id);
    if (index !== -1) state.warnings.slice(index, 1);
  },

  /**
   * Xoá toàn bộ lỗi và cảnh báo
   */
  clearAll(): void {
    state.errors = [];
    state.warnings = [];
  },
};

export default notificationBadge;