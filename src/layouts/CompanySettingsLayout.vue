<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import spinner from "../components/timer/Spinner.vue";
import { IArrowLeftTail } from "../core/icons";
import ButtonBlue from "../components/buttons/ButtonBlue.vue";
import { useCompanyStore } from "../store/index";
import { request } from "../composables/request.composable";
import handleError from "../composables/handle_error.composable";

const childComponent = ref<any>();
const route = useRoute();
const router = useRouter();
const companyData = ref<any[]>([]); // This will store the fetched company data
const companyStore = useCompanyStore();
const loading = ref(false);
const responseData = ref<any>({ data: [], message: "" });
const successMessage = ref("Action successful");
const confirmMessage = ref({ message: "", id: "" });
const showConfirm = ref(false);
const showSuccess = ref(false);

const organisationId = Array.isArray(route.params.id)
  ? route.params.id[0]
  : route.params.id;

const fetchCompaniesById = async () => {
  loading.value = true;

  try {
    const response = await request(
      companyStore.companyById(Number(organisationId))
    );
    loading.value = true;

    if (response && response.data) {
      companyData.value = [response.data.data]; // Wrap the data in an array for consistency
    } else {
      console.error("No data found in response:", response);
    }
  } catch (error) {
    console.error("Failed to fetch company:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchCompaniesById();
});

const removeUser = async (organisationId: string) => {
  loading.value = true;

  try {
    const response = await companyStore.delete(organisationId);
    if (response) {
      responseData.value = responseData.value.filter(
        (data: any) => data.organisationId !== organisationId
      );
      successMessage.value = `User was successfully deleted`;
    }
  } catch (error) {
    handleError(error, "Error deleting user");
  } finally {
    loading.value = false;
  }
};

const confirmRemoveUser = (id: string) => {
  confirmMessage.value.message = `Do you really want to delete this user `;
  confirmMessage.value.id = id;
  showConfirm.value = true;
};

const activeTab = computed(() => route.path);
const emit = defineEmits<{ (e: "fetchCompanies"): void }>();

const save = () => {
  childComponent.value.saveChanges().then(() => {
    emit("fetchCompanies");
  });
};
</script>

<template>
  <!-- confirm alert -->
  <confirmAlert
    :showConfirm="showConfirm"
    @closeConfirm="showConfirm = false"
    v-if="showConfirm == true"
  >
    <template #title> Delete</template>

    <template #confirm
      ><span @click="[removeUser(confirmMessage.id), (showConfirm = false)]"
        >CONFIRM</span
      ></template
    >
    <template #message> {{ confirmMessage.message }}</template>
  </confirmAlert>

  <!-- successAlert -->
  <successAlert
    :showSuccess="showSuccess"
    @closeSuccess="showSuccess = false"
    v-if="showSuccess == true"
  >
    <template #otherMessage>CLOSE</template>
    {{ successMessage }}</successAlert
  >
  <spinner
    v-if="loading == true"
    class="flex justify-center items-center lg:h-[400px] h-[300px]"
  />

  <div class="px-6 py-9">
    <!-- Iterate over companyData to display each company's details -->
    <div v-for="company in companyData" :key="company.id">
      <div class="space-y-6">
        <div
          class="bg-white py-6 h-[10rem] px-4 rounded-t-lg items-center text-black-200 cursor-pointer text-sm justify-between flex space-x-8 whitespace-nowrap overflow-auto scrollbar-hide"
        >
          <div class="flex flex-col">
            <div class="flex items-start space-x-5-1">
              <button @click="router.back()">
                <IArrowLeftTail />
              </button>
              <div>
                <!-- Bind the company name to the <h3> element -->
                <h3
                  class="text-black-rgba font-medium lg:text-2xl text-lg whitespace-nowrap"
                >
                  {{ company.name }}
                  <!-- Display the company name here -->
                </h3>
                <span class="text-sm text-gray-rgba-3">Manage Company</span>
              </div>
            </div>
            <div>
              <div class="w-full flex space-x-6 border-b border-grey pt-7">
                <span
                  @click="
                    router.push(
                      `/dashboard/company-settings/${organisationId}/company-information`
                    )
                  "
                  :class="[
                    activeTab.includes('company-information')
                      ? 'border-b-2 border-[#003b3d] pb-7 text-[#003b3d] font-semimedium'
                      : '',
                    'font-normal cursor-pointer',
                  ]"
                >
                  Company Information
                </span>

                <span
                  @click="
                    router.push(
                      `/dashboard/company-settings/${organisationId}/contact-information`
                    )
                  "
                  :class="[
                    activeTab.includes('contact-information')
                      ? 'border-b-2 border-blue pb-7 text-blue font-semimedium'
                      : '',
                    'font-normal cursor-pointer',
                  ]"
                >
                  Contact Information
                </span>

                <span
                  @click="
                    router.push(
                      `/dashboard/company-settings/${organisationId}/payroll-history`
                    )
                  "
                  :class="[
                    activeTab.includes('payroll-history')
                      ? 'border-b-2 border-blue pb-7 text-blue font-semimedium'
                      : '',
                    'font-normal cursor-pointer',
                  ]"
                >
                  Payroll History
                </span>

                <span
                  @click="
                    router.push(
                      `/dashboard/company-settings/${organisationId}/employees-logs`
                    )
                  "
                  :class="[
                    activeTab.includes('employees-logs')
                      ? 'border-b-2 border-blue pb-7 text-blue font-semimedium'
                      : '',
                    'font-normal cursor-pointer',
                  ]"
                >
                  Employees
                </span>

                <span
                  @click="
                    router.push(
                      `/dashboard/company-settings/${organisationId}/delete`
                    )
                  "
                  :class="[
                    activeTab.includes('delete')
                      ? 'border-b-2 border-[#003b3d] pb-7 text-[#003b3d] font-semimedium'
                      : '',
                    'font-normal cursor-pointer',
                  ]"
                >
                  Delete Company
                </span>
              </div>
            </div>
          </div>
          <div
            class="flex"
            v-if="
              activeTab.includes('company-information') ||
              activeTab.includes('contact-information')
            "
          >
            <div class="flex gap-4">
              <ButtonBlue
                @click="save"
                :disabled="childComponent?.disabled"
                :style="{ backgroundColor: '#FFB400', color: '#fff' }"
              >
                <template v-slot:placeholder>
                  <spinner v-if="loading" />
                  <span v-else>Suspend</span>
                </template>
              </ButtonBlue>

              <ButtonBlue
                @click="confirmRemoveUser(company.organisationId)"
                :disabled="childComponent?.disabled"
                class="bg-[#FF4C51] text-white hover:bg-red-600 disabled:bg-gray-300"
              >
                <template v-slot:placeholder>
                  <spinner v-if="loading" />
                  <span v-else>Delete</span>
                </template>
              </ButtonBlue>
            </div>
          </div>
        </div>
      </div>

      <router-view
        v-slot="{ Component }"
        class="bg-white py-6 min-h-[80vh] h-auto"
      >
        <component
          ref="childComponent"
          :is="Component"
          @loadingTrue="loading = true"
          @loadingFalse="loading = false"
        />
      </router-view>
    </div>
  </div>
</template>
