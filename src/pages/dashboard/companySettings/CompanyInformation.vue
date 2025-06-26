<script setup lang="ts">
import { ref, computed, provide, reactive, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { IArrowDown } from "../../../core/icons";
import { request } from "../../../composables/request.composable";
import handleError from "../../../composables/handle_error.composable";
import handleSuccess from "../../../composables/handle_success.composable";
import errorType from "../../../constants/ErrorTypes";
import SuccessAlert from "../../../components/alerts/SuccessAlert.vue";
import State from "../../../components/dropdowns/states.vue";
import Industries from "../../../components/dropdowns/industries.vue";
import City from "../../../components/dropdowns/cities.vue";
import { stringValidate, numberValidate } from "../../../validations/validate";
import { State as StateEnum } from "../../../interface/enums.interface";
// import {  } from "../../../interface/enums.interface";
import {
  useCompanyStore,
  useUserStore,
  useAuthStore,
} from "../../../store/index";
import useVuelidate from "@vuelidate/core";
import { email, helpers, required } from "@vuelidate/validators";

const router = useRouter();

// initialize store
const companyStore = useCompanyStore();
const userStore = useUserStore();
const authStore = useAuthStore();
// variables
const route = useRoute();

const showSuccess = ref(false);
const loading = ref(false);
const showState = ref(false);
const showIndustries = ref(false);
const showCity = ref(false);
const disabled = ref(true);
const profile = ref<any>();
const defaultCompanyId = ref("");
const companyData = ref<any[]>([]); // This will store the fetched company data

const responseData = ref({ message: "action successful" });
let data = ref<any>({
  name: "",
  email: "",
  telephone: "",
  city: "",
  country: "Nigeria",
  address: "",
  industry: "",
  currency: 1,
});
const valid = ref(false);

const state = ref<StateEnum>();
const industryState = ref<StateEnum>();
const city = ref();

// provide and inject
provide("showState", showState);
provide("selectedState", state);
provide("showIndustries", showIndustries);
provide("selectedIndustries", industryState);
provide("showCity", showCity);
provide("selectedCity", city);

// emits
const emit = defineEmits<{
  (e: "loadingTrue"): void;
  (e: "loadingFalse"): void;
}>();

const organisationId = route.params.id;

const fetchCompaniesById = async () => {
  loading.value = true;

  try {
    const response = await request(
      companyStore.companyById(Number(organisationId))
    );

    if (response && response.data) {
      companyData.value = [response.data.data]; // Wrap the data in an array for consistency
      console.log("KYC Data:", companyData);
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

const getProfile = async () => {
  const response = await request(authStore.getProfile());

  // handleError(response, userStore);
  const successResponse = handleSuccess(response);

  if (successResponse && typeof successResponse !== "undefined") {
    profile.value = successResponse.data;

    successResponse.data.data.companies.forEach((company: any) => {
      if (company.is_default == true) {
        // console.log(true, company);
        data.value.name = company?.name ? company.name : "";
        data.value.email = company?.email ? company.email : "";
        data.value.telephone = company?.telephone ? company.telephone : "";
        data.value.country = company?.country ? company.country : "";
        data.value.address = company?.address ? company.address : "";
        city.value = company?.city ? company.city : "";
        state.value = company?.state ? company.state : "";
        industryState.value = company?.industry ? company.industry : "";
        defaultCompanyId.value = company?.id;
      }
    });
  }
};
</script>

<template>
  <div v-if="loading" class="flex justify-center items-center py-8">
    <div
      class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"
    ></div>
  </div>

  <div
    class="bg-white lg:px-0 lg:flex justify-center pt-8 px-6 w-full min-h-screen"
    v-for="company in companyData"
    :key="company.id"
  >
    <div class="space-y-5">
      <div class="lg:w-[75%]">
        <div class="space-y-1">
          <p class="text-base font-medium">Company information</p>
          <p class="text-sm text-gray-rgba-3">
            Edit details as registered with CAC
          </p>
        </div>
      </div>
      <div class="space-y-8">
        <div class="pt-7 space-y-2">
          <p class="text-base font-medium text-black-rgba-100">Contact</p>

          <div class="grid sm:grid-cols-2 gap-4">
            <!-- Name -->
            <div class="relative">
              <input
                type="text"
                id="name"
                maxlength="100"
                placeholder="Name of Company"
                class="input-float peer pr-10.5"
                :value="company.name"
                readonly
                disabled
              />
            </div>

            <!-- Email Address -->
            <div class="relative">
              <input
                type="email"
                id="email"
                maxlength="100"
                placeholder="Email Address"
                class="input-float peer pr-10.5"
                :value="company.admin.email"
                readonly
                disabled
              />
            </div>

            <!-- Phone Number -->
            <div class="relative">
              <input
                type="tel"
                id="phone"
                maxlength="15"
                placeholder="Phone Number"
                class="input-float peer pr-10.5"
                readonly
                disabled
              />
            </div>

            <!-- Select Industry -->
            <div
              class="cursor-not-allowed font-normal items-center text-left rounded-lg px-2 border text-gray-rgba-3 flex justify-between bg-gray-100"
            >
              <input
                type="text"
                :value="industryState"
                class="rounded-lg text-sm text-black outline-none py-4 border-none focus:outline-none"
                placeholder="Select Industry"
                readonly
                disabled
              />
            </div>
          </div>

          <!-- Select State -->
          <div class="pt-7 space-y-2">
            <p class="text-base font-medium text-black-rgba-100">
              Company Location
            </p>
            <div class="grid sm:grid-cols-2 gap-4">
              <div class="relative w-full">
                <div
                  class="cursor-not-allowed font-normal items-center text-left rounded-lg px-2 border text-gray-rgba-3 flex justify-between bg-gray-100"
                >
                  <input
                    :value="company.contactInfo.state"
                    type="text"
                    class="rounded-lg text-black text-sm outline-none py-4 border-none focus:outline-none"
                    placeholder="Select State"
                    readonly
                    disabled
                  />
                </div>
              </div>

              <!-- City -->
              <div class="relative">
                <input
                  type="text"
                  id="city"
                  maxlength="100"
                  placeholder="City"
                  class="input-float peer pr-10.5"
                  :value="company.contactInfo.city"
                  readonly
                  disabled
                />
              </div>

              <!-- Company Address -->
              <div class="relative col-span-1">
                <textarea
                  id="address"
                  maxlength="255"
                  rows="4"
                  placeholder="Company Address"
                  class="input-float peer w-full pr-10.5"
                  :value="company.contactInfo.street"
                  readonly
                  disabled
                ></textarea>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
