import { defineStore } from "pinia";
import kycService from "../../service/kyc/kyc.service";

interface State {
  // Define any state properties if needed
}

const kycStore = defineStore("Kyc", {
  state: (): State => ({}), // Initialize your state here
  actions: {
    async fetchKycDetails(organisationId: number): Promise<any> {
      try {
        const response = await kycService.kycDetails(organisationId);
        if (response.data) {
          return response;
        } else if (response.response) {
          return Promise.reject(response.response);
        } else {
          return Promise.reject(response.message);
        }
      } catch (error: any) {
        return Promise.reject(error);
      }
    },

    async approval(organisationId: number): Promise<any> {
      try {
        const response = await kycService.approval(organisationId.toString());
        if (response.data) {
          return response;
        } else if (response.response) {
          return Promise.reject(response.response);
        } else {
          return Promise.reject(response.message);
        }
      } catch (error: any) {
        return Promise.reject(error);
      }
    },

    async docApprove(documentId: number, accept: boolean): Promise<any> {
      try {
        const response = await kycService.docApprove(
          documentId.toString(),
          accept
        );
        if (response.data) {
          return response;
        } else if (response.response) {
          return Promise.reject(response.response);
        } else {
          return Promise.reject(response.message);
        }
      } catch (error: any) {
        return Promise.reject(error);
      }
    },
  },
});

export default kycStore;
