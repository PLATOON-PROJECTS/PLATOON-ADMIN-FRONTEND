<script setup lang="ts">
import { ref, inject } from "vue";
import { useRoute } from "vue-router";
import SuccessAlert from "../../../components/alerts/SuccessAlert.vue";
import spinner from "../../../components/timer/Spinner.vue";
import { IArrowDown } from "../../../core/icons";
import ButtonLightBlue from "../../../components/buttons/ButtonLightBlue.vue";
import errorType from "../../../constants/ErrorTypes";
import {
  useCompanyStore,
  useUserStore,
  useAuthStore,
} from "../../../store/index";
import { request } from "../../../composables/request.composable";
import handleError from "../../../composables/handle_error.composable";
import handleSuccess from "../../../composables/handle_success.composable";

// initialize store
const companyStore = useCompanyStore();
const userStore = useUserStore();
const authStore = useAuthStore();

// variables
const showSuccess = ref(false);
const loading = ref(false);
const disabled = ref(true);
const profile = ref<any>();
// const defaultCompanyId = ref("");
const responseData = ref({ data: null, message: "" });
const route = useRoute();
let defaultCompanyId = Array.isArray(route.params.id)
  ? route.params.id[0]
  : route.params.id;

// providers and injectors
const render = inject<any>("render");

// methods
const getProfile = async () => {
  const response = await request(authStore.getProfile());

  // handleError(response, userStore);
  const successResponse = handleSuccess(response);

  if (successResponse && typeof successResponse !== "undefined") {
    profile.value = successResponse.data;

    successResponse.data.data.companies.forEach((company: any) => {
      if (company.is_default == true) {
        // console.log(true, company);
        defaultCompanyId;
        disabled.value = false;
      }
    });
  }
};

const deleteCompany = async () => {
  // console.log("Delete hit", defaultCompanyId.value, disabled.value);
  loading.value = true;

  // if there is no default company
  if (defaultCompanyId !== "" && disabled.value == false) {
    const response = await request(
      companyStore.delete(defaultCompanyId),
      loading
    );

    // console.log(response);
    handleError(response, userStore);
    const successResponse = handleSuccess(response, showSuccess);

    if (successResponse && typeof successResponse !== "undefined") {
      // console.log(successResponse);

      responseData.value.message = `Default company with id ${defaultCompanyId}  deleted successfully`;

      setTimeout(() => {
        render.value = true;
      }, 3000);
    }
  } else {
    userStore.error.type = errorType.userError;
    loading.value = false;
    userStore.error.message =
      "You do not have a default company at the moment. try adding a company  or switching to an existing company ";
    userStore.error.value = true;
  }
};

// getProfile();
</script>
<template>
  <div class="sm:flex px-6">
    <successAlert
      :showSuccess="showSuccess"
      @closeSuccess="showSuccess = false"
      v-if="showSuccess == true"
    >
      <template #otherMessage>CLOSE</template>
      {{ responseData.message }}</successAlert
    >
    <div class="flex-1 space-y-12">
      <div class="">
        <div class="space-y-1">
          <p class="text-base font-medium">Delete Company</p>
          <p class="text-sm text-gray-rgba-3">
            This action is not reversible and it will automatically remove all
            your company data, employees data, admin acess and all related data.
            <br />Kindly provide password to proceed
          </p>
        </div>
      </div>
      <div class="space-y-8">
        <div class="grid lg:grid-cols-2 pt-7 gap-4">
          <div class="relative">
            <input
              type="text"
              id="NameofCompany"
              maxlength="55"
              class="input-float peer pr-10.5"
            />
            <label
              for="NameofCompany"
              class="input-float-label peer-focus:text-black-100 peer-placeholder-shown:scale-75 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:px-2"
            >
              Enter Super Admin Password</label
            >
          </div>
        </div>
        <!--  -->
        <div class="flex">
          <ButtonLightBlue @click="deleteCompany" textColor="text-red">
            <template v-slot:placeholder>
              <spinner v-if="loading == true" />
              <span v-else>Delete Company</span>
            </template>
          </ButtonLightBlue>
        </div>
      </div>
    </div>
    <div class="flex-1"></div>
  </div>
</template>

<style scoped></style>
