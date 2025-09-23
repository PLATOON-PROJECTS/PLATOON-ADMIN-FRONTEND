<script lang="ts" setup>
import { ref, computed } from "vue";
import IDownload from "../../components/icons/IDownload.vue";
import { http } from "../../core/utils/http";
import authHeader from "../../core/utils/auth.header.js";

const startDate = ref("");
const endDate = ref("");
const selectedDateRange = ref("");
const isLoading = ref(false);

// Data storage for each type
const subscriberData = ref<any[]>([]);
const betaData = ref<any[]>([]);
const waitlistData = ref<any[]>([]);

const extractionTypes = ref([
  {
    id: 1,
    name: "Sign Up (Beta Survey)",
    type: "beta",
  },
  {
    id: 2,
    name: "Get Notified (Waitlist)",
    type: "waitlist",
  },
  {
    id: 3,
    name: "Subscribe (Newsletter)",
    type: "subscriber",
  },
]);

// Get entry count for each type
const getEntryCount = (type: string) => {
  switch (type) {
    case "subscriber":
      return subscriberData.value?.length || 0;
    case "beta":
      return betaData.value?.length || 0;
    case "waitlist":
      return waitlistData.value?.length || 0;
    default:
      return 0;
  }
};

// Map type to endpoint
const getEndpoint = (type: string) => {
  const endpointMap: Record<string, string> = {
    subscriber: "/Enquiry/export/subscriber",
    beta: "/Enquiry/export/beta",
    waitlist: "/Enquiry/export/waitlist",
  };
  return endpointMap[type] || "/Enquiry/export/subscriber";
};

const handleDateRangeSubmit = async () => {
  if (startDate.value && endDate.value) {
    try {
      isLoading.value = true;

      // Format dates for API (ISO string format)
      const start = new Date(startDate.value);
      const end = new Date(endDate.value);

      // Add time to end date to include the full day
      end.setHours(23, 59, 59, 999);

      const startISO = start.toISOString();
      const endISO = end.toISOString();

      // Fetch data for all three endpoints
      const fetchPromises = extractionTypes.value.map(async (type) => {
        try {
          const endpoint = getEndpoint(type.type);
          const response = await http.get(endpoint, {
            headers: authHeader(),
            params: {
              StartDate: startISO,
              EndDate: endISO,
            },
          });

          // Store data based on type
          if (type.type === "subscriber") {
            subscriberData.value = response.data || [];
          } else if (type.type === "beta") {
            betaData.value = response.data || [];
          } else if (type.type === "waitlist") {
            waitlistData.value = response.data || [];
          }

          return {
            type: type.type,
            data: response.data,
            success: true,
          };
        } catch (error) {
          console.error(`Error fetching ${type.type} data:`, error);
          return {
            type: type.type,
            data: null,
            success: false,
            error: error,
          };
        }
      });

      // Wait for all requests to complete
      const results = await Promise.all(fetchPromises);

      // Check if at least one request was successful
      const hasSuccess = results.some((result) => result.success);

      if (hasSuccess) {
        // Format dates for display
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

        selectedDateRange.value = `Showing entries from ${startFormatted} to ${endFormatted}.`;
      } else {
        alert("Error fetching data from all endpoints. Please try again.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Error fetching data. Please try again.");
    } finally {
      isLoading.value = false;
    }
  }
};

const downloadCSV = async (type: any) => {
  if (!startDate.value || !endDate.value) {
    alert("Please select a date range first");
    return;
  }

  try {
    isLoading.value = true;

    const start = new Date(startDate.value);
    const end = new Date(endDate.value);
    end.setHours(23, 59, 59, 999);

    const startISO = start.toISOString();
    const endISO = end.toISOString();

    const endpoint = getEndpoint(type.type);
    const response = await http.get(endpoint, {
      headers: authHeader(),
      params: {
        StartDate: startISO,
        EndDate: endISO,
      },
      responseType: "blob",
    });

    if (response.data) {
      // Get filename from response headers
      const headers = response.headers || {};
      const contentDisposition = headers["content-disposition"];
      let filename = `${type.type}.csv`;

      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(
          /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
        );
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1].replace(/['"]/g, "");
        }
      }

      // Get content type from response headers
      const contentType = headers["content-type"] || "text/csv";

      // Create download link using response data and headers
      const blob = new Blob([response.data], { type: contentType });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }
  } catch (error) {
    console.error("Error downloading CSV:", error);
    alert("Error downloading CSV file. Please try again.");
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen bg-[#F0F2F2] px-8 py-6">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-medium text-[#1F1F1F]">Data Extraction</h1>
    </div>

    <div class="bg-white rounded-lg p-6">
      <!-- Information Message -->
      <div class="flex items-center mb-6">
        <div
          class="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-3"
        >
          <span class="text-white text-sm font-bold">i</span>
        </div>
        <p class="text-[#1F1F1F] text-sm">
          You are required to select date range to begin
        </p>
      </div>

      <!-- Date Range Selector -->
      <div class="mb-6">
        <h2 class="text-base font-medium text-[#1F1F1F] mb-4">
          Select date range
        </h2>
        <div class="flex items-center space-x-4">
          <div class="flex items-center space-x-2">
            <label class="text-sm text-gray-600">Start date</label>
            <div class="relative">
              <input
                v-model="startDate"
                type="date"
                class="w-40 px-3 py-2 border border-[#E6E6E6] rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <label class="text-sm text-gray-600">End date</label>
            <div class="relative">
              <input
                v-model="endDate"
                type="date"
                class="w-40 px-3 py-2 border border-[#E6E6E6] rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
          <button
            @click="handleDateRangeSubmit"
            :disabled="isLoading"
            class="bg-[#306651] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#306651] focus:outline-none focus:ring-2 focus:ring-[#306651] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="isLoading">Loading...</span>
            <span v-else>Go</span>
          </button>
        </div>
      </div>

      <!-- Date Range Display -->
      <div v-if="selectedDateRange" class="mb-6">
        <p class="text-base font-medium text-[#1F1F1F] mb-4">
          <span
            class="font-medium text-base"
            v-html="
              selectedDateRange.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            "
          ></span>
        </p>
      </div>

      <!-- Data Extraction Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          v-for="type in extractionTypes"
          :key="type.id"
          class="bg-white rounded-lg border border-[#F9FAFB] p-6 shadow-sm"
        >
          <h3 class="text-lg font-medium text-[#1F1F1F] mb-2">
            {{ type.name }}
          </h3>
          <p class="text-[#A6A6A6] text-sm mb-6">
            {{ getEntryCount(type.type) }} entries
          </p>

          <div class="flex justify-center">
            <button
              @click="downloadCSV(type)"
              :disabled="isLoading || !startDate || !endDate"
              class="bg-green-50 text-green-700 px-6 py-2 rounded-lg font-medium hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <IDownload :color="'#059669'" />
              <span v-if="isLoading">Downloading...</span>
              <span v-else>Download</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom styles for the data extraction page */
</style>
