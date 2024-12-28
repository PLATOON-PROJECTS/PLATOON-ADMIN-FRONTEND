import { http } from "../../core/utils/http";
import authHeader from "../../core/utils/auth.header.js";
import { Axios } from "axios";
import { Create, Settings } from "./interface/pension.interface";

class Pension {
  constructor(private readonly request: Axios) {}

  async get(): Promise<any> {
    return await this.request
      .get("/pension", {
        headers: authHeader(),
      })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
  }
  async getIssuers(): Promise<any> {
    return await this.request
      .get("/services/pfa", {
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
      .post("/pension", data, {
        headers: authHeader(),
      })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
  }
  async settings(data: Settings): Promise<any> {
    return await this.request
      .post("/pension/settings", data, {
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

export default new Pension(http);
