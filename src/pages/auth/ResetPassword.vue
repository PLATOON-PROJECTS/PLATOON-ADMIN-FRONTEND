<script lang="ts" setup>
import { reactive, ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import useVuelidate from "@vuelidate/core";
import {
  required,
  email,
  helpers,
  minLength,
  sameAs,
} from "@vuelidate/validators";
import IBuildings from "../../components/icons/IBuildings.vue";
import IUser from "../../components/icons/IUser.vue";
import IEyeOpened from "../../components/icons/IEyeOpened.vue";
import SuccessAlert from "../../components/alerts/SuccessAlert.vue";
import { request } from "../../composables/request.composable";
import handleSuccess from "../../composables/handle_success.composable";
import handleError from "../../composables/handle_error.composable";
import { useAuthStore, useUserStore } from "../../store/index";
import spinner from "../../components/timer/Spinner.vue";
import { stringValidate, numberValidate } from "../../validations/validate";

//: TODO company should be removed
// initialize router
const router = useRouter();
const route = useRoute();
// initialize store
const authStore = useAuthStore();
const userStore = useUserStore();

const is_good_token = ref(true)

enum Password {
  PASSWORD = "password",
  TEXT = "text",
}
// variables
const passwordType = ref<Password>(Password.PASSWORD);
const confirmPasswordType = ref<Password>(Password.PASSWORD);
const loading = ref(false);
const showSuccess = ref(false);
const responseData = ref<any>({ message: "Signup successful" });
const valid = ref(false);
const invalidDomain = ref(false);

const data = reactive<{
  password: string | null;
  confirmPassword: string | null;
}>({
  password: null,
  confirmPassword: null,
});

async function checkDomainExists(email:string | null) {
  const domain = email?.split('@')[1];
  try {
    const response = await fetch(`https://${domain}`, { mode: 'no-cors' });
    return true; // Returns true if the domain exists
  } catch (error) {
    return false; // Returns false if there's an error or domain doesn't exist
  }
}

// methods
const handleVerification = async (): Promise<void> => {
  // check if form is formatted correctlyx

  loading.value = true;
  const response = await request(authStore.changePassword({
    "token": route.query.token,
  }), loading);

  handleError(response, userStore);
  const successResponse = handleSuccess(response, showSuccess);

  if (successResponse && typeof successResponse !== "undefined") {
    responseData.value = successResponse;

    is_good_token.value = true;
  }
};

// handleVerification();

const handleRegister = async (): Promise<void> => {
  // check if form is formatted correctly

  const isFormCorrect = await v$.value.$validate();
  invalidDomain.value = false;

  if (isFormCorrect == true) {
    const data = {
      token: route.query.token,
      // telephone: v$.value.telephone.$model as number,
      // email: v$.value.email.$model as string,
      password: v$.value.password.$model as string,
      confirmPassword: v$.value.confirmPassword.$model as string,
      // firstname: v$.value.firstname.$model as string,
      // lastname: v$.value.lastname.$model as string,
      // company: { name: v$.value.company.name.$model as string },
    };

    loading.value = true;
    const response = await request(authStore.forgotPasswordComplete(data), loading);

    handleError(response, userStore);
    const successResponse = handleSuccess(response, showSuccess);

    if (successResponse && typeof successResponse !== "undefined") {
      responseData.value = successResponse;
      // responseData.value.message = "Login successful";
      // console.log(responseData.value);

      setTimeout(() => {
        router.push({name: 'auth.login'});
      }, 3000);
    }
  }
};

const handleResetPassword = async (): Promise<void> => {
  const isFormCorrect = await v$.value.$validate();

  if (isFormCorrect) {
    const data = {
      newPassword: v$.value.password.$model as string,
      token: route.query.token as string,
      email: route.query.email as string,
    };

    loading.value = true;
    const response = await request(authStore.userResetPassword(data), loading);

    handleError(response, userStore);
    const successResponse = handleSuccess(response, showSuccess);

    if (successResponse && typeof successResponse !== "undefined") {
      responseData.value = successResponse;

      setTimeout(() => {
        router.push({ name: "auth.login" });
      }, 3000);
    }
  }
};


// const stringValidation = () => stringValidate(data.company.name);

// const onInput = (phone: number, phoneObject: any, input: any) => {
//   if (phoneObject?.formatted) {
//     data.telephone = phoneObject.number;
//     valid.value = phoneObject.valid;
//   }
// };

const validatePhone = () => {
  return valid.value;
};

const togglePasswordState = (type: string) => {
  if (type === "password") {
    passwordType.value === Password.PASSWORD
      ? (passwordType.value = Password.TEXT)
      : (passwordType.value = Password.PASSWORD);
  } else {
    confirmPasswordType.value === Password.PASSWORD
      ? (confirmPasswordType.value = Password.TEXT)
      : (confirmPasswordType.value = Password.PASSWORD);
  }
};

// validations rule
const rules = computed(() => {
  return {
    // email: {
    //   required: helpers.withMessage("Email address is required", required),
    //   email: helpers.withMessage("Must be a valid email", email),
    // },
    // firstname: {
    //   required: helpers.withMessage("First name is required", required),
    //   stringValidate: helpers.withMessage(
    //     "First name can only include alphabets",
    //     () => stringValidate(data.firstname as string) as any
    //   ),
    // },
    // lastname: {
    //   required: helpers.withMessage("Last name is required", required),
    //   stringValidate: helpers.withMessage(
    //     "Last name can only include alphabets",
    //     () => stringValidate(data.lastname as string) as any
    //   ),
    // },
    // telephone: {
    //   required: helpers.withMessage("Telephone is required", required),
    //   validatePhone: helpers.withMessage("Invalid Phone Number", validatePhone),
    // },

    confirmPassword: {
      sameAsPassword: sameAs(data.password, "password"),
    },
    password: {
      required: helpers.withMessage("Password is required", required),
      min: helpers.withMessage(
        "Password cannot be less than 8 characters",
        minLength(8)
      ),
    },

    // company: {
    //   name: {
    //     required: helpers.withMessage("Company name  is required", required),
    //   },
    //   stringValidate: helpers.withMessage(
    //     "company name can only include alphabets",
    //     stringValidation as any
    //   ),
    // },
  };
});

const v$ = useVuelidate(rules as any, data);

const gotoExternalRouteOnTab = (route:string) => {
    window.location.href = route;
}

if(!route.query.token){
  router.push({name: 'auth.login'});
}
</script>
<template>
  <!--  -->
  <div class="lg:w-[456px] w-screen mx-auto h-full pt-18 relative" v-if="is_good_token">
    <successAlert
      v-if="showSuccess == true"
      @closeSuccess="showSuccess = false"
      :showSuccess="showSuccess"
    >
      <template #otherMessage>CLOSE</template>
      {{ responseData.message }}
    </successAlert>
    <div class="space-y-8">
      <div class="space-y-2">
        <h4 class="text-2xl+4">Set New Password</h4>
        <p>Enter the new password.</p>
      </div>
      <!-- <div class="space-y-2">
        <div
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
      </div> -->
    </div>
    <!-- <div class="flex gap-4 mt-3">

        <button type="button"
          class="flex items-center justify-center w-full bg-[#003b3d] text-white py-3 px-6 rounded-full space-x-24 cursor-default"
        >
          <span class="text-sm">Register As Company</span>
        </button>
        <button type="button"
          @click="gotoExternalRouteOnTab('https://employee.platoonco.com/')"
          class="flex items-center justify-center w-full bg-grey py-3 px-6 rounded-full space-x-24"
        >
          <span class="text-sm">Register As Employee</span>
        </button>
      </div>

    <div class="flex items-center justify-center pt-8-2">
      <div class="divider-local flex-1"></div>
      <span class="p-1.5 uppercase text-xs text-grey-rgba">or</span>
      <div class="divider-local flex-1"></div>
    </div> -->

    <!-- form -->
    <form @submit.prevent="handleResetPassword" class="pt-9+2 space-y-6">
      <div class="space-y-4">
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
            <IEyeOpened @click="togglePasswordState('password')" />
          </span>
        </div>
        <div v-if="v$.password.$error" class="!text-red-100 text-xs">
          {{ "* " + v$.password.$errors[0].$message }}
        </div>

        <div class="relative">
          <input
            :type="confirmPasswordType"
            id="confirmPassword"
            v-model="data.confirmPassword"
            maxlength="54"
            class="input-float peer pr-10.5"
            placeholder=""
          />
          <label
            for="Password"
            class="input-float-label peer-focus:text-black-100 peer-placeholder-shown:scale-75 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:px-2"
          >
            Confirm Password</label
          >
          <span class="absolute right-4 top-4+2 cursor-pointer">
            <IEyeOpened @click="togglePasswordState('confirmPassword')" />
          </span>
        </div>
        <div v-if="v$.confirmPassword.$error" class="!text-red-100 text-xs">
          {{ "* " + v$.confirmPassword.$errors[0].$message }}
        </div>
      </div>

      <!-- button -->
      <button
        :disabled="loading"
        class="bg-[#003b3d] flex items-start justify-center py-4 rounded-full text-white w-full text-sm"
      >
        <spinner v-if="loading == true" /> <span v-else>Save</span>
      </button>
    </form>
  </div>
  <div class="lg:w-[456px] w-screen mx-auto h-full pt-18 relative" v-else>
    <successAlert
      v-if="showSuccess == true"
      @closeSuccess="showSuccess = false"
      :showSuccess="showSuccess"
    >
      <template #otherMessage>CLOSE</template>
      {{ responseData.message }}
    </successAlert>
    <div class="space-y-8">
      <div class="space-y-2">
        <h4 class="text-2xl+4">VERIFICATION</h4>
        <p><i>Please wait, verifying your account..</i>.</p>
      </div>
    </div>
  </div>
  <!--  -->
</template>
<style scoped>
.telinput {
  border: 1px solid black;
  border-radius: 7px;
}
</style>
