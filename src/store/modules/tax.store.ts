import { defineStore } from "pinia";
import taxService from "../../service/tax/tax.service";

import {
  Create,
  UpdateSettings,
} from "../../service/tax/interface/tax.interface";

interface State {}
const taxStore = defineStore("tax", {
  state: (): State => ({}),
  actions: {
    async request(): Promise<any> {
      try {
        const response = await taxService.sendRequest();
        if (response.data) {
          return await Promise.resolve(response);
        } else if (response.response) {
          return await Promise.reject(response.response);
        } else {
          return await Promise.reject(response.message);
        }
      } catch (error: any) {
        return await Promise.reject(error);
      }
    },
    async delete(id:any): Promise<any> {
      try {
        const response = await taxService.delete(id);
        if (response.data) {
          return await Promise.resolve(response);
        } else if (response.response) {
          return await Promise.reject(response.response);
        } else {
          return await Promise.reject(response.message);
        }
      } catch (error: any) {
        return await Promise.reject(error);
      }
    },
    async download(): Promise<any> {
      try {
        const response = await taxService.download();
        if (response.data) {
          return await Promise.resolve(response);
        } else if (response.response) {
          return await Promise.reject(response.response);
        } else {
          return await Promise.reject(response.message);
        }
      } catch (error: any) {
        return await Promise.reject(error);
      }
    },
    async index(): Promise<any> {
      try {
        const response = await taxService.getAll();
        if (response.data) {
          return await Promise.resolve(response);
        } else if (response.response) {
          return await Promise.reject(response.response);
        } else {
          return await Promise.reject(response.message);
        }
      } catch (error: any) {
        return await Promise.reject(error);
      }
    },
    async create(data: Create[]): Promise<any> {
      try {
        const response = await taxService.create(data);
        if (response.data) {
          return await Promise.resolve(response);
        } else if (response.response) {
          return await Promise.reject(response.response);
        } else {
          return await Promise.reject(response.message);
        }
      } catch (error: any) {
        return await Promise.reject(error);
      }
    },
    async updateSettings(data: UpdateSettings): Promise<any> {
      try {
        const response = await taxService.updateSettings(data);
        if (response.data) {
          return await Promise.resolve(response);
        } else if (response.response) {
          return await Promise.reject(response.response);
        } else {
          return await Promise.reject(response.message);
        }
      } catch (error: any) {
        return await Promise.reject(error);
      }
    },
  },
});

export default taxStore;
