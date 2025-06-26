import { http } from "../../core/utils/http";
import axios, { Axios } from "axios";
import { Get } from "./interface/kyc.interface";
import authhHeader from "../../core/utils/authh.header";

class Kyc {
  constructor(private readonly request: Axios) {}

  private createAxiosInstance() {
    return axios.create({
      baseURL: import.meta.env.VITE_PLATOON_BASEURL2,
      headers: authhHeader(),
    });
  }

  async kycDetails(organisationId: number): Promise<any> {
    const customRequest = this.createAxiosInstance();

    return await customRequest
      .get(`/Kyc/${organisationId}`, {
        headers: authhHeader(),
      })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
  }

  async approval(organisationId: string): Promise<any> {
    const customRequest = this.createAxiosInstance();

    return await customRequest
      .put(`Kyc/toggle-kyc-approver/${organisationId}`, {
        headers: authhHeader(),
      })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
  }

  // service/kyc.service.ts

  async docApprove(documentId: string, accept: boolean): Promise<any> {
    const customRequest = this.createAxiosInstance();

    return await customRequest
      .put(
        `Kyc/toggle-document-acceptance/${documentId}?accept=${accept}`,
        null,
        {
          headers: authhHeader(),
        }
      )
      .then((res) => res)
      .catch((err) => err);
  }
}

export default new Kyc(http);
