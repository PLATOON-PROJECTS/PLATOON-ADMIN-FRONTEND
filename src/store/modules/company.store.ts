import { defineStore } from "pinia";
import companyService from "../../service/company/company.service";
import {
  Create,
  Update,
} from "../../service/company/interface/company.interface";

interface State {
  // Define any state properties if needed
}

const companyStore = defineStore("company", {
  state: (): State => ({}), // Initialize your state here
  actions: {
    async fetchCompany(pageSize: number, pageNumber: number): Promise<any> {
      try {
        const response = await companyService.fetchCompany(
          pageSize,
          pageNumber
        );
        if (response.data) {
          return await Promise.resolve(response.data.data);
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
          return response;
        } else if (response.response) {
          return Promise.reject(response.response);
        } else {
          return Promise.reject(response.message);
        }
      } catch (error: any) {
        return Promise.reject(error);
      }
    },

    async companyById(organisationId: number): Promise<any> {
      try {
        const response = await companyService.companyById(organisationId);
        if (response.data) {
          return response;
        } else if (response.response) {
          return Promise.reject(response.response);
        } else {
          return Promise.reject(response.message);
        }
      } catch (error: any) {
        return Promise.reject(error);
      }
    },

    async companyCount(): Promise<any> {
      try {
        const response = await companyService.companyCount();
        if (response.data) {
          return response;
        } else if (response.response) {
          return Promise.reject(response.response);
        } else {
          return Promise.reject(response.message);
        }
      } catch (error: any) {
        return Promise.reject(error);
      }
    },

    async create(data: Create): Promise<any> {
      try {
        const response = await companyService.create(data);
        if (response.data) {
          return response;
        } else if (response.response) {
          return Promise.reject(response.response);
        } else {
          return Promise.reject(response.message);
        }
      } catch (error: any) {
        return Promise.reject(error);
      }
    },

    async update(data: Update, id: string): Promise<any> {
      try {
        const response = await companyService.update(data, id);
        if (response.data) {
          return response;
        } else if (response.response) {
          return Promise.reject(response.response);
        } else {
          return Promise.reject(response.message);
        }
      } catch (error: any) {
        return Promise.reject(error);
      }
    },

    async delete(organisationId: string): Promise<any> {
      try {
        const response = await companyService.delete(organisationId);
        if (response.data) {
          return response;
        } else if (response.response) {
          return Promise.reject(response.response);
        } else {
          return Promise.reject(response.message);
        }
      } catch (error: any) {
        return Promise.reject(error);
      }
    },

    async removeSuspension(organisationId: string): Promise<any> {
      try {
        const response = await companyService.removeSuspension(organisationId);
        if (response.data) {
          return response;
        } else if (response.response) {
          return Promise.reject(response.response);
        } else {
          return Promise.reject(response.message);
        }
      } catch (error: any) {
        return Promise.reject(error);
      }
    },

    async suspend(organisationId: string): Promise<any> {
      try {
        const response = await companyService.suspend(organisationId);
        if (response.data) {
          return response;
        } else if (response.response) {
          return Promise.reject(response.response);
        } else {
          return Promise.reject(response.message);
        }
      } catch (error: any) {
        return Promise.reject(error);
      }
    },
  },
});

export default companyStore;
