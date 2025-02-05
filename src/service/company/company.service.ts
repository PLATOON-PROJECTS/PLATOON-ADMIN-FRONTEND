import { http } from "../../core/utils/http";
import authHeader from "../../core/utils/auth.header.js";
import axios, { Axios } from "axios";
import { Create, Update } from "./interface/company.interface";
import authhHeader from "../../core/utils/authh.header";

class Company {
  [x: string]: any;
  constructor(private readonly request: Axios) {}

  private createAxiosInstance() {
    return axios.create({
      baseURL: "https://platoon-backend.onrender.com/api", // Set your custom base URL here
      headers: authhHeader(), // Include any headers you need
    });
  }

  async fetchCompany(pageSize: number, pageNumber: number): Promise<any> {
    const customRequest = this.createAxiosInstance();

    return await customRequest
      .get("/Organisation/fetch-all-organisation", {
        headers: authHeader(),
        params: {
          pageSize: pageSize,
          pageNumber: pageNumber,
        },
      })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
  }

  async companyCount(): Promise<any> {
    const customRequest = this.createAxiosInstance();

    return await customRequest
      .get("/Organisation/total-organisation-count", {
        headers: authHeader(),
      })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
  }

  async switch(id: string): Promise<any> {
    return await this.request
      .get(`/companies/${id}/switch`, {
        headers: authHeader(),
      })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
  }
  async companyById(organisationId: number): Promise<any> {
    const customRequest = this.createAxiosInstance();

    return await customRequest
      .get(`/Organisation/fetch-organisation-by-id`, {
        headers: authHeader(),
        params: {
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
  async create(data: Create): Promise<any> {
    return await this.request
      .post(
        "/companies",
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
      .post(
        `/companies/${id}`,
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
  async delete(organisationId: string): Promise<any> {
    const customRequest = this.createAxiosInstance();

    return await customRequest
      .delete(`Organisation/delete/${organisationId}`, {
        headers: authHeader(),
      })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
  }

  async suspend(organisationId: string): Promise<any> {
    const customRequest = this.createAxiosInstance();

    return await customRequest
      .put(`Organisation/Deactivate/${organisationId}`, {
        headers: authHeader(),
      })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
  }

  async removeSuspension(organisationId: string): Promise<any> {
    const customRequest = this.createAxiosInstance();

    return await customRequest
      .put(`Organisation/Activate/${organisationId}`, {
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

export default new Company(http);
