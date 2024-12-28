<script lang="ts" setup>
import {
  useTokenClient,
  AuthCodeFlowSuccessResponse,
  AuthCodeFlowErrorResponse,
} from "vue3-google-signin";

import { reactive, ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import useVuelidate from "@vuelidate/core";
import { required, email, helpers, minLength } from "@vuelidate/validators";
import IUser from "../../components/icons/IUser.vue";

import IEyeOpened from "../../components/icons/IEyeOpened.vue";
import SuccessAlert from "../../components/alerts/SuccessAlert.vue";
import { request } from "../../composables/request.composable";
import handleError from "../../composables/handle_error.composable";
import handleSuccess from "../../composables/handle_success.composable";
import spinner from "../../components/timer/Spinner.vue";

import { useAuthStore, useUserStore } from "../../store/index";

// initialize router
const router = useRouter();
const route = useRoute();

// initialize store
const authStore = useAuthStore();
const userStore = useUserStore();

enum Password {
  PASSWORD = "password",
  TEXT = "text",
}
// variables
const passwordType = ref<Password>(Password.PASSWORD);
const loading = ref(false);
const showSuccess = ref(false);
const responseData = ref<any>({});

const data = reactive<{ email: string; password: string }>({
  email: "",
  password: "12@Heessss!",
});

// methods

const googleSuccess = async (response: AuthCodeFlowSuccessResponse) => {
  // console.log("Access Token: ", response.access_token);
  await request(authStore.signInWithGoogle(response.access_token, response));
  showSuccess.value = true;
  responseData.value.message = "Google Login successful";
  setTimeout(() => {
    "/dashboard/home";
  }, 3000);
};

const googleError = (errorResponse: AuthCodeFlowErrorResponse) => {
  handleError(errorResponse, userStore);
  // console.log("Error: ", errorResponse);
};

const { isReady, login } = useTokenClient({
  onSuccess: googleSuccess,
  onError: googleError,
  // other options
});

const handleForgottenInit = async (): Promise<void> => {
  // check if form is formattted correctly
  const isFormCorrect = await v$.value.$validate();

  if (isFormCorrect) {
    const email = data.email;

    loading.value = true;
    const response = await request(authStore.userForgotPasswordInit(email), loading);

    handleError(response, userStore);
    const successResponse = handleSuccess(response, showSuccess);

    if (successResponse && typeof successResponse !== "undefined") {
      responseData.value = successResponse;
      // responseData.value.message = "Login successful";
      // console.log(responseData.value);

      setTimeout(() => {
        (window.location as unknown as string) = responseData.value.data.data
          .companies[0]
          ? "/dashboard/home"
          : "dashboard/company-settings/company-information";
      }, 3000);
    }
  }
};

const verifyEmail = async () => {
  if (route.query && route.query.verify) {
    // console.log(route.query.verify);
    const response = await request(
      userStore.verify(route.query.verify as string)
    );

    // console.log(response);
    handleError(response, userStore);
    const successResponse = handleSuccess(response, showSuccess);

    if (successResponse && typeof successResponse !== "undefined") {
      // console.log(true);
      responseData.value = successResponse;
      responseData.value.message = "Email verify successful";
    }
  }
};

const togglePasswordState = () => {
  passwordType.value === Password.PASSWORD
    ? (passwordType.value = Password.TEXT)
    : (passwordType.value = Password.PASSWORD);
};

// validations rule
const rules = computed(() => {
  return {
    email: {
      required: helpers.withMessage("Email address is required", required),
      email: helpers.withMessage("Must be a valid email", email),
    },

    password: {
      required: helpers.withMessage("Password is required", required),
      min: helpers.withMessage(
        "Password cannot be less than 8 characters",
        minLength(8)
      ),
    },
  };
});

const v$ = useVuelidate(rules as any, data);

// hooks
onMounted(() => {
  verifyEmail();
});

const gotoExternalRouteOnTab = (route:string) => {
    window.location.href = route;
}
</script>

<template>
  <!--  -->

  <div class="lg:w-[456px] w-screen lg:px-0 mx-auto h-full pt-18 relative">
    <!-- success response -->
    <successAlert
      @closeSuccess="showSuccess = false"
      v-if="showSuccess == true"
      :showSuccess="showSuccess"
    >
      <template #otherMessage>CLOSE</template>
      {{ responseData.message }}
    </successAlert>
    <div class="space-y-8">
      <div class="space-y-2">
        <h4 class="text-2xl+4">Change Account Password</h4>
        <p>Enter your email of the company</p>
      </div>
    </div>

    <!-- form -->
    <form @submit.prevent="handleForgottenInit" class="pt-9+2 space-y-6">
      <div class="space-y-4">
        <div class="relative">
          <input
            type="email"
            id="Email"
            v-model="data.email"
            maxlength="55"
            class="input-float peer pr-10.5"
            placeholder=""
          />
          <label
            for="Email"
            class="input-float-label peer-focus:text-black-100 peer-placeholder-shown:scale-75 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:px-2"
          >
            Email</label
          >
          <span class="absolute right-4 top-4+2">
            <IUser />
          </span>
          <div v-if="v$.email.$error" class="text-red-600 text-xs">
            {{ "* " + v$.email.$errors[0].$message }}
          </div>
        </div>
      </div>

      <!-- button -->
      <button
        :disabled="loading"
        class="bg-[#003b3d] flex items-start justify-center py-4 rounded-full text-white w-full text-sm"
      >
        <spinner v-if="loading == true" /> <span v-else>Send</span>
      </button>
    </form>
  </div>
  <!--  -->
</template>
<style scoped></style>
