import axios, { AxiosInstance } from "axios";
import authhHeader from "../../core/utils/authh.header";

class Notifications {
  private readonly request: AxiosInstance;

  constructor(request: AxiosInstance) {
    this.request = request;
  }

  private createAxiosInstance(): AxiosInstance {
    return axios.create({
      baseURL: import.meta.env.VITE_PLATOON_BASEURL,
      headers: authhHeader(),
    });
  }

  async fetchNotifications(
    userId: number,
    pageSize = 10,
    pageNumber = 1
  ): Promise<any> {
    const customRequest = this.createAxiosInstance();

    try {
      const response = await customRequest.get(
        `/Notification/retrieve-notification`,
        {
          params: {
            UserId: userId,
            PageSize: pageSize,
            PageNumber: pageNumber,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching notifications:", error);
      return Promise.reject(error);
    }
  }

  // POST method to create a new notification
  async createNotification(payload: {
    userId: number;
    roleId: number;
    organisationId: number;
    platoon: boolean;
    subject: string;
    body: string;
  }): Promise<any> {
    const customRequest = this.createAxiosInstance();

    try {
      const response = await customRequest.post(`Notification/send`, payload);
      return response.data;
    } catch (error) {
      console.error("Error creating notification:", error);
      return Promise.reject(error);
    }
  }
}

export default new Notifications(axios);
