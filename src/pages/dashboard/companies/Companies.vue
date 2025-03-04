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
    class="p-8 flex flex-col gap-8 rounded-t-lg overflow-auto scrollbar-hide w-full"
  >
    <div class="bg-greey flex justify-between flex-col">
      <p class="font-bold text-2xl">Companies</p>

      <!-- Filter Button -->
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
    <div v-else class="py-6 bg-white rounded-t-xl flex flex-col">
      <div class="relative border-b border-grey-200 pb-4">
        <button
          class="flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-lg text-sm font-medium text-[#306651]"
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
          class="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10"
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

      <div class="align-middle inline-block min-w-full overflow-x-auto">
        <div class="overflow-hidden sm:rounded-lg">
          <table class="min-w-full border-collapse">
            <thead class="text-black-200 text-sm text-left">
              <tr>
                <th scope="col" class="py-3 px-4 text-left font-medium">
                  Name
                </th>
                <th scope="col" class="py-3 text-left font-medium">
                  Date Added
                </th>
                <th scope="col" class="py-3 text-center font-medium">
                  No of Employees
                </th>
                <th scope="col" class="py-3 text-left font-medium">Admin</th>
                <th scope="col" class="py-3 text-left font-medium">Action</th>
              </tr>
            </thead>

            <tbody class="bg-white divide-y divide-grey-200">
              <tr
                v-for="company in filteredCompanies"
                :key="company.id"
                class="text-gray-700"
              >
                <td class="py-4 whitespace-nowrap">
                  <span class="text-sm font-semimedium">{{
                    company.name
                  }}</span>
                </td>
                <td class="py-4 whitespace-nowrap">
                  <div class="text-left flex flex-col">
                    <span class="text-sm font-semimedium">
                      {{ formatDate(company.dateAdded) }}
                    </span>
                    <span class="text-xs text-green">{{
                      company.isActive ? "Active" : "Inactive"
                    }}</span>
                  </div>
                </td>
                <td class="py-4 whitespace-nowrap">
                  <div class="font-normal text-center flex flex-col">
                    <span class="text-sm font-semimedium">
                      {{ totalEmployeeCount[company.id] ?? 0 }}
                    </span>
                  </div>
                </td>
                <td class="py-4 w-[25%]">
                  <div class="flex items-center space-x-3 flex-shrink-0">
                    <div class="flex flex-col">
                      <span class="text-sm font-semimedium">
                        {{ company.admin?.firstname || "--" }}
                        {{ company.admin?.lastname || "--" }}
                      </span>
                      <span class="text-xs text-gray-rgba-3 flex">
                        {{ company.admin?.email || "N/A" }}
                      </span>
                    </div>
                  </div>
                </td>
                <td class="py-4 text-left whitespace-nowrap w-[18%]">
                  <div class="flex items-center justify-between">
                    <button
                      @click="
                        router.push(
                          `/dashboard/company-settings/${company.id}/company-information`
                        )
                      "
                      class="text-[#003b3d] bg-red-light text-sm text-bold px-4+1 py-2 rounded-full"
                    >
                      View Company
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Pagination -->
      <div class="px-6 mt-12 flex items-center justify-between">
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
<style scoped></style>
