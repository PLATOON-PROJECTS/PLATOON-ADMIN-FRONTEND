import { http } from "../../core/utils/http";
import authHeader from "../../core/utils/auth.header.js";
import axios, { Axios } from "axios";
import { Create, Update } from "./interface/group.interface";
import authhHeader from "../../core/utils/authh.header";

class Group {
  constructor(private readonly request: Axios) {}

  private createAxiosInstance() {
    return axios.create({
      baseURL: "https://platoon-backend.onrender.com/api", 
      headers: authhHeader(), 
    });
  }

  async index(organisationId: number, pageSize: number = 10, pageNumber: number = 1): Promise<any> {
    
    const customRequest = this.createAxiosInstance();
    console.log("Requesting departments with organisationId:", organisationId); // Log the organisationId

    return await customRequest
      .get(`/Department/fetch-all-department`, {
        headers: authhHeader(),
        params: {
          OrganisationId: organisationId,
          PageSize: pageSize,
          PageNumber: pageNumber 
        }
      })
      .then((res) => {
        console.log("Index endpoint==========",res)
        return res;
      })
      .catch((err) => {
        return err;
      });
  }
  async totalDepartment(organisationId: number): Promise<any> {
    
    const customRequest = this.createAxiosInstance();

    return await customRequest
      .get(`/Department/total-department-count`, {
        headers: authhHeader(),
        params: {
          OrganisationId: organisationId
        }
      })
      .then((res) => {
        console.log("Index endpoint==========",res)
        return res;
      })
      .catch((err) => {
        return err;
      });
  }

  async fetchEmployeesCount(organisationId: number, departmentId: number): Promise<any> {
    const customRequest = this.createAxiosInstance();
    return await customRequest
      .get(`/Employee/fetch-employees-count-for-a-department`, {
        params: {
          OrganisationId: organisationId,
          DepartmentId: departmentId,
        },
        headers: authhHeader(),
      })
      .then((res) => res)
      .catch((err) => err);
  }

  async fetchActiveEmployeesCount(organisationId: number, departmentId: number): Promise<any> {
    const customRequest = this.createAxiosInstance();
    return await customRequest
      .get(`/Employee/fetch-active-employees-count-for-a-department`, {
        params: {
          OrganisationId: organisationId,
          DepartmentId: departmentId,
        },
        headers: authhHeader(),
      })
      .then((res) => res)
      .catch((err) => err);
  }

  async li(): Promise<any> {
    return await this.request
      .get("/groups", {
        headers: authHeader(),
      })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
  }
  async show(id: string): Promise<any> {
    return await this.request
      .get(`/groups/${id}`, {
        headers: authHeader(),
      })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
  }

  /** =============Create Start==================**/
  // async create(data: Create): Promise<any> {
  //   return await this.request
  //     .post(
  //       "/groups",
  //       { ...data },
  //       {
  //         headers: authHeader(),
  //       }
  //     )
  //     .then((res) => {
  //       console.log("==========",res)
  //       return res;
  //     })
  //     .catch((err) => {
  //       return err;
  //     });
  // }

  async create(data: Create): Promise<any> {

    const customRequest = this.createAxiosInstance();

    return await customRequest
      .post(
        "/Department/create-department", 
        {
          departmentName: data.name,
          supportingName: data.supportingName || "", 
          grades: data.grades.map(grade => ({
            name: grade.name,
            code: grade.code,
            grossPay: grade.grossPay 

          }))
        },
        {
          headers: authhHeader(),
        }
      )
      .then((res) => {
        console.log("==========",res)
        return res;
      })
      .catch((err) => {
        console.error("Error occurred:", err);
        return err;
      });
  }

  /** =============Create End==================**/
  async update(data: Update, id: string): Promise<any> {
    return await this.request
      .post(
        `/groups/${id}`,
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
  async updateGrade(data: Update, id: string, store_id: string): Promise<any> {
    return await this.request
      .post(
        `/groups/${store_id}/grades/${id}`,
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
  async updateMultiple(data: Update, id: string): Promise<any> {
    return await this.request
      .post(
        `/groups/${id}/grades`,
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
  async deleteGrade(id: string, store_id: string): Promise<any> {
    return await this.request
      .delete(`/groups/${store_id}/grades/${id}`, {
        headers: authHeader(),
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
      .delete(`/groups/${id}`, {
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

export default new Group(http);
