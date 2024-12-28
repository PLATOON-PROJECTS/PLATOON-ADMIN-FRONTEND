<script lang="ts" setup>
import { reactive, ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import useVuelidate from "@vuelidate/core";
import { required, helpers, minLength, sameAs } from "@vuelidate/validators";
import SuccessAlert from "../../components/alerts/SuccessAlert.vue";
import ErrorAlert from "../../components/alerts/ErrorAlert.vue";
import { request } from "../../composables/request.composable";
import handleSuccess from "../../composables/handle_success.composable";
import IEyeOpened from "../../components/icons/IEyeOpened.vue";
import handleError from "../../composables/handle_error.composable";
import { useAuthStore } from "../../store/index";
import spinner from "../../components/timer/Spinner.vue";

// initialize router
const router = useRouter();
const route = useRoute();
// initialize store
const authStore = useAuthStore();

enum Password {
  PASSWORD = "password",
  TEXT = "text",
}

const loading = ref(false);
const showSuccess = ref(false);
const showError = ref(false);
const errorMessage = ref("");
const responseData = ref<any>({ message: "Signup successful" });
const passwordType = ref<Password>(Password.PASSWORD);
const confirmPasswordType = ref<Password>(Password.PASSWORD);



const data = reactive<{
  password: string | null;
  confirmPassword: string | null;
}>({
  password: null,
  confirmPassword: null,
});

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


// Handle Register Employee
const handleRegisterEmployee = async (): Promise<void> => {
  const inviteId = route.query.id as string; 
  const isFormCorrect = await v$.value.$validate();

  if (isFormCorrect) {
    const data = {
      inviteId: inviteId,
      password: v$.value.password.$model as string,
    };

    console.log("Data being sent to register:", data); 

    loading.value = true;
    try {
      const response = await request(authStore.registerEmployee(data), loading);
      handleError(response, authStore);
      const successResponse = handleSuccess(response, showSuccess);

      if (successResponse && typeof successResponse !== "undefined") {
        responseData.value = successResponse;

        setTimeout(() => {
          router.push({ name: 'auth.login' });
        }, 3000);
      } else {
      showError.value = true; 
      errorMessage.value = response.data.message || "An error occurred.";
    }
    } catch (error) {
      console.log("Registration error:", error); 
      showError.value = true;
    errorMessage.value = "An unexpected error occurred.";
      loading.value = false; 
    }
  }
};


// Validations
const rules = computed(() => {
  return {
    confirmPassword: {
      sameAsPassword: sameAs(data.password, "password"),
    },
    password: {
      required: helpers.withMessage("Password is required", required),
      min: helpers.withMessage("Password cannot be less than 8 characters", minLength(8)),
    },
  };
});

const v$ = useVuelidate(rules as any, data);

if (!route.query.id) {
  router.push({ name: 'auth.login' });
}
</script>

<template>
  <div class="lg:w-[456px] w-screen mx-auto h-full pt-18 relative">
    <successAlert
      v-if="showSuccess"
      @closeSuccess="showSuccess = false"
      :showSuccess="showSuccess"
    >
      <template #otherMessage>CLOSE</template>
      {{ responseData.message }}
    </successAlert>
    <errorAlert
      v-if="showError"
      @closeError="showError = false"
      :showError="showError"
    >
      <template #otherMessage>CLOSE</template>
      {{ errorMessage }}
    </errorAlert>
    <div class="space-y-8">
      <div class="space-y-2">
        <h4 class="text-2xl+4">Register Employee</h4>
        <p>Enter the new password.</p>
      </div>
    </div>
    <!-- form -->
    <form @submit.prevent="handleRegisterEmployee" class="pt-9+2 space-y-6">
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
          <spinner v-if="loading" /> <span v-else>Register</span>
        </button>
      </form>
      
  </div>
</template>

<style scoped>
.telinput {
  border: 1px solid black;
  border-radius: 7px;
}
</style>
