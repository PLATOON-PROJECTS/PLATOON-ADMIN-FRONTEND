import { defineStore } from 'pinia';
import employeeService from '../../service/employee/employee.service';
import {
  Create,
  Update,
  Bonus,
  Deduction,
} from '../../service/employee/interface/employee.interface';
import { Create as InvitationCreateInterface } from '../../service/employee/invitation/interface/invitation.interface';
import invitationService from '../../service/employee/invitation/invitation.service';
interface State {}
const employeeStore = defineStore('employee', {
  state: (): State => ({}),
  actions: {
    async index(organisationId: number, pageSize: number, pageNumber: number): Promise<any> {
      try {
        const response = await employeeService.index(organisationId, pageSize, pageNumber);
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
        const response = await employeeService.download();
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

    async downloadCsvTemplate(): Promise<void> {
      try {
        const response = await employeeService.generateCsvTemplate();
        if (response.data) {
          const blob = new Blob([response.data], { type: 'text/csv' });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', 'Employee_Template.csv');
          document.body.appendChild(link);
          link.click();
          link.remove();
        } else if (response.response) {
          throw response.response;
        } else {
          throw response.message;
        }
      } catch (error: any) {
        console.error('Error downloading CSV template:', error);
      }
    }, 

    async importCsvFile(payload: { file: File; organisationId: number }): Promise<any> {
      try {
        const formData = new FormData();
        formData.append('csvfile', payload.file);
        formData.append('OrganisationId', payload.organisationId.toString()); 
    
        const response = await employeeService.uploadCsv(formData);
        return response; 
      } catch (error) {
        console.error('Error importing CSV file:', error);
        throw error; 
      }
    },    
    async previewCsvFile(data:any): Promise<any> {

      try {
        const response = await employeeService.previewCsv("data:@file/csv;base64,77u/"+data);
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
    async importCsvFilee(data:any): Promise<any> {

      try {
        const response = await employeeService.importCsv("data:@file/csv;base64,77u/"+data);
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

    async getBonus(id: any): Promise<any> {
      try {
        const response = await employeeService.getBonus(id);
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
    async createBonus(id: any, data: Bonus): Promise<any> {
      try {
        const response = await employeeService.createBonus(id, data);
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

    async deleteBonus(id: any, bonusId: any): Promise<any> {
      try {
        const response = await employeeService.deleteBonus(id, bonusId);
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

    async getDeductions(id: any): Promise<any> {
      try {
        const response = await employeeService.getDeductions(id);
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
    async createDeduction(id: any, data: Deduction): Promise<any> {
      try {
        const response = await employeeService.createDeduction(id, data);
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

    async deleteDeduction(id: any, deductionId: any): Promise<any> {
      try {
        const response = await employeeService.deleteDeduction(id, deductionId);
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

    async show(employeeId: string, organisationId: number): Promise<any> {
      try {
        const response = await employeeService.show(employeeId, organisationId);
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
    async employeesInDepartment(id: string): Promise<any> {
      try {
        const response = await employeeService.employeesInDepartment(id);
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
        const response = await employeeService.create(data);
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

    async update(data: Update): Promise<any> {
      try {
        const response = await employeeService.update(data);
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
        const response = await employeeService.delete(id);
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
    async deleteEmployee(employeeId: string, organisationId: number): Promise<any> {
      try {
        const response = await employeeService.deleteEmployee(employeeId, organisationId);
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
    async deleteMany(data: string[]): Promise<any> {
      try {
        const response = await employeeService.deleteMany(data);
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
    async invitationIndex(): Promise<any> {
      try {
        const response = await invitationService.index();
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
    async pendingInvitationIndex(pageSize: number, pageNumber: number): Promise<any> {
      try {
        const response = await invitationService.allIndex(pageSize, pageNumber);
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
    async invitationCreate(data: InvitationCreateInterface): Promise<any> {
      try {
        const response = await invitationService.create(data);
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

export default employeeStore;
