import { http } from "../../core/utils/http";
import authHeader from "../../core/utils/auth.header.js";
import axios, { Axios } from "axios";
import { Create, Transfer } from "./interface/wallet.interface";
import authhHeader from "../../core/utils/authh.header";

class WalletService {
  [x: string]: any;
  constructor(private readonly request: Axios) {}

  private createAxiosInstance() {
    return axios.create({
      baseURL: import.meta.env.VITE_PLATOON_BASEURL2, // Set your custom base URL here
      headers: authhHeader(), //
    });
  }

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
  async getOrganisationPayroll(
    organisationId: number,
    pageSize: number,
    pageNumber: number
  ): Promise<any> {
    return await this.request
      .get("/Transaction/get-organisation-payroll-transaction", {
        headers: authHeader(),
        params: {
          OrganisationId: organisationId,
          PageSize: pageSize,
          PageNumber: pageNumber,
        },
      })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
  }
  async getTotalRevenue(): Promise<any> {
    const customRequest = this.createAxiosInstance();

    return await customRequest
      .get("/Dashboard/get-total-revenue-received", {
        headers: authHeader(),
      })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
  }

  async pendingDisbursement(): Promise<any> {
    const customRequest = this.createAxiosInstance();

    return await customRequest
      .get("/Dashboard/get-total-pending-disbursement", {
        headers: authHeader(),
      })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
  }

  async getTotalFundDisbursed(): Promise<any> {
    const customRequest = this.createAxiosInstance();

    return await customRequest
      .get("/Dashboard/get-total-fund-disbursed", {
        headers: authHeader(),
      })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
  }

  async getTotalFundReceived(): Promise<any> {
    const customRequest = this.createAxiosInstance();

    return await customRequest
      .get("/Dashboard/get-total-fund-received", {
        headers: authHeader(),
      })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
  }

  async getChartData(year: any): Promise<any> {
    return await this.request
      .get("/dashboard?chart=" + year, {
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
      .get("/services/banks", {
        headers: authHeader(),
      })
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
