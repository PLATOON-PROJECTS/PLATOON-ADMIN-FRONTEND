<script>
import { defineComponent, onMounted, ref, computed } from "vue";
import { useCompanyStore } from "../../../store/index";
import { useRouter } from "vue-router";
import EmptyState from "../../../components/EmptyState.vue";
import { ICaretUpDown, IUserThree } from "../../../core/icons";

export default defineComponent({
  name: "CompanyTable",
  components: {
    ICaretUpDown,
  },
  setup() {
    const companyStore = useCompanyStore();
    const companies = ref([]);
    const loading = ref(false);
    const router = useRouter();
    const currentPage = ref(1);
    const totalPages = ref(1);
    const pageSize = 10;
    const totalItems = ref(0);

    // Reactive variable for filter type
    const filterType = ref("all"); // 'all', 'active', or 'inactive'
    const showFilterDropdown = ref(false); // To toggle dropdown visibility

    const fetchCompanies = async (page = 1) => {
      loading.value = true;
      try {
        const response = await companyStore.fetchCompany(pageSize, page);
        console.log("API Response:", response);

        if (response && Array.isArray(response.pageItems)) {
          companies.value = response.pageItems;
          currentPage.value = response.currentPage || 1;
          totalPages.value = response.numberOfPages || 1;
          totalItems.value = response.totalItems || 0; // Adjusted to use totalItems from response
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

    // Computed property to filter companies
    const filteredCompanies = computed(() => {
      if (filterType.value === "active") {
        return companies.value.filter((company) => company.isActive);
      } else if (filterType.value === "inactive") {
        return companies.value.filter((company) => !company.isActive);
      }
      return companies.value; // Show all companies
    });

    const formatDate = (dateString) => {
      if (!dateString) return "N/A";
      const date = new Date(dateString);
      return date.toLocaleDateString();
    };

    const isEmpty = computed(
      () => !filteredCompanies.value || filteredCompanies.value.length === 0
    );

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
      showFilterDropdown.value = !showFilterDropdown.value; // Toggle dropdown visibility
    };

    const setFilterType = (type) => {
      filterType.value = type;
      showFilterDropdown.value = false; // Close dropdown after selection
      fetchCompanies(currentPage.value); // Fetch companies again with the new filter
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
            <span>{{
              filterType === "all"
                ? "All Companies"
                : filterType === "active"
                ? "Active Companies"
                : "Inactive Companies"
            }}</span>
            <ICaretUpDown class="w-4 h-4" />
          </button>

          <!-- Dropdown Menu -->
          <div
            v-if="showFilterDropdown"
            class="absolute left-0 mt-2 w-48 bg-white border border-grey-200 rounded-lg shadow-lg z-10"
          >
            <button
              class="w-full text-left px-4 py-2 text-grey-300 hover:bg-gray-100"
              @click="setFilterType('all')"
            >
              All Companies
            </button>
            <button
              class="w-full text-left px-4 py-2 text-grey-300 hover:bg-gray-100"
              @click="setFilterType('active')"
            >
              Active Companies
            </button>
            <button
              class="w-full text-left px-4 py-2 text-grey-300 hover:bg-gray-100"
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
        <div class="align-middle inline-block min-w-full">
          <fieldset class="overflow-hidden sm:rounded-lg">
            <table class="min-w-full table-fixed">
              <thead class="text-black-200 text-sm text-left">
                <tr>
                  <th scope="col" class="py-4 font-normal text-left">Name</th>
                  <th scope="col" class="py-4 font-normal text-left">
                    Date added
                  </th>
                  <th scope="col" class="py-4 font-normal text-left">
                    No of employees
                  </th>
                  <th scope="col" class="py-4 font-normal text-left">Admin</th>
                  <th scope="col" class="py-4 font-normal text-left">Action</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-grey-200">
                <tr
                  v-for="company in filteredCompanies"
                  :key="company.id"
                  class="text-black-100"
                >
                  <td class="py-4 whitespace-nowrap">{{ company.name }}</td>
                  <td class="py-4 whitespace-nowrap">
                    <div class="text-left flex flex-col">
                      <span class="text-sm font-semimedium">{{
                        formatDate(company.dateAdded)
                      }}</span>
                      <span class="text-xs text-green">{{
                        company.isActive ? "Active" : "Inactive"
                      }}</span>
                    </div>
                  </td>
                  <td class="py-4 whitespace-nowrap">
                    <div class="font-normal text-left flex flex-col">
                      <span class="text-sm font-semimedium">{{
                        company.employeeCount || 0
                      }}</span>
                      <span class="text-xs text-gray-rgba-3">Employee</span>
                    </div>
                  </td>
                  <td class="py-4 whitespace-nowrap">
                    <div class="text-left flex flex-col">
                      <span class="text-sm font-semimedium">
                        {{ company.admin.firstname || "--" }}
                        {{ company.admin.lastname || "--" }}
                      </span>
                      <span class="text-xs text-green">{{
                        company.admin.email || "N/A"
                      }}</span>
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
                        class="text-[#003b3d] bg-red-light text-sm text-bold px-4 py-2 rounded-full"
                      >
                        View Company
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </fieldset>
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
  </div>
</template>
