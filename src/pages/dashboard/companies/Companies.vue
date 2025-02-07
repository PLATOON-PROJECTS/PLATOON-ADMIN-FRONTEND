<script>
import { defineComponent, onMounted, ref, computed } from "vue";
import { useCompanyStore } from "../../../store/index";
import { useRouter } from "vue-router";
import EmptyState from "../../../components/EmptyState.vue";

export default defineComponent({
  name: "CompanyTable",
  setup() {
    const companyStore = useCompanyStore();
    const companies = ref([]);
    const loading = ref(false);
    const router = useRouter();
    const currentPage = ref(1);
    const totalPages = ref(1);
    const pageSize = 10;
    const totalItems = ref(0);

    const fetchCompanies = async (page = 1) => {
      loading.value = true;
      try {
        const response = await companyStore.fetchCompany(pageSize, page);
        console.log("API Response:", response);

        if (response && Array.isArray(response.pageItems)) {
          companies.value = response.pageItems;
          currentPage.value = response.currentPage || 1;
          totalPages.value = response.numberOfPages || 1;
          totalItems.value =
            (response.pageSize || 10) * (response.numberOfPages || 1);
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

    // Computed property to display companies in reverse order (last index first)
    const sortedCompanies = computed(() => {
      return [...companies.value].reverse();
    });

    const formatDate = (dateString) => {
      if (!dateString) return "N/A";
      const date = new Date(dateString);
      return date.toLocaleDateString();
    };

    const isEmpty = computed(
      () => !sortedCompanies.value || sortedCompanies.value.length === 0
    );

    onMounted(() => {
      fetchCompanies(currentPage.value);
    });

    const updatePage = (page) => {
      if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page;
        fetchCompanies(currentPage.value);
      }
    };

    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++;
        fetchCompanies(currentPage.value);
      }
    };

    const prevPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--;
        fetchCompanies(currentPage.value);
      }
    };

    return {
      sortedCompanies,
      loading,
      formatDate,
      isEmpty,
      currentPage,
      totalPages,
      totalItems,
      nextPage,
      prevPage,
      updatePage,
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
      <p class="font-bold text-2xl">Companies</p>

      <!-- Loader -->
      <div v-if="loading" class="flex justify-center items-center py-8">
        <div
          class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"
        ></div>
      </div>

      <!-- Company Table -->
      <table v-if="!isEmpty" class="min-w-full table-fixed">
        <thead class="text-black-200 text-sm text-left">
          <tr>
            <th scope="col" class="py-4 font-normal text-left">Name</th>
            <th scope="col" class="py-4 font-normal text-left">Date added</th>
            <th scope="col" class="py-4 font-normal text-left">
              No of employees
            </th>
            <th scope="col" class="py-4 font-normal text-left">Admin</th>
            <th scope="col" class="py-4 font-normal text-left">Action</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-grey-200">
          <tr
            v-for="company in sortedCompanies"
            :key="company.id"
            class="text-black-100"
          >
            <td class="py-4 whitespace-nowrap">{{ company.name }}</td>
            <td class="py-4 whitespace-nowrap">
              {{ formatDate(company.dateAdded) }}
            </td>
            <td class="py-4 whitespace-nowrap">{{ company.employeeCount }}</td>
            <td class="py-4 whitespace-nowrap">
              {{ company.admin?.firstname || "N/A" }}
              {{ company.admin?.lastname || "" }}
            </td>
            <td class="py-4 text-left whitespace-nowrap w-[18%]">
              <button
                @click="
                  router.push(
                    `/dashboard/company-settings/${company.id}/company-information`
                  )
                "
                class="text-[#003b3d] bg-red-light text-sm font-bold px-4 py-2 rounded-full"
              >
                View Company
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Empty State -->
      <EmptyState v-else>
        <template #icon>
          <IUserThree />
        </template>
        <template #heading> Companies </template>
        <template #desc> No company available </template>
      </EmptyState>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex justify-between mt-4">
        <button
          @click="prevPage"
          :disabled="currentPage === 1"
          class="px-4 py-2 text-sm bg-gray-200 rounded disabled:opacity-50"
        >
          Previous
        </button>

        <span class="text-sm font-medium">
          Page {{ currentPage }} of {{ totalPages }}
        </span>

        <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="px-4 py-2 text-sm bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>
