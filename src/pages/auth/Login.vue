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
import { storeItem } from "../../core/utils/storage.helper";

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
  password: "",
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

const handleLogin = async (): Promise<void> => {
  // check if form is formattted correctly
  const isFormCorrect = await v$.value.$validate();

  if (isFormCorrect == true) {
    const data = {
      email: v$.value.email.$model as string,
      password: v$.value.password.$model as string,
    };

    loading.value = true;
    const response = await request(authStore.userLoginn(data), loading);

    handleError(response, userStore);
    const successResponse = handleSuccess(response, showSuccess);

    if (successResponse && typeof successResponse !== "undefined") {
      // console.log(true);
      responseData.value = successResponse;
      responseData.value.message = "Login successful";

      const userId = successResponse.data.data.id;
      localStorage.setItem("userId", userId);

      setTimeout(() => {
        window.location.href = "/dashboard/home"; // Redirect to dashboard
      }, 3000);
      // setTimeout(() => {
      //   (window.location as unknown as string) = responseData.value.data.data
      //     .companies[0]
      //     ? "/dashboard/home"
      //     : "dashboard/company-settings/company-information";
      // }, 3000);
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

const gotoExternalRouteOnTab = (route: string) => {
  window.location.href = route;
};
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
        <h4 class="text-2xl+4">Welcome</h4>
        <p>Enter your details below to access your account</p>
      </div>
      <!-- <div class="flex gap-4">
 
        <div
          @click="login()"
          class="flex items-center bg-grey py-3 px-6 rounded-full space-x-24"
        >
          <img src="/images/png/google.png" alt="Google" />
          <span class="text-sm">Continue with Google</span>
        </div>
        <div
          class="flex items-center bg-grey py-3 px-6 rounded-full space-x-24"
        >
          <img src="/images/png/apple.png" alt="Apple" />
          <span class="text-sm">Continue with Apple</span>
        </div>
        <button type="button"
          class="flex items-center justify-center w-full bg-[#003b3d] text-white py-3 px-6 rounded-full space-x-24 cursor-default"
        >
          <!-- <img src="/images/png/apple.png" alt="Apple" /> -->
      <!-- <span class="text-sm">Login As Company</span>
        </button> -->
      <!-- <button type="button"
          @click="gotoExternalRouteOnTab('https://employee.platoonco.com/')"
          class="flex items-center justify-center w-full bg-grey py-3 px-6 rounded-full space-x-24"
        >
          <!-- <img src="/images/png/apple.png" alt="Apple" /> -->
      <!-- <span class="text-sm">Login As Employee</span>
        </button> -->
      <!-- </div> -->
    </div>

    <!-- Divider -->
    <div class="flex items-center justify-center pt-8-2">
      <div class="divider-local flex-1"></div>
      <!-- <span class="p-1.5 uppercase text-xs text-grey-rgba">or</span> -->
      <div class="divider-local flex-1"></div>
    </div>

    <!-- form -->
    <form @submit.prevent="handleLogin" class="pt-9+2 space-y-6">
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
        </div>
        <div v-if="v$.email.$error" class="text-red-100 text-xs">
          {{ "* " + v$.email.$errors[0].$message }}
        </div>

        <div class="relative">
          <input
            :type="passwordType"
            id="password"
            v-model="data.password"
            maxlength="54"
            class="input-float peer pr-10.5"
            placeholder=""
          />
          <label
            for="Password"
            class="input-float-label peer-focus:text-black-100 peer-placeholder-shown:scale-75 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:px-2"
          >
            Password</label
          >
          <span class="absolute right-4 top-4+2 cursor-pointer">
            <IEyeOpened @click="togglePasswordState" />
          </span>
        </div>
        <div v-if="v$.password.$error" class="text-red-100 text-xs">
          {{ "* " + v$.password.$errors[0].$message }}
        </div>
      </div>

      <!-- button -->
      <button
        :disabled="loading"
        class="bg-[#003b3d] flex items-start justify-center py-4 rounded-full text-white w-full text-sm"
      >
        <spinner v-if="loading == true" /> <span v-else>Login</span>
      </button>
    </form>

    <div class="mt-6">
      <a
        @click="router.push('/forgotten')"
        class="text-[#003b3d] text-sm underline underline-offset-4 font-medium"
        >Forgot password?</a
      >
    </div>
    <!-- <div class="mt-20 pb-20">
      <p>
        New to Platoon?
        <router-link
          to="/signup"
          class="text-[#003b3d] underline underline-offset-4 font-semimedium"
        >
          Create account</router-link
        >
      </p>
    </div> -->

    <!-- <div class="mt-20 pb-20">
      <p>
        New to Platoon?
        <router-link
          to="/signup"
          class="text-[#003b3d] underline underline-offset-4 font-semimedium"
        >
          Create account</router-link
        >
      </p>
    </div> -->
  </div>
  <!--  -->
</template>
<style scoped></style>
