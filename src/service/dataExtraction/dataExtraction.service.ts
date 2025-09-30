import authHeader from "../../core/utils/auth.header.js";
import authhHeader from "../../core/utils/authh.header";
import axios, { Axios } from "axios";
import {
  DataExtractionFilters,
  DataExtractionResponse,
  DataExtractionResult,
} from "./interface/dataExtraction.interface";

class DataExtractionService {
  [x: string]: any;
  constructor(private readonly request: Axios) {}

  private createAxiosInstance() {
    return axios.create({
      baseURL: import.meta.env.VITE_PLATOON_BASEURL,
      headers: authhHeader(),
    });
  }

  async getSubscriberData(
    filters: DataExtractionFilters
  ): Promise<DataExtractionResponse> {
    const customRequest = this.createAxiosInstance();

    return await customRequest
      .get("/Enquiry/export/subscriber", {
        headers: authHeader(),
        params: filters,
      })
      .then((res) => {
        return {
          data: res.data || [],
          success: true,
        };
      })
      .catch((err) => {
        return {
          data: [],
          success: false,
          message: err.message || "Failed to fetch subscriber data",
        };
      });
  }

  async getBetaData(
    filters: DataExtractionFilters
  ): Promise<DataExtractionResponse> {
    const customRequest = this.createAxiosInstance();

    return await customRequest
      .get("/Enquiry/export/beta", {
        headers: authHeader(),
        params: filters,
      })
      .then((res) => {
        return {
          data: res.data || [],
          success: true,
        };
      })
      .catch((err) => {
        return {
          data: [],
          success: false,
          message: err.message || "Failed to fetch beta data",
        };
      });
  }

  async getWaitlistData(
    filters: DataExtractionFilters
  ): Promise<DataExtractionResponse> {
    const customRequest = this.createAxiosInstance();

    return await customRequest
      .get("/Enquiry/export/waitlist", {
        headers: authHeader(),
        params: filters,
      })
      .then((res) => {
        return {
          data: res.data || [],
          success: true,
        };
      })
      .catch((err) => {
        return {
          data: [],
          success: false,
          message: err.message || "Failed to fetch waitlist data",
        };
      });
  }

  async downloadCSV(
    type: string,
    filters: DataExtractionFilters
  ): Promise<Blob> {
    const customRequest = this.createAxiosInstance();

    const endpointMap: Record<string, string> = {
      subscriber: "/Enquiry/export/subscriber",
      beta: "/Enquiry/export/beta",
      waitlist: "/Enquiry/export/waitlist",
    };

    const endpoint = endpointMap[type] || "/Enquiry/export/subscriber";

    return await customRequest
      .get(endpoint, {
        headers: authHeader(),
        params: filters,
        responseType: "blob",
      })
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        throw new Error(err.message || "Failed to download CSV");
      });
  }

  async getAllData(
    filters: DataExtractionFilters
  ): Promise<DataExtractionResult[]> {
    const customRequest = this.createAxiosInstance();

    const endpoints = [
      { type: "subscriber", endpoint: "/Enquiry/export/subscriber" },
      { type: "beta", endpoint: "/Enquiry/export/beta" },
      { type: "waitlist", endpoint: "/Enquiry/export/waitlist" },
    ];

    const fetchPromises = endpoints.map(async (endpoint) => {
      try {
        const response = await customRequest.get(endpoint.endpoint, {
          headers: authHeader(),
          params: filters,
        });

        return {
          type: endpoint.type,
          data: response.data || [],
          success: true,
        };
      } catch (error) {
        console.error(`Error fetching ${endpoint.type} data:`, error);
        return {
          type: endpoint.type,
          data: null,
          success: false,
          error: error,
        };
      }
    });

    return await Promise.all(fetchPromises);
  }
}

export default new DataExtractionService({} as Axios);
