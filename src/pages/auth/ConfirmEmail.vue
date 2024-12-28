<script lang="ts" setup>
import { reactive, ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import useVuelidate from "@vuelidate/core";
import { required, email, helpers } from "@vuelidate/validators";
import SuccessAlert from "../../components/alerts/SuccessAlert.vue";
import { request } from "../../composables/request.composable";
import handleSuccess from "../../composables/handle_success.composable";
import handleError from "../../composables/handle_error.composable";
import { useAuthStore, useUserStore } from "../../store/index";
import spinner from "../../components/timer/Spinner.vue";

// initialize router
const router = useRouter();
const route = useRoute();
// initialize store
const authStore = useAuthStore();
const userStore = useUserStore();

const is_good_token = ref(true);
const loading = ref(false);
const showSuccess = ref(false);
const responseData = ref<any>({ message: "Email confirmation successful" });

const data = reactive<{
  email: string | null;
}>({
  email: null,
});

// methods
const handleEmailConfirmation = async (): Promise<void> => {
  loading.value = true;
  const response = await request(authStore.confirmEmail({
    email: route.query.email as string,
    token: route.query.token as string,
  }), loading);

  handleError(response, userStore);
  const successResponse = handleSuccess(response, showSuccess);

  if (successResponse && typeof successResponse !== "undefined") {
    responseData.value = successResponse;

    setTimeout(() => {
      router.push({ name: 'auth.login' });
    }, 3000);
  }
};

// validations rule
const rules = computed(() => {
  return {
    email: {
      required: helpers.withMessage("Email is required", required),
      email: helpers.withMessage("Must be a valid email", email),
    },
  };
});

const v$ = useVuelidate(rules as any, data);

if (!route.query.token) {
  router.push({ name: 'auth.login' });
} else {
  handleEmailConfirmation();
}
</script>

<template>
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
        <h4 class="text-2xl+4">Email Confirmation</h4>
        <p>Please wait while we confirm your email...</p>
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
