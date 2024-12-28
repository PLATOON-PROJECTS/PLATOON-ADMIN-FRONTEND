import { http } from "../../core/utils/http";
import authHeader from "../../core/utils/auth.header.js";
import { Axios } from "axios";
import { Create, UpdateSettings } from "./interface/tax.interface";

class TaxService {
  constructor(private readonly request: Axios) {}

  async getAll(): Promise<any> {
    return await this.request
      .get("/tax", {
        headers: authHeader(),
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
      .get("/tax/settings/export", {
        headers: authHeader(),
      })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
  }
  async sendRequest(): Promise<any> {
    return await this.request
      .get("/tax/settings/request", {
        headers: authHeader(),
      })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
  }
   async delete(id:any): Promise<any> {
    return await this.request
      .get(`/tax/delete/${id}`, {
        headers: authHeader(),
      })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
  }

  async create(data: Create[]): Promise<any> {
    return await this.request
      .post("/tax", data, {
        headers: authHeader(),
      })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
  }

  async updateSettings(data: UpdateSettings): Promise<any> {
    return await this.request
      .post("/tax/settings", data, {
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

export default new TaxService(http);
