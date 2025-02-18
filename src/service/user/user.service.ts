import { http } from "../../core/utils/http";
import authHeader from "../../core/utils/auth.header.js";
import axios, { Axios } from "axios";
import { Create, Update } from "./interface/user.interface";
import authhHeader from "../../core/utils/authh.header";

class UserService {
  constructor(private readonly request: Axios) {}
  private createAxiosInstance() {
    return axios.create({
      baseURL: "https://platoon-backend.onrender.com/api", // custom base URL here
      headers: authhHeader(),
    });
  }
  async show(userId: number): Promise<any> {
    const customRequest = this.createAxiosInstance();
    return await customRequest
      .get(`/User/user-details/${userId}`, {
        headers: authhHeader(),
      })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
  }

  async fetchAdmin(id: number): Promise<any> {
    const customRequest = this.createAxiosInstance();
    return await customRequest
      .get(`Admin/fetch/${id}`, {
        headers: authhHeader(),
      })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
  }
  // async getUsers(): Promise<any> {
  //   return await this.request
  //     .get("/users", {
  //       headers: authHeader(),
  //     })
  //     .then((res) => {
  //       return res;
  //     })
  //     .catch((err) => {
  //       return err;
  //     });
  // }
  async getUsers(
    organisationId: number,
    pageSize: number,
    pageNumber: number
  ): Promise<any> {
    const customRequest = this.createAxiosInstance();
    return await customRequest
      .get("/Role/retrieve-managers", {
        params: {
          OrganisationId: organisationId,
          PageSize: pageSize,
          PageNumber: pageNumber,
        },
        headers: authhHeader(),
      })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
  }

  async getUserRoleById(userId: number): Promise<any> {
    const customRequest = this.createAxiosInstance();
    return await customRequest
      .get(`/Role/get-user-role/${userId}`, {
        headers: authhHeader(),
      })
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        return err;
      });
  }
  async fetchRoles(): Promise<any> {
    const customRequest = this.createAxiosInstance();
    return await customRequest
      .get("/Role/fetch-all", {
        headers: authhHeader(),
      })
      .then((res) => res)
      .catch((err) => err);
  }

  async assignRole(requestBody: {
    userId: number;
    roleId: number;
  }): Promise<any> {
    const customRequest = this.createAxiosInstance();
    return await customRequest
      .post("/Role/assign-role", requestBody, {
        headers: authhHeader(),
      })
      .then((res) => res)
      .catch((err) => {
        console.error("Error assigning role:", err);
        throw err;
      });
  }

  async updateRole(userId: number, roleId: number): Promise<any> {
    const customRequest = this.createAxiosInstance();
    return await customRequest
      .put(`/Role/update/${userId}/${roleId}`, null, {
        headers: authhHeader(),
      })
      .then((res) => res)
      .catch((err) => {
        console.error("Error assigning role:", err);
        throw err;
      });
  }

  async deleteUser(userId: string): Promise<any> {
    const customRequest = this.createAxiosInstance();
    return await customRequest
      .delete(`/Role/remove-user/${userId}`, {
        headers: authhHeader(),
      })
      .then((res) => res)
      .catch((err) => {
        console.error("Error removing user:", err);
        throw err;
      });
  }

  async create(data: Create): Promise<any> {
    return await this.request
      .post(
        "/users",
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
  async verify(verify: string): Promise<any> {
    return await this.request
      .post(`/verify/${verify}`, {
        headers: authHeader(),
      })
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
        `/users/${id}`,
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
      .delete(
        `/users/${id}`,

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
  async updateUserImage(userId: number, formData: FormData): Promise<any> {
    const customRequest = this.createAxiosInstance();

    return await customRequest
      .put(`/User/update-user-image/${userId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          ...authhHeader(), // Include any necessary headers
        },
      })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
  }
}

export default new UserService(http);
