<script lang="ts" setup>
import { ref, onMounted, computed } from "vue";
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
import { useUserStore } from "../../store/index";

// Sample transaction data
const transactions = ref([
  {
    id: "TX-20250714-001",
    description: "Wallet inflow - Funding for payroll",
    amount: 12500000,
    status: "Completed",
    date: "Jul 24, 2024 | 12:45pm",
  },
  {
    id: "TX-20250714-001",
    description: "Wallet inflow - Funding for payroll",
    amount: 12500000,
    status: "Pending",
    date: "Jul 24, 2024 | 12:45pm",
  },
  {
    id: "TX-20250714-001",
    description: "Wallet inflow - Funding for payroll",
    amount: 12500000,
    status: "Refunded",
    date: "Jul 24, 2024 | 12:45pm",
  },
  {
    id: "TX-20250714-001",
    description: "Wallet inflow - Funding for payroll",
    amount: 12500000,
    status: "Processing",
    date: "Jul 24, 2024 | 12:45pm",
  },
  {
    id: "TX-20250714-001",
    description: "Wallet inflow - Funding for payroll",
    amount: 12500000,
    status: "Failed",
    date: "Jul 24, 2024 | 12:45pm",
  },
  {
    id: "TX-20250714-001",
    description: "Wallet inflow - Funding for payroll",
    amount: 12500000,
    status: "Pending",
    date: "Jul 24, 2024 | 12:45pm",
  },
  {
    id: "TX-20250714-001",
    description: "Wallet inflow - Funding for payroll",
    amount: 12500000,
    status: "Completed",
    date: "Jul 24, 2024 | 12:45pm",
  },
  {
    id: "TX-20250714-001",
    description: "Wallet inflow - Funding for payroll",
    amount: 12500000,
    status: "Completed",
    date: "Jul 24, 2024 | 12:45pm",
  },
  {
    id: "TX-20250714-001",
    description: "Wallet inflow - Funding for payroll",
    amount: 12500000,
    status: "Failed",
    date: "Jul 24, 2024 | 12:45pm",
  },
  {
    id: "TX-20250714-001",
    description: "Wallet inflow - Funding for payroll",
    amount: 12500000,
    status: "Pending",
    date: "Jul 24, 2024 | 12:45pm",
  },
]);

const searchQuery = ref("");
const statusFilter = ref("All status");
const showStatusDropdown = ref(false);
const currentPage = ref(1);
const totalPages = ref(3);
const totalItems = ref(30);

const statusOptions = [
  "All status",
  "Completed",
  "Pending",
  "Processing",
  "Failed",
  "Refunded",
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Completed":
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
    filtered = filtered.filter((transaction) =>
      transaction.id.toLowerCase().includes(searchQuery.value.toLowerCase())
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
};

// Initialize user store
const userStore = useUserStore();
const showProfileAction = ref(false);
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
                placeholder="Search transaction ID"
                class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <!-- Status Filter -->
          <div class="relative">
            <button
              @click="showStatusDropdown = !showStatusDropdown"
              class="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <span>{{ statusFilter }}</span>
              <IArrowDown :color="'#6B7280'" />
            </button>

            <!-- Dropdown Menu -->
            <div
              v-if="showStatusDropdown"
              class="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10"
            >
              <div class="py-1">
                <button
                  v-for="option in statusOptions"
                  :key="option"
                  @click="
                    [(statusFilter = option), (showStatusDropdown = false)]
                  "
                  class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  {{ option }}
                </button>
              </div>
            </div>
          </div>

          <!-- Sort Button -->
          <button
            class="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 10h16M4 14h16M4 18h16"
              ></path>
            </svg>
            <span>Sort</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Transaction Table -->
    <div class="bg-white rounded-lg">
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
                v-for="transaction in filteredTransactions"
                :key="transaction.id"
                class="text-black-100"
              >
                <td class="py-4 whitespace-nowrap">
                  <span class="text-sm font-semimedium">{{
                    transaction.id
                  }}</span>
                </td>
                <td class="py-4 whitespace-nowrap">
                  <span class="text-sm font-semimedium">{{
                    transaction.description
                  }}</span>
                </td>
                <td class="py-4 whitespace-nowrap">
                  <span class="text-sm font-semimedium">
                    ₦{{ currency(transaction.amount) }}
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
                    transaction.date
                  }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Pagination -->
      <div class="px-6 mt-12 flex items-center justify-between">
        <span class="opacity-50 text-sm font-semimedium">
          Showing 1-10 of {{ totalItems }} items
        </span>

        <div class="flex items-center space-x-2">
          <button
            v-for="page in totalPages"
            :key="page"
            @click="goToPage(page)"
            :class="[
              'w-8 h-8 text-sm font-medium rounded-full flex items-center justify-center',
              currentPage === page
                ? 'bg-green-600 text-white'
                : 'text-gray-500 hover:text-gray-700',
            ]"
          >
            {{ page }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom styles for the transaction history page */
</style>
