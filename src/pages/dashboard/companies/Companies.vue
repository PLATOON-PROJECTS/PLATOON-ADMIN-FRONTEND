<script>
import { defineComponent, onMounted, ref } from "vue";
import { useCompanyStore } from "../../../store/index";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "CompanyTable",
  setup() {
    const companyStore = useCompanyStore();
    const companies = ref([]);
    const loading = ref(false);
    const router = useRouter();

    // Pagination states
    const currentPage = ref(1);
    const itemsPerPage = ref(10); // Show 10 items per page

    const fetchCompanies = async () => {
      loading.value = true; // Show loader
      try {
        const data = await companyStore.fetchCompany(
          itemsPerPage.value,
          currentPage.value
        );
        companies.value = data;
      } catch (error) {
        console.error("Failed to fetch companies:", error);
      } finally {
        loading.value = false; // Hide loader
      }
    };

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    };

    // Pagination functions
    const nextPage = () => {
      currentPage.value++;
      fetchCompanies();
    };

    const prevPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--;
        fetchCompanies();
      }
    };

    onMounted(() => {
      fetchCompanies();
    });

    return {
      companies,
      formatDate,
      router,
      loading,
      currentPage,
      itemsPerPage,
      nextPage,
      prevPage,
    };
  },
});
</script>

<template>
  <div
    class="bg-white rounded-t-lg divide-y divide-grey-200 overflow-auto scrollbar-hide w-full"
  >
    <div class="p-8 bg-transparent">
      <div>
        <p class="font-bold text-2xl">Companies</p>
      </div>

      <!-- Loader -->
      <div v-if="loading" class="flex justify-center items-center py-8">
        <div
          class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"
        ></div>
      </div>

      <!-- Table -->
      <table v-else class="min-w-full table-fixed">
        <thead class="text-black-200 text-sm text-left">
          <tr>
            <th
              scope="col"
              class="py-4 font-normal text-left flex items-center space-x-3 flex-shrink-0"
            >
              Name
            </th>
            <th scope="col" class="py-4 font-normal text-left">Date added</th>
            <th scope="col" class="py-4 font-normal text-left">
              No of employees
            </th>
            <th scope="col" class="py-4 font-normal text-left">Admin.</th>
            <th scope="col" class="py-4 font-normal text-left">Action</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-grey-200">
          <tr
            v-for="company in companies"
            :key="company.id"
            class="text-black-100"
          >
            <td
              class="py-4 whitespace-nowrap flex items-center space-x-3 flex-shrink-0"
            >
              <div class="font-normal text-left flex flex-col">
                <span class="text-sm font-semimedium">{{ company.name }}</span>
                <span class="text-xs text-gray-rgba-3">{{
                  company.admin.email
                }}</span>
              </div>
            </td>
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
                <span class="text-sm font-semimedium">
                  {{ company.employeeCount }}
                </span>
              </div>
            </td>

            <td
              class="py-4 whitespace-nowrap flex items-center space-x-3 flex-shrink-0"
            >
              <div class="font-normal text-left flex flex-col">
                <span class="text-sm font-semimedium"
                  >{{ company.admin.firstname }}
                  {{ company.admin.lastname }}
                </span>
                <span class="text-xs text-gray-rgba-3">{{
                  company.admin.email
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
                  class="text-[#003b3d] bg-red-light text-sm text-bold px-4+1 py-2 rounded-full"
                >
                  View Company
                </button>
                <button>
                  <IMenuVertical />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
