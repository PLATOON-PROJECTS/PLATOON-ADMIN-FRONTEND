<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import useVuelidate from "@vuelidate/core";
import {
  email,
  helpers,
  minLength,
  sameAs,
  required,
} from "@vuelidate/validators";
import ButtonBlue from "../../components/buttons/ButtonBlue.vue";
import { IEyeOpened } from "../../core/icons";
import SuccessAlert from "../../components/alerts/SuccessAlert.vue";
import { request } from "../../composables/request.composable";
import handleError from "../../composables/handle_error.composable";
import handleSuccess from "../../composables/handle_success.composable";
import spinner from "../../components/timer/Spinner.vue";
import { useAuthStore, useUserStore } from "../../store/index";
import { stringValidate, numberValidate } from "../../validations/validate";
import { storeItem, getItem } from "../../core/utils/storage.helper";
// store initializaion
// initialize store
const authStore = useAuthStore();
const userStore = useUserStore();

// variables
const loading = ref(false);
let data = ref<{
  firstname: string | null;
  lastname: string | null;
  telephone: string | null;
  email: string | null;
  password: string | null;
  confirmPassword: string | null;
  photo: string | null;
}>({
  firstname: null,
  lastname: null,
  telephone: null,
  email: null,
  password: null,
  confirmPassword: null,
  photo: null,
});
const showSuccess = ref(false);
const disabled = ref(true);
const valid = ref(false);
const is_open = ref(false);
const responseData = ref<any>({ message: "Action successful" });
// methods

const onInput = (phone: number, phoneObject: any, input: any) => {
  if (phoneObject?.formatted) {
    data.value.telephone = phoneObject.number;
    valid.value = phoneObject.valid;
  }
};

const validatePhone = () => {
  return valid.value;
};
const updateProfile = async () => {
  // check if form is formattted correctly
  const isFormCorrect = await v$.value.$validate();

  if (isFormCorrect == true) {
    const dataObj = {
      email: v$.value.email.$model as string,
      password: v$.value.password.$model as string,
      firstname: v$.value.firstname.$model as string,
      lastname: v$.value.lastname.$model as string,
      telephone: v$.value.telephone.$model as string,
      confirmPassword: v$.value.confirmPassword.$model as string,
      // photo: data.photo as any,
    };

    loading.value = true;
    const response = await request(authStore.updateProfile(dataObj), loading);

    handleError(response, userStore);
    const successResponse = handleSuccess(response, showSuccess);

    if (successResponse && typeof successResponse !== "undefined") {
      // remove previously stored item and add a new one
      sessionStorage.removeItem(import.meta.env.VITE_USERDETAILS);

      const data = JSON.stringify({
        customerInfo: {
          firstName: successResponse.data.data.firstname,
          lastName: successResponse.data.data.lastname,
          email: successResponse.data.data.email,
          phone: successResponse.data.data.phone,
        },
      });

      storeItem(import.meta.env.VITE_USERDETAILS, data);

      responseData.value = successResponse;
    }
  }
};

const getProfile = async () => {
  const response = await request(authStore.getProfile());

  // handleError(response, userStore);
  const successResponse = handleSuccess(response);

  if (successResponse && typeof successResponse !== "undefined") {
    // console.log(successResponse.data);
    data.value = successResponse.data.data;
    // console.log(data, 'red');
  }
};

// getProfile();
// validations rule
const rules = computed(() => {
  return {
    email: {
      email: helpers.withMessage("Must be a valid email", email),
    },

    confirmPassword: {
      sameAsPassword: sameAs(data.value.password, "password"),
    },
    password: {
      min: helpers.withMessage(
        "Password cannot be less than 8 characters",
        minLength(8)
      ),
    },
    firstname: {
      stringValidate: helpers.withMessage(
        "First name can only include alphabets",
        () => stringValidate(data.value.firstname as string) as any
      ),
    },
    lastname: {
      stringValidate: helpers.withMessage(
        "Last name can only include alphabets",
        () => stringValidate(data.value.lastname as string) as any
      ),
    },
    telephone: {
      required: helpers.withMessage("Telephone is required", required),
      validatePhone: helpers.withMessage("Invalid Phone Number", validatePhone),
    },
  };
});

const v$ = useVuelidate(rules as any, data);
</script>
<template>
  <div class="px-6 py-9 space-y-6 cursor-pointer">
    <successAlert
      :showSuccess="showSuccess"
      @closeSuccess="showSuccess = false"
      v-if="showSuccess == true"
    >
      <template #otherMessage>CLOSE</template>
      {{ responseData.message }}</successAlert
    >
    <h3 class="text-black-rgba font-medium text-2xl">Settings</h3>

    <div class="bg-white min-h-screen rounded-t-lg p-6 space-y-9 h-auto">
      <div
        class="flex items-center justify-between overflow-auto scrollbar-hide lg:space-x-0 space-x-3"
      >
        <div>
          <h3 class="text-black-rgba font-medium text-base">Manage Settings</h3>
          <h3 class="mt-6 text-black-rgba font-medium text-base">
            Company Settings
          </h3>
          <span class="text-sm text-[#626669A3]"
            >This company payroll fee will updated and saved.</span
          >
        </div>

        <ButtonBlue @click="updateProfile" :disabled="disabled">
          <template #placeholder>
            <spinner v-if="loading == true" /> <span v-else>Save Changes</span>
          </template>
        </ButtonBlue>
      </div>

      <div class="relative w-[30%] text-[#626669]">
        <label for="Payroll fee" class="mb-4"> Payroll fee</label>
        <input
          @click="disabled = false"
          type="payroll"
          id="Payroll"
          maxlength="54"
          class="input-float text-black peer pr-10.5"
          placeholder=""
        />

        <div v-if="v$.email.$error" class="text-red-600 text-xs">
          {{ "* " + v$.email.$errors[0].$message }}
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.telinput {
  border: 1px solid black;
  border-radius: 7px;
}
</style>
