import { defineStore } from "pinia";
import payrollService from "../../service/payroll/payroll.service";

import {
  Create,
  Update,
  UpdateSettings,
} from "../../service/payroll/interface/payroll.interface";

interface State {}
const payrollStore = defineStore("payroll", {
  state: (): State => ({}),
  actions: {
    async index(organisationId: number, scheduledDate: string | null, status: string | null, pageSize: number,pageNumber: number): Promise<any> {
      try {
        const response = await payrollService.get(organisationId, scheduledDate, status, pageSize, pageNumber);
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
    async deleteMany(data:string[]): Promise<any> {
      try {
        const response = await payrollService.deleteMany(data);
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
    async retryPayment(id: string, data: any): Promise<any> {
      try {
        const response = await payrollService.retryPayment(id, data);
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
    // async initiate(department: any): Promise<any> {
    //   try {
    //     const response = await payrollService.initiate(department);
    //     if (response.data) {
    //       return await Promise.resolve(response);
    //     } else if (response.response) {
    //       return await Promise.reject(response.response);
    //     } else {
    //       return await Promise.reject(response.message);
    //     }
    //   } catch (error: any) {
    //     return await Promise.reject(error);
    //   }
    // },
    async initiate(organisationId: number, pageSize: number, pageNumber: number): Promise<any> {
      try {
        const response = await payrollService.initiate(organisationId, pageSize, pageNumber);
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

    async fetchEmployeePayroll(organisationId: number, employeeId: number, pageSize: number = 10, pageNumber: number = 1): Promise<any> {
      try {
        const response = await payrollService.getEmployeePayroll(organisationId, employeeId, pageSize, pageNumber);
        if (response.data) {
          return response.data;
        } else {
          throw new Error(response.message);
        }
      } catch (error) {
        console.error("Error fetching payroll:", error);
        throw error;
      }
    },    

    async draft(): Promise<any> {
      try {
        const response = await payrollService.draft();
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

    async fetchDraftPayrollCount(organisationId: number): Promise<any> {
      try {
        const response = await payrollService.getDraftedPayrollCount(organisationId);
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
        const response = await payrollService.generateCsvTemplate();
        if (response.data) {
          const blob = new Blob([response.data], { type: 'text/csv' });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', 'Payroll_Template.csv');
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
        console.log("Payload being sent:", formData);
        formData.append('CsvFile', payload.file);
        formData.append('OrganisationId', payload.organisationId.toString()); 
        formData.forEach((value, key) => {
          console.log(`${key}:`, value);});
        const response = await payrollService.uploadCsv(formData);
        return response; 
      } catch (error) {
        console.error('Error importing CSV file:', error);
        throw error; 
      }
    },

    async uploadPayrollCsv(csvFile: File, organisationId: number, scheduledMonth: string): Promise<void> {
      try {
        const response = await payrollService.uploadPayrollCsv(csvFile, organisationId, scheduledMonth);
        console.log('Payroll uploaded successfully:', response);
        return response; 
      } catch (error) {
        console.error('Error uploading payroll:', error);
      }
    },
    
    async fetchOrganisationPayrollCount(organisationId: number): Promise<any> {
      try {
        const response = await payrollService.getOrganisationPayrollCount(organisationId);
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

    async createPayroll(payload: {
      organisationId: number;
      employeesSalary: Array<{
        employeeId: number;
        bonus?: { amount: number; reason: string };
        deduction?: { amount: number; reason: string };
        taxAmount: number;
        netPay: number;
      }>;
      paytype: string;
      scheduledMonth: string;
    }): Promise<any> {
      try {
        const response = await payrollService.createPayroll(payload);
        if (response.data && response.data.succeeded) {
          return response.data;
        } else {
          throw new Error(response.message);
        }
      } catch (error) {
        console.error("Error creating payroll:", error);
        throw error;
      }
    },

    async updatePayroll(payload: {
      organisationId: number;
      employeesSalary: Array<{
        employeeId: number;
        bonus?: { amount: number; reason: string };
        deduction?: { amount: number; reason: string };
        taxAmount: number;
        netPay: number;
      }>;
      paytype: string;
      scheduledMonth: string;
    }): Promise<any> {
      try {
        const response = await payrollService.updatePayroll(payload);
        if (response.data && response.data.succeeded) {
          return response.data;
        } else {
          throw new Error(response.message);
        }
      } catch (error) {
        console.error("Error updating payroll:", error);
        throw error;
      }
    },

    async getPayroll(params: {
      organisationId: number;
      payrollId: number;
      pageSize?: number;
      pageNumber?: number;
    }): Promise<any> {
      try {
        const response = await payrollService.getPayroll(params);
        if (response.data && response.data.succeeded) {
          return response.data;
        } else {
          throw new Error(response.message);
        }
      } catch (error) {
        console.error("Error fetching payroll:", error);
        throw error;
      }
    },    

    async submitPayroll(payrollId: number): Promise<any> {
      try {
        const response = await payrollService.submitPayroll(payrollId);
        if (response.data && response.data.succeeded) {
          return response.data;
        } else {
          throw new Error(response.message);
        }
      } catch (error) {
        console.error("Error submitting payroll:", error);
        throw error;
      }
    },   
    async savePayrollToDraft(payload: any): Promise<any> {
      try {
        const response = await payrollService.savePayrollToDraft(payload);
        if (response.data && response.data.succeeded) {
          return response.data;
        } else {
          throw new Error(response.message);
        }
      } catch (error) {
        console.error("Error saving payroll to draft:", error);
        throw error;
      }
    },   
      
    async getOrganisationDraftedPayroll(params: {
      organisationId: number;
      draftedPayrollId?: number;
      pageSize?: number;
      pageNumber?: number;
    }): Promise<any> {
      try {
        const response = await payrollService.getOrganisationDraftedPayroll(params);
        if (response && response.succeeded) {
          return response;
        } else {
          throw new Error(response.message || "Failed to fetch drafted payroll.");
        }
      } catch (error) {
        console.error("Error in store fetching drafted payroll:", error);
        throw error;
      }
    },    
    async deleteDraftedPayroll(draftedPayrollId: number): Promise<any> {
      try {
        const response = await payrollService.deleteDraftedPayroll(draftedPayrollId);
        if (response && response.succeeded) {
          return response;
        } else {
          throw new Error(response.message || "Failed to delete drafted payroll.");
        }
      } catch (error) {
        console.error("Error in store deleting drafted payroll:", error);
        throw error;
      }
    },    
    async removeEmployee(payrollId: number, employeeId: number, informalPayrollId?: number): Promise<any> {
      try {
        const response = await payrollService.removeEmployeeFromPayroll(payrollId, employeeId, informalPayrollId);
        if (response.data && response.data.succeeded) {
          return response.data;
        } else {
          throw new Error(response.message);
        }
      } catch (error) {
        console.error("Error removing employee:", error);
        throw error;
      }
    },

    // async getPayroll(organisationId: number, payrollId: number): Promise<any> {
    //   try {
    //     const response = await payrollService.getPayroll(organisationId, payrollId);
    //     if (response.data && response.data.succeeded) {
    //       return response.data;
    //     } else {
    //       throw new Error(response.message);
    //     }
    //   } catch (error) {
    //     console.error("Error fetching payroll:", error);
    //     throw error;
    //   }
    // },
    async getSingle(id: string): Promise<any> {
      try {
        const response = await payrollService.getSingle(id);
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
    async preview(department: any): Promise<any> {
      try {
        const response = await payrollService.preview(department);
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
    async getSettings(): Promise<any> {
      try {
        const response = await payrollService.settings();
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
        const response = await payrollService.create(data);
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
        const response = await payrollService.update(data, id);
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
        const response = await payrollService.updateSettings(data);
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
        const response = await payrollService.delete(id);
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

export default payrollStore;
