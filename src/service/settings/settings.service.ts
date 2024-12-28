import { http } from "../../core/utils/http";
import authHeader from "../../core/utils/auth.header.js";
import { Axios } from "axios";
import { Update } from "./interface/settings.interface";

class SettingsService {
  constructor(private readonly request: Axios) {}

  async index(): Promise<any> {
    return await this.request
      .get("/settings", {
        headers: authHeader(),
      })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
  }
  async update(data: Update): Promise<any> {
    return await this.request
      .put(
        "/settings",
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

export default new SettingsService(http);
