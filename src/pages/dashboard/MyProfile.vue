<script setup lang="ts">
import { ref, reactive, computed, inject } from "vue";
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
  organisationName?: string;
  country?: string;
  city?: string;
  state?: string;
  street?: string;
}>({
  firstname: null,
  lastname: null,
  telephone: null,
  email: null,
  password: null,
  confirmPassword: null,
  photo: null,
  organisationName: undefined,
  country: undefined,
  city: undefined,
  state: undefined,
  street: undefined,
});
const showSuccess = ref(false);
const disabled = ref(true);
const valid = ref(false);
const is_open = ref(false);
const responseData = ref<any>({ message: "Action successful" });
const render = inject<any>("render");

// methods

const onInput = (phone: number, phoneObject: any, input: any) => {
  if (phoneObject?.formatted) {
    data.value.telephone = phoneObject.number;
    valid.value = phoneObject.valid;
  }
};

// const validatePhone = () => {
//   return valid.value;
// };

const capitalizeFirstLetter = (name: string | null) => {
  if (!name) return "";
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
};

const isNewPasswordVisible = ref(false); // For New Password visibility
const isConfirmPasswordVisible = ref(false); // For Confirm Password visibility

const uppdateProfile = async () => {
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
          firstName: successResponse.data.data.firstName,
          lastName: successResponse.data.data.lastName,
          email: successResponse.data.data.email,
          phone: successResponse.data.data.phone,
        },
      });

      storeItem(import.meta.env.VITE_USERDETAILS, data);

      responseData.value = successResponse;
    }
  }
};

const updateProfile = async () => {
  const isFormCorrect = await v$.value.$validate();

  if (isFormCorrect) {
    const phoneNumber = v$.value.telephone.$model as string;

    // Extract country code and actual phone number
    const countryCode = phoneNumber.match(/^\+\d{1,3}/)?.[0] || "";
    const actualNumber = phoneNumber.replace(countryCode, "").trim();
    const formattedNumber = actualNumber.startsWith("0")
      ? actualNumber
      : "0" + actualNumber;

    const dataObj = {
      organisationName: data.value.organisationName,
      firstName: v$.value.firstname.$model as string,
      lastName: v$.value.lastname.$model as string,
      email: v$.value.email.$model as string,
      countryCode: countryCode,
      phoneNumber: formattedNumber,
      country: data.value.country,
      city: data.value.city,
      state: data.value.state,
      street: data.value.street,
    };
    console.log("===========", dataObj);
    loading.value = true;
    const response = await request(authStore.updateProfile(dataObj), loading);

    handleError(response, userStore);
    const successResponse = handleSuccess(response, showSuccess);

    if (
      successResponse &&
      successResponse.data &&
      successResponse.data.succeeded
    ) {
      // Handle success response
      responseData.value = {
        message: successResponse.data.message,
      };
      showSuccess.value = true;
      render.value = true;
      await fetchUserDetails();
    }
  }
};

const fetchUserDetails = async () => {
  const userId = Number(localStorage.getItem("userId"));
  console.log("User ID:", userId);

  if (userId) {
    const response = await request(userStore.show(userId));
    console.log("API Response:", response);

    const successResponse = handleSuccess(response);

    if (successResponse && successResponse.data && successResponse.data.data) {
      const userData = successResponse.data.data.organisation.user;
      const organisationData = successResponse.data.data.organisation;

      data.value = {
        firstname: capitalizeFirstLetter(userData.firstname || ""),
        lastname: capitalizeFirstLetter(userData.lastname || ""),
        email: userData.email || "",
        telephone: userData.phoneNumber || "",
        password: null,
        confirmPassword: null,
        photo: userData.imageUrl || null,
        organisationName: organisationData.organisationName || "",
        street: organisationData.address.street || "",
        city: organisationData.address.city || "",
        state: organisationData.address.state || "",
        country: organisationData.address.country || "",
      };

      console.log("Updated Data:", data.value);
    } else {
      console.error("Invalid response data:", successResponse);
    }
  }
};

fetchUserDetails();

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
const validatePhone = (phone: string) => {
  if (!phone) return true;
  const phoneRegex = /^\+\d{1,3}\d{9,14}$/;
  return phoneRegex.test(phone);
};

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
      // required: helpers.withMessage("Telephone is required", required),
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
    <h3 class="text-black-rgba font-medium text-2xl">Profile Management</h3>

    <div class="bg-white rounded-t-lg p-6 space-y-9 h-auto">
      <div
        class="flex items-center justify-between overflow-auto scrollbar-hide lg:space-x-0 space-x-3"
      >
        <div>
          <h3 class="text-black-rgba font-medium text-base">Update profile</h3>
          <span class="text-sm text-gray-rgba-3"
            >Edit your profile information</span
          >
        </div>
        <ButtonBlue @click="updateProfile" :disabled="disabled">
          <template #placeholder>
            <spinner v-if="loading == true" /> <span v-else>Save Changes</span>
          </template>
        </ButtonBlue>
      </div>

      <!-- form -->
      <form @submit.prevent="updateProfile" class="space-y-6 lg:w-1/2 mr-auto">
        <div class="space-y-4-1">
          <h4 class="text-base text-black-200 font-medium">Contact</h4>
          <div class="grid sm:grid-cols-2 gap-4">
            <div class="relative">
              <input
                type="text"
                id="Name"
                @click="disabled = false"
                v-model="data.firstname"
                maxlength="55"
                class="input-float text-black peer pr-10.5"
                placeholder=""
              />
              <label
                for="Name"
                class="input-float-label peer-focus:text-black-100 peer-placeholder-shown:scale-75 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:px-2"
              >
                First name</label
              >
              <div v-if="v$.firstname.$error" class="text-red-600 text-xs">
                {{ "* " + v$.firstname.$errors[0].$message }}
              </div>
            </div>
            <div class="relative">
              <input
                type="text"
                @click="disabled = false"
                v-model="data.lastname"
                id="lastName"
                maxlength="55"
                class="input-float text-black peer pr-10.5"
                placeholder=""
              />
              <label
                for="lastName"
                class="input-float-label peer-focus:text-black-100 peer-placeholder-shown:scale-75 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:px-2"
              >
                Last name</label
              >
              <div v-if="v$.lastname.$error" class="text-red-600 text-xs">
                {{ "* " + v$.lastname.$errors[0].$message }}
              </div>
            </div>

            <div>
              <div class="relative">
                <input
                  @click="disabled = false"
                  type="email"
                  id="Email"
                  v-model="data.email"
                  maxlength="54"
                  class="input-float text-black peer pr-10.5"
                  placeholder=""
                />
                <label
                  for="Email"
                  class="input-float-label peer-focus:text-black-100 peer-placeholder-shown:scale-75 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:px-2"
                >
                  Email address</label
                >
                <div v-if="v$.email.$error" class="text-red-600 text-xs">
                  {{ "* " + v$.email.$errors[0].$message }}
                </div>
              </div>
              <span class="text-sm font-semimedium text-gray-rgba-3">
                To change email, contact your administrator to create a new
                profile for you
              </span>
            </div>
            <div>
              <div class="relative">
                <!-- <vue-tel-input
                  :value="data.telephone"
                  @input="onInput"
                  class="text-black text-sm border py-2 telinput"
                ></vue-tel-input> -->
                <input
                  type="tel"
                  id="Telephone"
                  v-model="data.telephone"
                  maxlength="14"
                  class="input-float text-black peer pr-10.5"
                  placeholder="+2348145951347"
                />
                <label
                  for="Telephone"
                  class="input-float-label peer-focus:text-black-100 peer-placeholder-shown:scale-75 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:px-2"
                >
                  Telephone (with country code)</label
                >
                <div v-if="v$.telephone.$error" class="text-red-600 text-xs">
                  {{ "* " + v$.telephone.$errors[0].$message }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <!--  -->
        <div class="space-y-4-1">
          <h4 class="text-base text-black-200 font-medium">Security</h4>
          <div class="grid sm:grid-cols-2 gap-4">
            <!-- <div class="relative">
              <input
                @click="disabled = false"
                type="password"
                id="oldpassword"
                maxlength="54"
                class="input-float peer text-black pr-10.5"
                placeholder=""
              />
              <label
                for="Password"
                class="input-float-label peer-focus:text-black-100 peer-placeholder-shown:scale-75 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:px-2"
              >
                Old Password</label
              >

              <span class="absolute right-4 top-4+2">
                <IEyeOpened />
              </span>
            </div>
            <div></div> -->
            <div class="relative">
              <input
                :disabled="disabled"
                :type="is_open ? 'text' : 'password'"
                id="newpassword"
                v-model="data.password"
                maxlength="54"
                class="input-float peer text-black pr-10.5"
                placeholder="New Password"
              />
              <!-- <label
                for="Password"
                class="input-float-label peer-focus:text-black-100 peer-placeholder-shown:scale-75 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:px-2"
              >
                New Password</label
              > -->
              <button
                type="button"
                class="absolute right-4 top-4+2"
                @click="is_open = !is_open"
              >
                <IEyeOpened />
              </button>
              <div v-if="v$.password.$error" class="text-red-600 text-xs">
                {{ "* " + v$.password.$errors[0].$message }}
              </div>
            </div>
            <div class="relative">
              <input
                :disabled="disabled"
                :type="isConfirmPasswordVisible ? 'text' : 'password'"
                id="confirmpassword"
                v-model="data.confirmPassword"
                maxlength="54"
                class="input-float peer text-black pr-10.5"
                placeholder="Confirm Password"
              />
              <!-- <label
                for="confirmpassword"
                class="input-float-label peer-focus:text-black-100 peer-placeholder-shown:scale-75 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:px-2"
              >
                Confirm Password</label
              > -->
              <button
                type="button"
                class="absolute right-4 top-4+2"
                @click="isConfirmPasswordVisible = !isConfirmPasswordVisible"
              >
                <IEyeOpened />
              </button>
              <div
                v-if="v$.confirmPassword.$error"
                class="text-red-600 text-xs"
              >
                {{ "* " + v$.confirmPassword.$errors[0].$message }}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
<style scoped>
.telinput {
  border: 1px solid black;
  border-radius: 7px;
}
</style>
