import { http } from "../../core/utils/http";
import authHeader from "../../core/utils/auth.header.js";
import authhHeader from "../../core/utils/authh.header";
import axios, { Axios } from "axios";
import { TransactionResponse } from "./interface/transaction.interface";

export interface TransactionFilters {
  TransactionMonth?: number;
  TransactionYear?: number;
  ReferenceNumber?: string;
  IsAscending?: boolean;
  Amount?: number;
  Status?: string;
  PageSize?: number;
  PageNumber?: number;
}

class TransactionService {
  [x: string]: any;
  constructor(private readonly request: Axios) {}

  private createAxiosInstance() {
    return axios.create({
      baseURL: import.meta.env.VITE_PLATOON_BASEURL2,
      headers: authhHeader(),
    });
  }

  async getTransactionInflow(
    filters?: TransactionFilters
  ): Promise<TransactionResponse> {
    const customRequest = this.createAxiosInstance();
    const params: any = {};

    if (filters) {
      // Only add parameters that have meaningful values
      if (
        filters.TransactionMonth !== undefined &&
        filters.TransactionMonth > 0
      )
        params.TransactionMonth = filters.TransactionMonth;
      if (filters.TransactionYear !== undefined && filters.TransactionYear > 0)
        params.TransactionYear = filters.TransactionYear;
      if (filters.ReferenceNumber && filters.ReferenceNumber.trim() !== "")
        params.ReferenceNumber = filters.ReferenceNumber.trim();
      if (filters.IsAscending !== undefined)
        params.IsAscending = filters.IsAscending;
      if (filters.Amount !== undefined && filters.Amount > 0)
        params.Amount = filters.Amount;
      if (filters.Status && filters.Status.trim() !== "")
        params.Status = filters.Status.trim();
      if (filters.PageSize !== undefined && filters.PageSize > 0)
        params.PageSize = filters.PageSize;
      if (filters.PageNumber !== undefined && filters.PageNumber > 0)
        params.PageNumber = filters.PageNumber;
    }

    return await customRequest
      .get("/Transaction/inflow", {
        headers: authHeader(),
        params,
      })
      .then((res) => {
        // Handle different possible response structures
        let pageItems = [];
        let currentPage = 1;
        let numberOfPages = 1;
        let totalItems = 0;

        if (res.data && res.data.data && res.data.data.pageItems) {
          // Structure: { data: { pageItems: [...] } }
          pageItems = res.data.data.pageItems;
          currentPage = res.data.data.currentPage || 1;
          numberOfPages = res.data.data.numberOfPages || 1;
          totalItems = res.data.data.totalItems || 0;
        } else if (res.data && res.data.pageItems) {
          // Structure: { pageItems: [...] }
          pageItems = res.data.pageItems;
          currentPage = res.data.currentPage || 1;
          numberOfPages = res.data.numberOfPages || 1;
          totalItems = res.data.totalItems || 0;
        } else if (Array.isArray(res.data)) {
          // Structure: [...] (direct array)
          pageItems = res.data;
          totalItems = res.data.length;
        }

        return {
          succeeded: true,
          message: "Transactions retrieved successfully",
          data: {
            pageItems,
            currentPage,
            numberOfPages,
            totalItems,
          },
        };
      })
      .catch((err) => {
        console.error("API Error:", err); // Debug log
        return {
          succeeded: false,
          message: err.message || "Failed to fetch transactions",
          data: {
            pageItems: [],
            currentPage: 1,
            numberOfPages: 1,
            totalItems: 0,
          },
        };
      });
  }
}

export default new TransactionService(http);
