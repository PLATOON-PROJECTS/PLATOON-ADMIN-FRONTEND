import { defineStore } from "pinia";
import { NotificationItem } from "../../service/notification/interface/notification.interface";
import notificationService from "../../service/notification/notification.service";

interface NotificationState {
  notifications: NotificationItem[];
  total: number;
  loading: boolean;
}

export const useNotificationStore = defineStore("notification", {
  state: (): NotificationState => ({
    notifications: [],
    total: 0,
    loading: false,
  }),

  actions: {
    async getNotifications(userId: number, pageSize = 10, pageNumber = 1) {
      this.loading = true;
      try {
        const response = await notificationService.fetchNotifications(
          userId,
          pageSize,
          pageNumber
        );
        this.notifications = response.data.pageItems;
        this.total = response.data.totalCount ?? this.notifications.length;
        return response;
      } catch (error) {
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
});
