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

    async approval(organisationId: string, approve: boolean): Promise<any> {
      try {
        const response = await kycService.approval(organisationId, approve);
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

    // store
    // async uploadKycDocument(
    //   Files: File,
    //   organisationId: number
    // ): Promise<void> {
    //   try {
    //     const response = await kycService.uploadKycDocument(
    //       Files,
    //       organisationId
    //     );
    //     console.log("Document uploaded successfully:", response);
    //     return response;
    //   } catch (error) {
    //     console.error("Error uploading Document:", error);
    //   }
    // },

    async uploadKycDocument(payload: {
      file: File;
      documentType: string;
      organisationId: number;
    }): Promise<any> {
      try {
        const formData = new FormData();
        // This is key: your backend expects an array of objects
        formData.append("OrganisationId", payload.organisationId.toString());
        formData.append("Files[0].documentTypes", payload.documentType);
        formData.append("Files[0].documentUrl", payload.file);

        const response = await kycService.uploadKycDocument(formData);
        return response;
      } catch (error) {
        console.error("Error uploading document:", error);
        throw error;
      }
    },
  },
});

export default kycStore;
