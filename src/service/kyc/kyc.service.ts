import { http } from "../../core/utils/http";
import axios, { Axios } from "axios";
import { Get, SubmitKycInfoPayload } from "./interface/kyc.interface";
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

  async approval(organisationId: string, approve: boolean): Promise<any> {
    const customRequest = this.createAxiosInstance();

    return await customRequest
      .put(
        `Kyc/toggle-kyc-approver/${organisationId}?approve=${approve}`,
        null,
        {
          headers: authhHeader(),
        }
      )
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

  // async uploadKycDocument(Files: File, organisationId: number): Promise<any> {
  //   const formData = new FormData();
  //   formData.append("File", Files);

  //   const params = {
  //     params: {
  //       OrganisationId: organisationId,
  //     },
  //   };

  //   const customRequest = this.createAxiosInstance();

  //   return await customRequest
  //     .post(`Kyc/submit-document`, formData, {
  //       headers: {
  //         ...authhHeader(),
  //         "Content-Type": "multipart/form-data",
  //       },
  //       ...params,
  //     })
  //     .then((res) => {
  //       return res.data;
  //     })
  //     .catch((err) => {
  //       throw err;
  //     });
  // }

  // async uploadKycDocument(formData: FormData): Promise<any> {
  //   const customRequest = this.createAxiosInstance();

  //   return await customRequest
  //     .post(`Kyc/submit-document`, formData, {
  //       headers: {
  //         ...authhHeader(),
  //         "Content-Type": "multipart/form-data",
  //       },
  //     })
  //     .then((res) => {
  //       return res;
  //     })
  //     .catch((err) => {
  //       console.error("Error uploading Document:", err);
  //       return Promise.reject(err);
  //     });
  // }

  async uploadKycDocument(formData: FormData): Promise<any> {
    const customRequest = this.createAxiosInstance();

    return await customRequest
      .post(`Kyc/submit-document`, formData, {
        headers: {
          ...authhHeader(),
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => res)
      .catch((err) => {
        console.error("Error uploading Document:", err);
        return Promise.reject(err);
      });
  }

  async submitInfo(payload: SubmitKycInfoPayload): Promise<any> {
    const customRequest = this.createAxiosInstance();

    return await customRequest
      .post(`Kyc/submit-info`, payload, {
        headers: authhHeader(),
      })
      .then((res) => res)
      .catch((err) => {
        console.error("Error submitting KYC info:", err);
        return Promise.reject(err);
      });
  }
}

export default new Kyc(http);
