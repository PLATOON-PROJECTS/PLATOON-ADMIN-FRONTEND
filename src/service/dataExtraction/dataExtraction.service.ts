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
        // Handle different response structures
        let data = [];
        if (Array.isArray(res.data)) {
          data = res.data;
        } else if (res.data && Array.isArray(res.data.data)) {
          data = res.data.data;
        } else if (
          res.data &&
          res.data.items &&
          Array.isArray(res.data.items)
        ) {
          data = res.data.items;
        } else if (
          res.data &&
          res.data.results &&
          Array.isArray(res.data.results)
        ) {
          data = res.data.results;
        }
        return {
          data: data,
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
        // Handle different response structures
        let data = [];
        if (Array.isArray(res.data)) {
          data = res.data;
        } else if (res.data && Array.isArray(res.data.data)) {
          data = res.data.data;
        } else if (
          res.data &&
          res.data.items &&
          Array.isArray(res.data.items)
        ) {
          data = res.data.items;
        } else if (
          res.data &&
          res.data.results &&
          Array.isArray(res.data.results)
        ) {
          data = res.data.results;
        }
        return {
          data: data,
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
        // Handle different response structures
        let data = [];
        if (Array.isArray(res.data)) {
          data = res.data;
        } else if (res.data && Array.isArray(res.data.data)) {
          data = res.data.data;
        } else if (
          res.data &&
          res.data.items &&
          Array.isArray(res.data.items)
        ) {
          data = res.data.items;
        } else if (
          res.data &&
          res.data.results &&
          Array.isArray(res.data.results)
        ) {
          data = res.data.results;
        }
        return {
          data: data,
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

  async getContactUsData(
    filters: DataExtractionFilters
  ): Promise<DataExtractionResponse> {
    const customRequest = this.createAxiosInstance();

    return await customRequest
      .get("/Enquiry/export/contact-us", {
        headers: authHeader(),
        params: filters,
      })
      .then((res) => {
        // Handle different response structures
        let data = [];
        if (Array.isArray(res.data)) {
          data = res.data;
        } else if (res.data && Array.isArray(res.data.data)) {
          data = res.data.data;
        } else if (
          res.data &&
          res.data.items &&
          Array.isArray(res.data.items)
        ) {
          data = res.data.items;
        } else if (
          res.data &&
          res.data.results &&
          Array.isArray(res.data.results)
        ) {
          data = res.data.results;
        }
        return {
          data: data,
          success: true,
        };
      })
      .catch((err) => {
        return {
          data: [],
          success: false,
          message: err.message || "Failed to fetch contact us data",
        };
      });
  }

  async getBookingData(
    filters: DataExtractionFilters
  ): Promise<DataExtractionResponse> {
    const customRequest = this.createAxiosInstance();

    return await customRequest
      .get("/Enquiry/export/booking", {
        headers: authHeader(),
        params: filters,
      })
      .then((res) => {
        // Handle different response structures
        let data = [];
        if (Array.isArray(res.data)) {
          data = res.data;
        } else if (res.data && Array.isArray(res.data.data)) {
          data = res.data.data;
        } else if (
          res.data &&
          res.data.items &&
          Array.isArray(res.data.items)
        ) {
          data = res.data.items;
        } else if (
          res.data &&
          res.data.results &&
          Array.isArray(res.data.results)
        ) {
          data = res.data.results;
        }
        return {
          data: data,
          success: true,
        };
      })
      .catch((err) => {
        return {
          data: [],
          success: false,
          message: err.message || "Failed to fetch booking data",
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
      "contact-us": "/Enquiry/export/contact-us",
      booking: "/Enquiry/export/booking",
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

  async getCounts(): Promise<{
    newsLetterCount: number;
    betaSurveys: number;
    contactUs: number;
    waitlistcount: number;
    bookDemoCount: number;
  }> {
    const customRequest = this.createAxiosInstance();

    return await customRequest
      .get("/Enquiry/count", {
        headers: authHeader(),
      })
      .then((res) => {
        if (res.data && res.data.succeeded && res.data.data) {
          return res.data.data;
        }
        throw new Error("Invalid response format");
      })
      .catch((err) => {
        throw new Error(err.message || "Failed to fetch counts");
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
      { type: "contact-us", endpoint: "/Enquiry/export/contact-us" },
      { type: "booking", endpoint: "/Enquiry/export/booking" },
    ];

    const fetchPromises = endpoints.map(async (endpoint) => {
      try {
        const response = await customRequest.get(endpoint.endpoint, {
          headers: authHeader(),
          params: filters,
        });

        // Handle different response structures
        let data = [];
        if (Array.isArray(response.data)) {
          data = response.data;
        } else if (response.data && Array.isArray(response.data.data)) {
          data = response.data.data;
        } else if (
          response.data &&
          response.data.items &&
          Array.isArray(response.data.items)
        ) {
          data = response.data.items;
        } else if (
          response.data &&
          response.data.results &&
          Array.isArray(response.data.results)
        ) {
          data = response.data.results;
        }
        return {
          type: endpoint.type,
          data: data,
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
