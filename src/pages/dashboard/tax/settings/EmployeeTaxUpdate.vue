<script lang="ts" setup>
import { ref, provide } from "vue";
import SuccessAlert from "../../../../components/alerts/SuccessAlert.vue";
import spinner from "../../../../components/timer/Spinner.vue";
import { request } from "../../../../composables/request.composable";
import handleError from "../../../../composables/handle_error.composable";
import handleSuccess from "../../../../composables/handle_success.composable";
import { useTaxStore, useUserStore } from "../../../../store/index";

// initialize store
const taxStore = useTaxStore();
const userStore = useUserStore();

// variables

const loading = ref(false);

const showSuccess = ref(false);
const disabled = ref(true);
const responseData = ref<any>();

// emits
// emits
const emit = defineEmits<{
  (e: "loadingTrue"): void;
  (e: "loadingFalse"): void;
}>();

// const state = ref<StateEnum>();

// methods

const saveChanges = async () => {
  loading.value = true;
  emit("loadingTrue");

  const response = await request(taxStore.request(), loading);

  emit("loadingFalse");

  handleError(response, userStore);
  const successResponse = handleSuccess(response, showSuccess);

  if (successResponse && typeof successResponse !== "undefined") {
    // console.log(successResponse.data);
    responseData.value = successResponse;
  }
};

// define expose
defineExpose({
  saveChanges,
});
</script>
<template>
  <div class="space-y-10">
    <successAlert
      :showSuccess="showSuccess"
      @closeSuccess="showSuccess = false"
      v-if="showSuccess == true"
    >
      <template #otherMessage>CLOSE</template>
      {{ responseData.message }}</successAlert
    >
    <div class="space-y-1">
      <p class="text-base font-medium">
        Request employees without Tax ID to update their accounts
      </p>
      <p class="text-sm text-gray-rgba-3">
        This will send an automatic email to all employees without any <br />
        Tax ID prompting them to update their profile with their Tax IDs
      </p>
    </div>
    <button
      @click="saveChanges"
      class="bg-[#003b3d] text-white px-6 py-3 rounded-full text-sm"
    >
      Send Request
    </button>
  </div>
</template>
