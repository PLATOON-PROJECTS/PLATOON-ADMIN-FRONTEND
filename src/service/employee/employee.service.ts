import { http } from '../../core/utils/http';
import authHeader from '../../core/utils/auth.header.js';
import axios, { Axios } from 'axios';
import { Create, Update, Bonus,Deduction } from './interface/employee.interface';
import authhHeader from '../../core/utils/authh.header';

class Employee {
  constructor(private readonly request: Axios) {}
  private createAxiosInstance() {
    return axios.create({
      baseURL: "https://platoon-backend.onrender.com/api", // Set your custom base URL here
      headers: authhHeader(), // Include any headers you need
    });
  }

  async getBonus(id: any): Promise<any> {
    return await this.request
      .get(`/employee/${id}/extras/bonus`, {
        headers: authHeader(),
      })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
  }

  async createBonus(id: any, data: Bonus): Promise<any> {
    return await this.request
      .post(
        `/employee/${id}/extras/bonus`,
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
  async deleteBonus(id: any,bonusId:any): Promise<any> {
    return await this.request
      .get(`/employee/${id}/extras/bonus/${bonusId}`, {
        headers: authHeader(),
      })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
  }
  async getDeductions(id: any): Promise<any> {
    return await this.request
      .get(`/employee/${id}/extras/deductions`, {
        headers: authHeader(),
      })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
  }
  async createDeduction(id: any, data: Deduction): Promise<any> {
    return await this.request
      .post(
        `/employee/${id}/extras/deductions`,
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
  async deleteDeduction(id: any,deductionId:any): Promise<any> {
    return await this.request
      .get(`/employee/${id}/extras/deductions/${deductionId}`, {
        headers: authHeader(),
      })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
  }
  // async index(): Promise<any> {
  //   return await this.request
  //     .get('/employee', {
  //       headers: authHeader(),
  //     })
  //     .then((res) => {
  //       return res;
  //     })
  //     .catch((err) => {
  //       return err;
  //     });
  // }
  async index(organisationId: number, pageSize: number = 10, pageNumber: number = 1): Promise<any> {
    const customRequest = this.createAxiosInstance();

    return await customRequest
      .get('/Employee/GetAllEmployees', {
        headers: authhHeader(),
        params: {
          OrganisationId: organisationId, 
          PageSize: pageSize,
          PageNumber: pageNumber
        }
      })
      .then((res) => {
        console.log("Employees==========",res)
        return res;
      })
      .catch((err) => {
        return err;
      });
  }
  async employeesInDepartment(id: string): Promise<any> {
    return await this.request
      .get(`/employee?department=${id}`, {
        headers: authHeader(),
      })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
  }

  async show(employeeId: string, organisationId: number): Promise<any> {
    const customRequest = this.createAxiosInstance();

    return await customRequest      
    .get('/Employee/GetEmployee', {
      headers: authhHeader(),
      params: {
        OrganisationId: organisationId,
        EmployeeId: employeeId
      }
      })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
  }
  async create(data: Create): Promise<any> {
    return await this.request
      .post(
        '/employee',
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
  // async update(data: Update, id: string): Promise<any> {
  //   return await this.request
  //     .post(
  //       `/employee/${id}`,
  //       { ...data },
  //       {
  //         headers: authHeader(),
  //       }
  //     )
  //     .then((res) => {
  //       return res;
  //     })
  //     .catch((err) => {
  //       return err;
  //     });
  // }
  async update(data: any): Promise<any> {
    const customRequest = this.createAxiosInstance();

    return await customRequest.put('/Employee/Update-Profile', data, {
        headers: {
            'Content-Type': 'application/json-patch+json',
            ...authhHeader(),
        },
    })
    .then((res) => {
        return res;
    })
    .catch((err) => {
        return err;
    });
}

  async delete(id: string): Promise<any> {
    return await this.request
      .delete(`/employee/${id}`, {
        headers: authHeader(),
      })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
  }
  async deleteEmployee(employeeId: string, organisationId: number): Promise<any> {
    const customRequest = this.createAxiosInstance();

    return await customRequest 
      .delete(`/Employee/Delete`, {
        headers: authhHeader(),
        params: {
          EmployeeId: employeeId,
          OrganisationId: organisationId,
        },
      })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
  }
  
  async download(): Promise<any> {
    return await this.request
      .get(`/employee/settings/export`, {
        headers: authHeader(),
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
      .post('/Employee/generate-csv-template', null, {
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
      .post('/Organisation/upload-employees', formData, {
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
  
  async previewCsv(data:any): Promise<any> {
    return await this.request
      .post(
        `/employee/import?preview=true`, {
          "employees": data
        },
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

  async importCsv(data:any): Promise<any> {
    return await this.request
      .post(
        `/employee/import`, {
          "employees": data
        },
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

  async deleteMany(payload: string[]): Promise<any> {
    return await this.request
      .delete(`/employee`, {
        data: { employees: payload },
        headers: authHeader(),
      })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
  }
}

export default new Employee(http);
