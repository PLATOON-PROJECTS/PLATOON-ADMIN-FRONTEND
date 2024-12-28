import { http } from "../../core/utils/http";
import authHeader from "../../core/utils/auth.header.js";
import { Axios } from "axios";
import { Create, Transfer } from "./interface/wallet.interface";

class WalletService {
  constructor(private readonly request: Axios) {}

  async getWallet(): Promise<any> {
    return await this.request
      .get("/wallet", {
        headers: authHeader(),
      })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
  }
  async getChartData(year:any): Promise<any> {
    return await this.request
      .get("/dashboard?chart="+year, {
        headers: authHeader(),
      })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
  }
  async getChartYears(): Promise<any> {
    return await this.request
      .get("/dashboard", {
        headers: authHeader(),
      })
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        return err;
      });
  }
  async transfer(data: Transfer): Promise<any> {
    return await this.request
      .post(
        "/wallet/transfer",
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
  async getBanks(): Promise<any> {
    return await this.request
      .get(
        "/services/banks",
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
  async getWalletHistory(): Promise<any> {
    return await this.request
      .get("/wallet/transactions", {
        headers: authHeader(),
      })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
  }
  async createWallet(): Promise<any> {
    return await this.request
      .post(
        "/wallet",
        {},
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

export default new WalletService(http);
