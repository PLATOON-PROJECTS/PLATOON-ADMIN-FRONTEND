<script lang="ts" setup>
import { ref, computed } from "vue";
import IDownload from "../../components/icons/IDownload.vue";
import { useDataExtractionStore } from "../../store/modules/dataExtraction";

// Use the data extraction store
const dataExtractionStore = useDataExtractionStore();

// Local refs for form inputs
const startDate = ref("");
const endDate = ref("");

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

// Get entry count for each type using store getter
const getEntryCount = (type: string) => {
  return dataExtractionStore.getEntryCount(type);
};

const handleDateRangeSubmit = async () => {
  if (startDate.value && endDate.value) {
    // Set date range in store
    dataExtractionStore.setDateRange(startDate.value, endDate.value);

    // Format dates for API (ISO string format)
    const start = new Date(startDate.value);
    const end = new Date(endDate.value);

    // Add time to end date to include the full day
    end.setHours(23, 59, 59, 999);

    const startISO = start.toISOString();
    const endISO = end.toISOString();

    // Use store action to fetch all data
    await dataExtractionStore.fetchAllData({
      StartDate: startISO,
      EndDate: endISO,
    });
  }
};

const downloadCSV = async (type: any) => {
  try {
    await dataExtractionStore.downloadCSV(type.type);
  } catch (error: any) {
    console.error("Error downloading CSV:", error);
    alert(error.message || "Error downloading CSV file. Please try again.");
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
          class="w-6 h-6 border border-[#3E6DBD] rounded-full flex items-center justify-center mr-3"
        >
          <span class="text-[#3E6DBD] text-xs font-bold">i</span>
        </div>
        <p class="text-[#1F1F1F] text-xs">
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
            <label class="text-sm text-gray-200">Start date</label>
            <div class="relative">
              <input
                v-model="startDate"
                type="date"
                class="w-40 px-3 py-2 border text-gray-200 border-[#E6E6E6] rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <label class="text-sm text-gray-200">End date</label>
            <div class="relative">
              <input
                v-model="endDate"
                type="date"
                class="w-40 px-3 py-2 text-gray-200 border border-[#E6E6E6] rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
          <button
            @click="handleDateRangeSubmit"
            :disabled="dataExtractionStore.isLoading"
            class="bg-[#306651] text-white px-6 py-1 text-base rounded-full font-medium hover:bg-[#306651] focus:outline-none focus:ring-2 focus:ring-[#306651] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="dataExtractionStore.isLoading">Loading...</span>
            <span v-else>Go</span>
          </button>
        </div>
      </div>

      <!-- Date Range Display -->
      <div v-if="dataExtractionStore.selectedDateRange" class="mb-6">
        <p class="text-base font-medium text-gray-300 mb-4">
          <span
            class="font-medium text-base"
            v-html="
              dataExtractionStore.selectedDateRange.replace(
                /\*\*(.*?)\*\*/g,
                '<strong>$1</strong>'
              )
            "
          ></span>
        </p>
      </div>

      <!-- Error Display -->
      <div
        v-if="dataExtractionStore.error"
        class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
      >
        <p class="text-red-600 text-sm">{{ dataExtractionStore.error }}</p>
        <button
          @click="dataExtractionStore.clearError()"
          class="mt-2 text-red-600 hover:text-red-800 text-sm underline"
        >
          Dismiss
        </button>
      </div>

      <!-- Data Extraction Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          v-for="type in extractionTypes"
          :key="type.id"
          class="bg-white rounded-lg border border-grey-200 p-6 shadow-sm"
        >
          <h3 class="text-lg font-medium text-[#1F1F1F] mb-2">
            {{ type.name }}
          </h3>
          <p class="text-[#A6A6A6] text-sm mb-6">
            {{ getEntryCount(type.type) }} entries
          </p>

          <div class="flex justify-end">
            <button
              @click="downloadCSV(type)"
              :disabled="
                dataExtractionStore.isLoading ||
                !dataExtractionStore.isDateRangeSelected
              "
              class="bg-green-50 text-green-700 px-6 py-2 rounded-lg font-medium hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <IDownload :color="'#059669'" />
              <span v-if="dataExtractionStore.isLoading">Downloading...</span>
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
