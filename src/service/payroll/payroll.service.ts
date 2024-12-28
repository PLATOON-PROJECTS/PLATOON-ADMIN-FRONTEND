import { http } from "../../core/utils/http";
import authHeader from "../../core/utils/auth.header.js";
import axios, { Axios } from "axios";
import { Create, Update, UpdateSettings } from "./interface/payroll.interface";
import authhHeader from "../../core/utils/authh.header";

class Payroll {
  constructor(private readonly request: Axios) {}

  private createAxiosInstance() {
    return axios.create({
      baseURL: "https://platoon-backend-1.onrender.com/api", 
      headers: authhHeader(), 
    });
  }

  async get(organisationId: number, scheduledDate: string | null, status: string | null, pageSize: number = 10, pageNumber: number = 1): Promise<any> {
    const customRequest = this.createAxiosInstance();

    return await customRequest
      .get('/Payroll/get-organisation-payroll', {
        headers: authhHeader(),
        params: {
          OrganisationId: organisationId,
          ScheduledDate: scheduledDate,
          Status: status,
          PageSize: pageSize,
          PageNumber: pageNumber,
        },
      })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
  }

 
  async initiate(organisationId: number, pageSize: number = 10, pageNumber: number = 1): Promise<any> {
    const customRequest = this.createAxiosInstance();

    return await customRequest
      .get('/Payroll/get-payroll', {
        headers: authhHeader(),
        params: {
          OrganisationId: organisationId, 
          PageSize: pageSize,
          PageNumber: pageNumber
        }
      })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
  }

  async getEmployeePayroll(organisationId: number, employeeId: number, pageSize: number = 10, pageNumber: number = 1): Promise<any> {
    const customRequest = this.createAxiosInstance();
  
    return await customRequest
      .get('/Payroll/get-employee-payroll', {
        headers: authhHeader(),
        params: {
          OrganisationId: organisationId,
          EmployeeId: employeeId,
          PageSize: pageSize,
          PageNumber: pageNumber,
        },
      })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
  }
  
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
    const customRequest = this.createAxiosInstance();

    return await customRequest
      .post("/Payroll/create-payroll", payload)
      .then((res) => res)
      .catch((err) => {
        console.error("Error creating payroll:", err);
        throw err;
      });
  }
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
    const customRequest = this.createAxiosInstance();

    return await customRequest
      .post("/Payroll/update-payroll", payload)
      .then((res) => res)
      .catch((err) => {
        console.error("Error updating payroll:", err);
        throw err;
      });
  }

  async getPayroll(params: {
    organisationId: number;
    payrollId: number;
    pageSize?: number;
    pageNumber?: number;
  }): Promise<any> {
    const customRequest = this.createAxiosInstance();
  
    return await customRequest
      .get("/Payroll/get-payroll", { params })
      .then((res) => res)
      .catch((err) => {
        console.error("Error fetching payroll:", err);
        throw err;
      });
  }

  async submitPayroll(payrollId: number): Promise<any> {
    const customRequest = this.createAxiosInstance();
    return await customRequest
      .put(`/Payroll/submit-payroll/${payrollId}`)
      .then((res) => res)
      .catch((err) => {
        console.error("Error submitting payroll:", err);
        throw err;
      });
  }
  
  async savePayrollToDraft(payload: any): Promise<any> {
    const customRequest = this.createAxiosInstance();
  
    return await customRequest
      .post("/Payroll/save-payroll-to-draft", payload)
      .then((res) => res)
      .catch((err) => {
        console.error("Error saving payroll to draft:", err);
        throw err;
      });
  }
  
  async getOrganisationDraftedPayroll(params: {
    organisationId: number;
    draftedPayrollId?: number;
    pageSize?: number;
    pageNumber?: number;
  }): Promise<any> {
    const customRequest = this.createAxiosInstance();
  
    try {
      const response = await customRequest.get("/Payroll/get-organisation-drafted-payroll", { params });
      return response.data;
    } catch (err) {
      console.error("Error fetching organisation drafted payroll:", err);
      throw err;
    }
  }
  async deleteDraftedPayroll(draftedPayrollId: number): Promise<any> {
  const customRequest = this.createAxiosInstance();

  try {
    const response = await customRequest.delete(`/Payroll/delete-drafted-payroll/${draftedPayrollId}`);
    return response.data;
  } catch (err) {
    console.error("Error deleting drafted payroll:", err);
    throw err;
  }
}

  
async removeEmployeeFromPayroll(payrollId: number, employeeId: number, informalPayrollId?: number): Promise<any> {
  const customRequest = this.createAxiosInstance();
  
  return await customRequest
    .put(`/Payroll/remove-employee-on-payroll/${payrollId}`, null, {
      params: {
        employeeId,
        informalPayrollId,
      },
    })
    .then((res) => res)
    .catch((err) => {
      console.error("Error removing employee from payroll:", err);
      throw err;
    });
}

  
    // async getPayroll(organisationId: number, payrollId: number): Promise<any> {
    //   const customRequest = this.createAxiosInstance();

    //   return await customRequest
    //     .get(`/Payroll/get-payroll`, {
    //       params: {
    //         OrganisationId: organisationId,
    //         PayrollId: payrollId
    //       }
    //     })
    //     .then((res) => res.data) 
    //     .catch((err) => {
    //       console.error("Error fetching payroll:", err);
    //       throw err;
    //     });
    // }

 // async initiate(department: any): Promise<any> {
  //   return await this.request
  //     .get(`/payroll/init?department=${department}`, {
  //       headers: authHeader(),
  //     })
  //     .then((res) => {
  //       return res;
  //     })
  //     .catch((err) => {
  //       return err;
  //     });
  // }

  async preview(department: any): Promise<any> {
    return await this.request
      .get(`/payroll/init?department=${department}&show=preview`, {
        headers: authHeader(),
      })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
  }

  async getSingle(id: string): Promise<any> {
    return await this.request
      .get(`/payroll/${id}`, {
        headers: authHeader(),
      })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
  }
  async draft(): Promise<any> {
    return await this.request
      .get(`/payroll?status=draft`, {
        headers: authHeader(),
      })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
  }
  async getDraftedPayrollCount(organisationId: number): Promise<any> {
    const customRequest = this.createAxiosInstance();
  
    return await customRequest
      .get(`/Payroll/drafted-payroll-count/${organisationId}`, {
        headers: authhHeader(),
      })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
  }

  async generateCsvTemplate(): Promise<any> {
    const customRequest = this.createAxiosInstance();
    
    return await customRequest
      .post('/Payroll/generate-csv-template', null, {
        headers: authhHeader(),
        responseType: 'blob',
      })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
  }

  async uploadCsv(formData: FormData): Promise<any> {
    const customRequest = this.createAxiosInstance();
  
    return await customRequest
      .put('/Payroll/upload-payroll', formData, {
        headers: {
          ...authhHeader(),
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        console.error('Error uploading CSV:', err);
        return Promise.reject(err);
      });
  }

  async uploadPayrollCsv(csvFile: File, organisationId: number, scheduledMonth: string): Promise<any> {
    const formData = new FormData();
    formData.append('CsvFile', csvFile);
    
    const params = {
      params: {
        OrganisationId: organisationId,
        ScheduledMonth: scheduledMonth,
      },
    };
  
    const customRequest = this.createAxiosInstance();
  
    return await customRequest
      .put('/Payroll/upload-payroll', formData, {
        headers: {
          ...authhHeader(),
          'Content-Type': 'multipart/form-data',
        },
        ...params,
      })
      .then((res) => {
        return res.data; 
      })
      .catch((err) => {
        throw err; 
      });
  }
  
  

  async getOrganisationPayrollCount(organisationId: number): Promise<any> {
    const customRequest = this.createAxiosInstance();
  
    return await customRequest
      .get(`/Payroll/organisation-payroll-count/${organisationId}`, {
        headers: authhHeader(),
      })
      .then((res) => res)
      .catch((err) => err);
  }
  
  
  async create(data: Create): Promise<any> {
    return await this.request
      .post(
        "/payroll",
        { ...data },
        {
          headers: authHeader(),
        }
      )
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
  }
  async update(data: Update, id: string): Promise<any> {
    return await this.request
      .put(
        `/payroll/${id}`,
        { ...data },
        {
          headers: authHeader(),
        }
      )
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
  }
  async delete(id: string): Promise<any> {
    return await this.request
      .delete(`/payroll/${id}`, {
        headers: authHeader(),
      })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
  }

  async settings(): Promise<any> {
    return await this.request
      .get(`/payroll/settings`, {
        headers: authHeader(),
      })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
  }
  async deleteMany( data: string[]): Promise<any> {
    return await this.request
      .delete(
        `/payroll/${data}`,
      
        {
          headers: authHeader(),
        }
      )
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
  }
  async retryPayment(id: string, data: any): Promise<any> {
    return await this.request
      .post(
        `/payroll/${id}/payments`,
        { ...data },
        {
          headers: authHeader(),
        }
      )
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
  }
  async updateSettings(data: UpdateSettings): Promise<any> {
    return await this.request
      .put(
        `/payroll/settings`,
        { ...data },
        {
          headers: authHeader(),
        }
      )
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
  }
}

export default new Payroll(http);
