<script setup lang="ts">
import { ref } from "vue";
import confirmAlert from "../../../../components/alerts/ConfirmAlert.vue";
import { useRouter } from "vue-router";
import ButtonLightBlue from "../../../../components/buttons/ButtonLightBlue.vue";
import SuccessAlert from "../../../../components/alerts/SuccessAlert.vue";
import spinner from "../../../../components/timer/Spinner.vue";
import { request } from "../../../../composables/request.composable";
import handleError from "../../../../composables/handle_error.composable";
import handleSuccess from "../../../../composables/handle_success.composable";
import { useTaxStore, useUserStore } from "../../../../store/index";

// initialize router
const router = useRouter();

// initialize store
const taxStore = useTaxStore();
const userStore = useUserStore();

// variables
const loading = ref(false);
const confirmMessage = ref({ message: "" });
const showConfirm = ref(false);
const showSuccess = ref(false);

const responseData = ref<any>({ data: null, message: "" });

const dataObj = ref<{ enable: boolean }>({
  enable: false,
});

// methods
const confirmDisable = () => {
  confirmMessage.value.message = `Are you sure you want to disable tax?`;
  showConfirm.value = true;
};

const disable = async () => {
  loading.value = true;
  const response = await request(
    taxStore.updateSettings(dataObj.value),
    loading
  );

  handleError(response, userStore);
  const successResponse = handleSuccess(response, showSuccess);

  if (successResponse && typeof successResponse !== "undefined") {
    // console.log(successResponse.data);
    successResponse.message = "tax disabled successfully";
    responseData.value = successResponse;
  }
};
</script>
<template>
  <div class="space-y-10">
    <!-- confirm alert -->
    <confirmAlert
      :showConfirm="showConfirm"
      @closeConfirm="showConfirm = false"
      v-if="showConfirm == true"
    >
      <template #title> Disable Tax</template>
      <template #confirm>
        <span @click="[disable(), (showConfirm = false)]">
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
      <ButtonLightBlue
        class="px-8"
        text-color="text-red"
        @click="confirmDisable"
      >
        <template v-slot:placeholder>
          <spinner v-if="loading == true" />
          <p v-else>Disable Tax Remittance</p>
        </template>
      </ButtonLightBlue>
    </div>
  </div>
</template>
