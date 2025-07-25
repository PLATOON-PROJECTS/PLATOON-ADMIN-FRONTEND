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

    async createNotification(
      payload: {
        userId: number;
        roleId: number;
        organisationId: number;
        platoon: boolean;
        subject: string;
        body: string;
      },
      limit = 10,
      page = 1
    ) {
      try {
        const response = await notificationService.createNotification(payload);
        if (response.data) {
          this.notifications = response.data.pageItems || response.data; // Adjust if your API structure differs
          return response.data;
        } else {
          return Promise.reject("No data");
        }
      } catch (error) {
        return Promise.reject(error);
      }
    },
  },
});
