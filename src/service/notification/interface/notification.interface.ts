export interface NotificationItem {
  id: number;
  userId: number;
  organisationId: number | null;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  modifiedAt: string | null;
  body: string;
  subject: string;
  isRead: boolean;
}

export interface NotificationsResponse {
  succeeded: boolean;
  message: string;
  data: {
    pageItems: NotificationItem[];
  };
}
