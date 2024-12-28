import { defineStore } from "pinia";
import cached from "../../composables/swr_cache";
import groupService from "../../service/group/group.service";
import { Create, Update } from "../../service/group/interface/group.interface";

interface State {}
const groupStore = defineStore("group", {
  state: (): State => ({}),
  actions: {
    async index(organisationId: number, pageSize: number, pageNumber: number): Promise<any> {
      try {
        
        const response = await groupService.index(organisationId, pageSize, pageNumber);
        // console.log("this also fired");
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

    async totalDepartment(organisationId: number): Promise<any> {
      try {
        
        const response = await groupService.totalDepartment(organisationId);
        // console.log("this also fired");
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


    // group.store.ts

    async fetchEmployeesCount(organisationId: number, departmentId: number): Promise<any> {
      try {
        const response = await groupService.fetchEmployeesCount(organisationId, departmentId);
        if (response.data) {
          return await Promise.resolve(response.data);
        } else {
          return await Promise.reject(response.message);
        }
      } catch (error: any) {
        return await Promise.reject(error);
      }
    },

    async fetchActiveEmployeesCount(organisationId: number, departmentId: number): Promise<any> {
      try {
        const response = await groupService.fetchActiveEmployeesCount(organisationId, departmentId);
        if (response.data) {
          return await Promise.resolve(response.data);
        } else {
          return await Promise.reject(response.message);
        }
      } catch (error: any) {
        return await Promise.reject(error);
      }
    },

    async show(id: string): Promise<any> {
      try {
        const response = await groupService.show(id);
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
        const response = await groupService.create(data);
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
        const response = await groupService.update(data, id);
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
    async updateGradeList(data: Update, id: string): Promise<any> {
      try {
        const response = await groupService.updateMultiple(data, id);
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
    async gradeUpdate(data: Update, id: string, store_id: string): Promise<any> {
      try {
        const response = await groupService.updateGrade(data, id, store_id);
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
    async removeGrade(id: string, store_id: string): Promise<any> {
      try {
        const response = await groupService.deleteGrade(id, store_id);
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
        const response = await groupService.delete(id);
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

export default groupStore;
