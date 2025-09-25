<script lang="ts" setup>
import { ref, onMounted, computed, watch } from "vue";
import {
  ISearch,
  IArrowDown,
  IQuestionMark,
  INotification,
  IGridMenu,
} from "../../core/icons";
import { currency } from "../../core/utils/currencyType";
import Notification from "../../components/Notification.vue";
import ProfileAction from "../../components/dropdowns/profileAction.vue";
import Pagination from "../../components/Pagination.vue";
import { useUserStore } from "../../store/index";
import transactionService, {
  TransactionFilters,
} from "../../service/transaction/transaction.service";
import { Transaction } from "../../service/transaction/interface/transaction.interface";

// Transaction data from API
const transactions = ref<Transaction[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

const searchQuery = ref("");
const statusFilter = ref("All status");
const currentPage = ref(1);
const totalPages = ref(1);
const totalItems = ref(0);

// Filter controls
const selectedMonth = ref<number | undefined>(undefined);
const selectedYear = ref<number | undefined>(undefined);
const selectedAmount = ref<number | undefined>(undefined);
const isAscending = ref(true);
const pageSize = ref(10);

const statusOptions = [
  "All status",
  "Successful",
  "Pending",
  "Processing",
  "Failed",
  "Refunded",
];

const monthOptions = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];

const yearOptions = Array.from(
  { length: 10 },
  (_, i) => new Date().getFullYear() - i
);

const getStatusColor = (status: string) => {
  switch (status) {
    case "Successful":
      return "text-[#12A120]";
    case "Pending":
      return "text-[#FFB400]";
    case "Processing":
      return "text-[#2D96CB]";
    case "Failed":
      return "text-[#FF4C51]";
    case "Refunded":
      return "text-[#333333]";
    default:
      return "text-[#333333]";
  }
};

const filteredTransactions = computed(() => {
  let filtered = transactions.value;

  if (searchQuery.value) {
    filtered = filtered.filter(
      (transaction) =>
        transaction.referenceNumber
          .toLowerCase()
          .includes(searchQuery.value.toLowerCase()) ||
        transaction.description
          .toLowerCase()
          .includes(searchQuery.value.toLowerCase())
    );
  }

  if (statusFilter.value !== "All status") {
    filtered = filtered.filter(
      (transaction) => transaction.status === statusFilter.value
    );
  }

  return filtered;
});

const goToPage = (page: number) => {
  currentPage.value = page;
  fetchTransactions();
};

// Computed properties for pagination display
const startItem = computed(() => (currentPage.value - 1) * pageSize.value + 1);
const endItem = computed(() =>
  Math.min(currentPage.value * pageSize.value, totalItems.value)
);

// Initialize user store
const userStore = useUserStore();
const showProfileAction = ref(false);

// Format date function
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

// Fetch transactions from API
const fetchTransactions = async () => {
  loading.value = true;
  error.value = null;

  try {
    const filters: TransactionFilters = {
      PageSize: pageSize.value,
      PageNumber: currentPage.value,
      IsAscending: isAscending.value,
    };

    // Add optional filters - only if they have meaningful values
    if (selectedMonth.value && selectedMonth.value > 0)
      filters.TransactionMonth = selectedMonth.value;
    if (selectedYear.value && selectedYear.value > 0)
      filters.TransactionYear = selectedYear.value;
    if (selectedAmount.value && selectedAmount.value > 0)
      filters.Amount = selectedAmount.value;
    if (statusFilter.value !== "All status" && statusFilter.value.trim() !== "")
      filters.Status = statusFilter.value;
    if (searchQuery.value && searchQuery.value.trim() !== "")
      filters.ReferenceNumber = searchQuery.value;

    const response = await transactionService.getTransactionInflow(filters);

    if (response.succeeded) {
      // Use the data directly from the service response
      transactions.value = response.data.pageItems || [];
      currentPage.value = response.data.currentPage || 1;
      totalPages.value = response.data.numberOfPages || 1;
      totalItems.value = response.data.totalItems || 0;
    } else {
      error.value = response.message || "Failed to fetch transactions";
    }
  } catch (err) {
    error.value = "An error occurred while fetching transactions";
    console.error("Error fetching transactions:", err);
  } finally {
    loading.value = false;
  }
};

// Handle filter changes
const applyFilters = () => {
  currentPage.value = 1; // Reset to first page when applying filters
  fetchTransactions();
};

const clearFilters = () => {
  searchQuery.value = "";
  statusFilter.value = "All status";
  selectedMonth.value = undefined;
  selectedYear.value = undefined;
  selectedAmount.value = undefined;
  isAscending.value = true;
  currentPage.value = 1;
  pageSize.value = 10;
  fetchTransactions();
};

// Watch for search query changes
let searchTimeout: number;
watch(searchQuery, () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    applyFilters();
  }, 500);
});

// Load transactions on component mount
onMounted(() => {
  fetchTransactions();
});
</script>

<template>
  <div class="min-h-screen bg-[#F0F2F2] px-8 space-y-4 py-6">
    <!-- Page Header -->
    <div class="border-b" style="border-color: #e6e6e6">
      <div class="px-6 py-6">
        <h1 class="text-2xl font-bold" style="color: #1f1f1f">
          Transaction History
        </h1>
      </div>
    </div>

    <!-- Search and Filter Bar -->
    <div class="border-b" style="border-color: #e6e6e6">
      <div class="px-6 py-4">
        <div class="flex items-center justify-between space-x-4">
          <!-- Search Input -->
          <div class="flex-1 max-w-md">
            <div class="relative">
              <div
                class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
              >
                <ISearch :color="'#9CA3AF'" />
              </div>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search transaction ID or description"
                class="block w-full pl-10 pr-3 py-2 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Advanced Filters -->
    <div class="border-b" style="border-color: #e6e6e6">
      <div class="px-6 py-4">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900">Advanced Filters</h3>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <!-- Month Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Month</label
            >
            <select
              placeholder="Month"
              v-model="selectedMonth"
              @change="applyFilters"
              class="w-full px-3 py-2 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Months</option>
              <option
                v-for="month in monthOptions"
                :key="month.value"
                :value="month.value"
              >
                {{ month.label }}
              </option>
            </select>
          </div>

          <!-- Year Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Year</label
            >
            <select
              placeholder="Year"
              v-model="selectedYear"
              @change="applyFilters"
              class="w-full px-3 py-2 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Years</option>
              <option v-for="year in yearOptions" :key="year" :value="year">
                {{ year }}
              </option>
            </select>
          </div>

          <!-- Amount Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Amount</label
            >
            <input
              v-model.number="selectedAmount"
              @input="applyFilters"
              type="number"
              placeholder="Enter amount"
              class="w-full px-3 py-2 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <!-- Status Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Status</label
            >
            <select
              placeholder="Status"
              v-model="statusFilter"
              @change="applyFilters"
              class="w-full px-3 py-2 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option
                v-for="option in statusOptions"
                :key="option"
                :value="option"
              >
                {{ option }}
              </option>
            </select>
          </div>

          <!-- Sort Order -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Sort Order</label
            >
            <select
              placeholder="Sort Order"
              v-model="isAscending"
              @change="applyFilters"
              class="w-full px-3 py-2 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option :value="true">Ascending</option>
              <option :value="false">Descending</option>
            </select>
          </div>
        </div>

        <!-- Filter Actions -->
        <div class="flex items-center justify-between mt-4">
          <button
            @click="clearFilters"
            class="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-50"
          >
            Clear All Filters
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="bg-white rounded-lg p-8 text-center">
      <div
        class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"
      ></div>
      <p class="mt-2 text-gray-600">Loading transactions...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-white rounded-lg p-8 text-center">
      <div class="text-red-600 mb-4">
        <svg
          class="mx-auto h-12 w-12"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">
        Error Loading Transactions
      </h3>
      <p class="text-gray-600 mb-4">{{ error }}</p>
      <button
        @click="fetchTransactions"
        class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        Try Again
      </button>
    </div>

    <!-- Transaction Table -->
    <div v-if="!loading && !error" class="bg-white rounded-lg">
      <div class="align-middle inline-block min-w-full overflow-x-auto">
        <div class="overflow-hidden sm:rounded-lg">
          <table class="min-w-full border-collapse">
            <thead class="text-black-200 text-sm text-left">
              <tr>
                <th scope="col" class="py-3 px-4 text-left font-medium">
                  Transaction ID
                </th>
                <th scope="col" class="py-3 text-left font-medium">
                  Description
                </th>
                <th scope="col" class="py-3 text-left font-medium">Amount</th>
                <th scope="col" class="py-3 text-left font-medium">Status</th>
                <th scope="col" class="py-3 text-left font-medium">Date</th>
              </tr>
            </thead>

            <tbody class="bg-white divide-y divide-grey-200">
              <tr
                v-for="transaction in transactions"
                :key="transaction.id"
                class="text-black-100"
              >
                <td class="py-4 whitespace-nowrap">
                  <span
                    class="text-sm font-semimedium block max-w-xs truncate"
                    :title="transaction.referenceNumber"
                  >
                    {{ transaction.referenceNumber }}
                  </span>
                </td>
                <td class="py-4 whitespace-nowrap">
                  <span
                    class="text-sm font-semimedium block max-w-xs truncate"
                    :title="transaction.description"
                  >
                    {{ transaction.description }}
                  </span>
                </td>
                <td class="py-4 whitespace-nowrap">
                  <span class="text-sm font-semimedium">
                    {{ transaction.currency }}
                    {{ currency(transaction.amount) }}
                  </span>
                </td>
                <td class="py-4 whitespace-nowrap">
                  <span
                    :class="[
                      'text-sm font-semimedium',
                      getStatusColor(transaction.status),
                    ]"
                  >
                    {{ transaction.status }}
                  </span>
                </td>
                <td class="py-4 whitespace-nowrap">
                  <span class="text-sm font-semimedium">{{
                    formatDate(transaction.createdAt)
                  }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Pagination -->
      <Pagination
        v-if="transactions.length > 0"
        :currentPage="currentPage"
        :totalPages="totalPages"
        :pageSize="pageSize"
        :totalItems="totalItems"
        @updatePage="goToPage"
      />

      <!-- Empty State -->
      <div
        v-else-if="!loading && !error && transactions.length === 0"
        class="px-6 py-12 text-center"
      >
        <div class="text-gray-400 mb-4">
          <svg
            class="mx-auto h-12 w-12"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">
          No transactions found
        </h3>
        <p class="text-gray-600">
          No transactions match your current search criteria.
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom styles for the transaction history page */
</style>
