<script setup lang="ts">
import { ref } from "vue";
import confirmAlert from "../../../../components/alerts/ConfirmAlert.vue";
import ButtonBlueOutline from "../../../../components/buttons/ButtonBlueOutline.vue";
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
const confirmMessage = ref({ message: "" });
const showSuccess = ref(false);
const showConfirm = ref(false);
const disabled = ref(true);
const responseData = ref<any>();

// emits
const emit = defineEmits<{
  (e: "loadingTrue"): void;
  (e: "loadingFalse"): void;
}>();

// methods

const saveChanges = () => {
  confirmMessage.value.message =
    "Employee tax data will be downloaded to your local storage";

  showConfirm.value = true;
};

const confirmDownloadTax = async () => {
  loading.value = true;
  emit("loadingTrue");

  const response = await request(taxStore.download(), loading);

  // console.log(response);
  emit("loadingFalse");

  handleError(response, userStore);
  const successResponse = handleSuccess(response, showSuccess);

  if (successResponse && typeof successResponse !== "undefined") {
    // console.log(successResponse.data);
    successResponse.message = "Tax data download began successfully";
    responseData.value = successResponse;

    const link = document.createElement("a");
    link.setAttribute("href", successResponse.data.link);
    link.setAttribute("download", "platoon_tax_record.csv");
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

// define expose
defineExpose({
  saveChanges,
});
</script>
<template>
  <div class="space-y-10">
    <confirmAlert
      :showConfirm="showConfirm"
      @closeConfirm="showConfirm = false"
      v-if="showConfirm == true"
    >
      <template #title> Delete</template>
      <template #confirm>
        <span @click="[confirmDownloadTax(), (showConfirm = false)]">
          CONFIRM</span
        ></template
      >
      <template #message> {{ confirmMessage.message }}</template>
    </confirmAlert>
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
        Download your employee details and update their Tax ID
      </p>
      <p class="text-sm text-gray-rgba-3">
        A compressed file in .csv format will be downloaded to view or <br />
        update employees Tax IDs
      </p>
    </div>

    <div class="flex items-start space-x-4">
      <button
        class="bg-[#003b3d] text-white px-6 py-3 rounded-full text-sm"
        @click="saveChanges"
      >
        Download
      </button>
      <ButtonBlueOutline class="px-8">
        <template v-slot:placeholder>Upload</template>
      </ButtonBlueOutline>
    </div>
  </div>
</template>
