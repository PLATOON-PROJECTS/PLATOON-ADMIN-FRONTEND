import { defineStore } from "pinia";
import companyService from "../../service/company/company.service";
import {
  Create,
  Update,
} from "../../service/company/interface/company.interface";

interface State {}
const companyStore = defineStore("company", {
  state: (): State => ({}),
  actions: {
    async index(): Promise<any> {
      try {
        const response = await companyService.index();
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

    async switch(id: string): Promise<any> {
      try {
        const response = await companyService.switch(id);
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

    async show(id: string): Promise<any> {
      try {
        const response = await companyService.show(id);
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
    async create(data: Create): Promise<any> {
      try {
        const response = await companyService.create(data);
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

    async update(data: Update, id: string): Promise<any> {
      try {
        const response = await companyService.update(data, id);
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
    async delete(id: string): Promise<any> {
      try {
        const response = await companyService.delete(id);
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

export default companyStore;
