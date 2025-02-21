<script>
import { defineComponent, onMounted, ref, computed } from "vue";
import { useCompanyStore, useEmployeeStore } from "../../../store/index";
import { useRouter } from "vue-router";
import EmptyState from "../../../components/EmptyState.vue";
import { ICaretUpDown, IUserThree } from "../../../core/icons";

export default defineComponent({
  name: "CompanyTable",
  components: {
    ICaretUpDown,
    EmptyState,
    IUserThree,
  },
  setup() {
    const companyStore = useCompanyStore();
    const employeeStore = useEmployeeStore();
    const totalEmployeeCount = ref({}); // Fix: Initialize as empty object
    const companies = ref([]);
    const loading = ref(false);
    const router = useRouter();
    const currentPage = ref(1);
    const totalPages = ref(1);
    const pageSize = 10;
    const totalItems = ref(0);

    const filterType = ref("all"); // 'all', 'active', 'inactive'
    const showFilterDropdown = ref(false);

    const fetchCompanies = async (page = 1) => {
      loading.value = true;
      try {
        const response = await companyStore.fetchCompany(pageSize, page);
        console.log(response);

        if (response && Array.isArray(response.pageItems)) {
          companies.value = response.pageItems;
          currentPage.value = response.currentPage || 1;
          totalPages.value = response.numberOfPages || 1;
          totalItems.value = response.totalItems || 0;

          // Fetch employee count for each company
          response.pageItems.forEach((company) =>
            fetchTotalEmployeeCount(company.id)
          );
        } else {
          console.warn("Unexpected API response structure:", response);
          companies.value = [];
        }
      } catch (error) {
        console.error("Error fetching companies:", error);
        companies.value = [];
      } finally {
        loading.value = false;
      }
    };

    // Compute filtered companies
    const filteredCompanies = computed(() => {
      return (companies.value || []).filter((company) => {
        if (filterType.value === "active") return company.isActive;
        if (filterType.value === "inactive") return !company.isActive;
        return true; // 'all' case
      });
    });

    const formatDate = (dateString) => {
      if (!dateString) return "N/A";
      const date = new Date(dateString);
      return date.toLocaleDateString();
    };

    const isEmpty = computed(() => filteredCompanies.value.length === 0);

    const startItem = computed(() => (currentPage.value - 1) * pageSize + 1);
    const endItem = computed(() =>
      Math.min(currentPage.value * pageSize, totalItems.value)
    );

    const goToPage = (page) => {
      if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page;
        fetchCompanies(currentPage.value);
      }
    };

    const toggleFilterDropdown = () => {
      showFilterDropdown.value = !showFilterDropdown.value;
    };

    const setFilterType = (type) => {
      filterType.value = type;
      showFilterDropdown.value = false;
      fetchCompanies(currentPage.value);
    };

    const fetchTotalEmployeeCount = async (organisationId) => {
      try {
        const response = await employeeStore.getEmployeeCount(
          Number(organisationId)
        );
        if (response?.data) {
          totalEmployeeCount.value[organisationId] = response.data.data;
        }
      } catch (error) {
        console.error(
          `Failed to fetch employee count for company ${organisationId}:`,
          error
        );
      }
    };

    onMounted(() => {
      fetchCompanies(currentPage.value);
    });

    return {
      loading,
      formatDate,
      isEmpty,
      currentPage,
      totalPages,
      totalItems,
      startItem,
      endItem,
      goToPage,
      filteredCompanies,
      setFilterType,
      toggleFilterDropdown,
      showFilterDropdown,
      filterType,
      router,
      totalEmployeeCount,
    };
  },
});
</script>

<template>
  <div
    class="bg-white rounded-t-lg divide-y divide-grey-200 overflow-auto scrollbar-hide w-full"
  >
    <div class="p-8 bg-transparent">
      <div class="flex justify-between flex-col border-b border-grey-200">
        <div>
          <p class="font-bold text-2xl">Companies</p>
        </div>

        <!-- Filter Button -->
        <div class="relative">
          <button
            class="flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-lg text-sm text-[#306651]"
            @click="toggleFilterDropdown"
          >
            <span>
              {{
                filterType === "all"
                  ? "All Companies"
                  : filterType === "active"
                  ? "Active Companies"
                  : "Inactive Companies"
              }}
            </span>
            <ICaretUpDown class="w-4 h-4" />
          </button>

          <!-- Dropdown Menu -->
          <div
            v-if="showFilterDropdown"
            class="absolute left-0 mt-2 w-48 bg-white border border-grey-200 rounded-lg shadow-lg z-10"
          >
            <button
              class="w-full text-left px-4 py-2 hover:bg-gray-100"
              @click="setFilterType('all')"
            >
              All Companies
            </button>
            <button
              class="w-full text-left px-4 py-2 hover:bg-gray-100"
              @click="setFilterType('active')"
            >
              Active Companies
            </button>
            <button
              class="w-full text-left px-4 py-2 hover:bg-gray-100"
              @click="setFilterType('inactive')"
            >
              Inactive Companies
            </button>
          </div>
        </div>
      </div>

      <!-- Loader -->
      <div v-if="loading" class="flex justify-center items-center py-8">
        <div
          class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"
        ></div>
      </div>

      <!-- Empty State -->
      <EmptyState v-else-if="isEmpty">
        <template #icon>
          <IUserThree />
        </template>
        <template #heading> Companies </template>
        <template #desc> No company available </template>
      </EmptyState>

      <!-- Company Table -->
      <div v-else class="py-6">
        <table class="min-w-full table-fixed">
          <thead class="text-black-200 text-sm text-left">
            <tr>
              <th class="py-4 font-normal text-left">Name</th>
              <th class="py-4 font-normal text-left">Date added</th>
              <th class="py-4 font-normal text-left">No of employees</th>
              <th class="py-4 font-normal text-left">Admin</th>
              <th class="py-4 font-normal text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="company in filteredCompanies" :key="company.id">
              <td class="py-4">{{ company.name }}</td>
              <td class="py-4">{{ formatDate(company.dateAdded) }}</td>
              <td class="py-4">{{ totalEmployeeCount[company.id] ?? 0 }}</td>
              <td class="py-4">
                {{ company.admin?.firstname || "--" }}
                {{ company.admin?.lastname || "--" }} <br />
                <span class="text-xs">{{ company.admin?.email || "N/A" }}</span>
              </td>
              <td class="py-4">
                <button
                  @click="
                    router.push(
                      `/dashboard/company-settings/${company.id}/company-information`
                    )
                  "
                  class="text-[#003b3d] bg-red-light px-4 py-2 rounded-full"
                >
                  View Company
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- Pagination -->
      <div class="px-6 mt-8 flex items-center justify-between">
        <span class="opacity-50 text-sm font-semimedium">
          Showing {{ startItem }}-{{ endItem }} of {{ totalItems }} items
        </span>

        <div class="flex items-center space-x-2">
          <button
            v-for="page in totalPages"
            :key="page"
            @click="goToPage(page)"
            :class="{
              'text-white bg-[#003b3d] text-sm font-semibold w-8 h-8 flex items-center justify-center rounded-full':
                currentPage === page,
              'text-sm w-8 h-8 flex items-center justify-center rounded-full border opacity-50':
                currentPage !== page,
            }"
          >
            {{ page }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
