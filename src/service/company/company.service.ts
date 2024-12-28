import { http } from "../../core/utils/http";
import authHeader from "../../core/utils/auth.header.js";
import { Axios } from "axios";
import { Create, Update } from "./interface/company.interface";

class Company {
  constructor(private readonly request: Axios) {}

  async index(): Promise<any> {
    return await this.request
      .get("/companies", {
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
  async show(id: string): Promise<any> {
    return await this.request
      .get(`/companies/${id}`, {
        headers: authHeader(),
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
  async delete(id: string): Promise<any> {
    return await this.request
      .delete(`/companies/${id}`, {
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
