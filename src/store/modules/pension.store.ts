import { defineStore } from "pinia";
import pensionService from "../../service/pension/pension.service";

import {
  Create,
  Settings,
} from "../../service/pension/interface/pension.interface";

interface State {}
const pensionStore = defineStore("pension", {
  state: (): State => ({}),
  actions: {
    async index(): Promise<any> {
      try {
        const response = await pensionService.get();
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
    async getIssuers(): Promise<any> {
      try {
        const response = await pensionService.getIssuers();
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
    async settings(data: Settings): Promise<any> {
      try {
        const response = await pensionService.settings(data);
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
        const response = await pensionService.create(data);
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

export default pensionStore;
