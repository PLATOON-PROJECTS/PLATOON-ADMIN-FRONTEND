import { defineStore } from "pinia";
import dataExtractionService from "../../service/dataExtraction/dataExtraction.service";
import {
  DataExtractionFilters,
  DataExtractionResult,
} from "../../service/dataExtraction/interface/dataExtraction.interface";

export const useDataExtractionStore = defineStore("dataExtraction", {
  state: () => ({
    // Count data from API
    counts: {
      newsLetterCount: 0,
      betaSurveys: 0,
      contactUs: 0,
      waitlistcount: 0,
      bookDemoCount: 0,
    },

    // Data storage for each type (for CSV downloads)
    subscriberData: [] as any[],
    betaData: [] as any[],
    waitlistData: [] as any[],
    contactUsData: [] as any[],
    bookingData: [] as any[],

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
      let count = 0;
      switch (type) {
        case "subscriber":
          count = state.counts.newsLetterCount || 0;
          break;
        case "beta":
          count = state.counts.betaSurveys || 0;
          break;
        case "waitlist":
          count = state.counts.waitlistcount || 0;
          break;
        case "contact-us":
          count = state.counts.contactUs || 0;
          break;
        case "booking":
          count = state.counts.bookDemoCount || 0;
          break;
        default:
          count = 0;
      }
      return count;
    },

    hasData: (state) => {
      return (
        state.subscriberData.length > 0 ||
        state.betaData.length > 0 ||
        state.waitlistData.length > 0 ||
        state.contactUsData.length > 0 ||
        state.bookingData.length > 0
      );
    },

    isDateRangeSelected: (state) => {
      return state.startDate && state.endDate;
    },
  },

  actions: {
    async fetchCounts() {
      this.isLoading = true;
      this.error = null;

      try {
        const counts = await dataExtractionService.getCounts();
        this.counts = counts;
      } catch (error) {
        console.error("Error fetching counts:", error);
        this.error = "Error fetching counts. Please try again.";
      } finally {
        this.isLoading = false;
      }
    },

    async fetchAllData(filters: DataExtractionFilters) {
      this.isLoading = true;
      this.error = null;

      try {
        const results = await dataExtractionService.getAllData(filters);

        // Store data based on type
        results.forEach((result) => {
          if (result.success && result.data && Array.isArray(result.data)) {
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
              case "contact-us":
                this.contactUsData = result.data;
                break;
              case "booking":
                this.bookingData = result.data;
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
      this.counts = {
        newsLetterCount: 0,
        betaSurveys: 0,
        contactUs: 0,
        waitlistcount: 0,
        bookDemoCount: 0,
      };
      this.subscriberData = [];
      this.betaData = [];
      this.waitlistData = [];
      this.contactUsData = [];
      this.bookingData = [];
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
