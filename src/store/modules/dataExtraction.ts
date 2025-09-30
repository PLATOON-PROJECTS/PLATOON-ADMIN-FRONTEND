import { defineStore } from "pinia";
import dataExtractionService from "../../service/dataExtraction/dataExtraction.service";
import {
  DataExtractionFilters,
  DataExtractionResult,
} from "../../service/dataExtraction/interface/dataExtraction.interface";

export const useDataExtractionStore = defineStore("dataExtraction", {
  state: () => ({
    // Data storage for each type
    subscriberData: [] as any[],
    betaData: [] as any[],
    waitlistData: [] as any[],

    // UI state
    isLoading: false,
    selectedDateRange: "",
    startDate: "",
    endDate: "",

    // Error state
    error: null as string | null,
  }),

  getters: {
    getEntryCount: (state) => (type: string) => {
      switch (type) {
        case "subscriber":
          return state.subscriberData?.length || 0;
        case "beta":
          return state.betaData?.length || 0;
        case "waitlist":
          return state.waitlistData?.length || 0;
        default:
          return 0;
      }
    },

    hasData: (state) => {
      return (
        state.subscriberData.length > 0 ||
        state.betaData.length > 0 ||
        state.waitlistData.length > 0
      );
    },

    isDateRangeSelected: (state) => {
      return state.startDate && state.endDate;
    },
  },

  actions: {
    async fetchAllData(filters: DataExtractionFilters) {
      this.isLoading = true;
      this.error = null;

      try {
        const results = await dataExtractionService.getAllData(filters);

        // Store data based on type
        results.forEach((result) => {
          if (result.success && result.data) {
            switch (result.type) {
              case "subscriber":
                this.subscriberData = result.data;
                break;
              case "beta":
                this.betaData = result.data;
                break;
              case "waitlist":
                this.waitlistData = result.data;
                break;
            }
          }
        });

        // Check if at least one request was successful
        const hasSuccess = results.some((result) => result.success);

        if (!hasSuccess) {
          this.error =
            "Error fetching data from all endpoints. Please try again.";
        }

        // Format dates for display
        if (hasSuccess) {
          const start = new Date(filters.StartDate);
          const end = new Date(filters.EndDate);

          const startFormatted = start.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          });
          const endFormatted = end.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          });

          this.selectedDateRange = `Showing entries from ${startFormatted} to ${endFormatted}.`;
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        this.error = "Error fetching data. Please try again.";
      } finally {
        this.isLoading = false;
      }
    },

    async downloadCSV(type: string) {
      if (!this.isDateRangeSelected) {
        throw new Error("Please select a date range first");
      }

      this.isLoading = true;
      this.error = null;

      try {
        const start = new Date(this.startDate);
        const end = new Date(this.endDate);
        end.setHours(23, 59, 59, 999);

        const filters: DataExtractionFilters = {
          StartDate: start.toISOString(),
          EndDate: end.toISOString(),
        };

        const blob = await dataExtractionService.downloadCSV(type, filters);

        // Create download link
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${type}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Error downloading CSV:", error);
        this.error = "Error downloading CSV file. Please try again.";
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    setDateRange(startDate: string, endDate: string) {
      this.startDate = startDate;
      this.endDate = endDate;
    },

    clearData() {
      this.subscriberData = [];
      this.betaData = [];
      this.waitlistData = [];
      this.selectedDateRange = "";
      this.startDate = "";
      this.endDate = "";
      this.error = null;
    },

    clearError() {
      this.error = null;
    },
  },
});
