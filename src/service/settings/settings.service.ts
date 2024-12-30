import { http } from "../../core/utils/http";
import authHeader from "../../core/utils/auth.header.js";
import axios, { Axios } from "axios";
import authhHeader from "../../core/utils/authh.header";

class SettingsService {
  constructor(private readonly request: Axios) {}

  private createAxiosInstance() {
    return axios.create({
      baseURL: "https://platoon-backend-1.onrender.com/api",
      headers: authhHeader(),
    });
  }

  async index(): Promise<any> {
    return await this.request
      .get("/ProcessingFee/fetch", {
        headers: authHeader(),
      })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
  }

  async update(amount: number): Promise<any> {
    const customRequest = this.createAxiosInstance();
    return await customRequest
      .put(
        `/ProcessingFee/set/${amount}`,
        { amount },
        {
          headers: authHeader(),
        }
      )
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        console.error(
          "Error updating payroll fee:",
          err.response || err.message || err
        );
        return err.response
          ? err.response.data
          : { succeeded: false, message: "An error occurred" };
      });
  }
}

export default new SettingsService(http);
