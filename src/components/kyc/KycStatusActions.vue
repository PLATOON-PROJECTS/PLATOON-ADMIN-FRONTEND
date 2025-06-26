<template>
  <div class="flex justify-between items-start bg-white">
    <div>
      <h1 class="text-sm font-medium text-[#A6A6A6]">Status</h1>
      <p
        :class="[
          'inline-block mt-1 px-3 py-1 rounded-full text-xs font-medium',
          status === 'Approved'
            ? 'bg-[#F6F7F9] text-[#46A754]'
            : status === 'Rejected'
            ? 'bg-[#FFE5E6] text-[#FF4C51]'
            : 'bg-[#FFF7E5] text-[#FFB400]', // Pending
        ]"
      >
        {{ status }}
      </p>
    </div>

    <div v-if="status === 'Pending'" class="flex gap-4">
      <button
        @click="triggerConfirmation(Number(organisationId), false)"
        class="px-4 py-2 rounded-full border border-[#E6E6E6] text-sm font-medium hover:bg-gray-100"
      >
        Decline
      </button>
      <button
        @click="triggerConfirmation(Number(organisationId), true)"
        class="px-4 py-2 rounded-full bg-[#306651] text-white text-sm font-medium hover:bg-green-700"
      >
        Approve
      </button>
    </div>
  </div>

  <!-- ❗ Error Message -->
  <div
    v-if="errorMessage"
    class="mt-4 text-sm text-[#FF4C51] bg-[#FFE5E6] px-4 py-2 rounded-md border border-[#FFB3B6]"
  >
    {{ errorMessage }}
  </div>

  <!-- Confirm Dialog -->
  <confirmAlert
    :showConfirm="showConfirmApproval"
    @closeConfirm="showConfirmApproval = false"
    v-if="showConfirmApproval"
  >
    <template #title>{{ approvalIntent ? "Approve" : "Decline" }}</template>
    <template #message>{{ confirmMessage.message }}</template>
    <template #confirm>
      <span @click="submitApproval(confirmMessage.id, approvalIntent)">
        CONFIRM
      </span>
    </template>
  </confirmAlert>

  <!-- Success Dialog -->
  <successAlert
    :showSuccess="showSuccess"
    @closeSuccess="showSuccess = false"
    v-if="showSuccess"
  >
    <template #otherMessage>CLOSE</template>
    {{ successMessage }}
  </successAlert>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRoute } from "vue-router";
import ConfirmAlert from "../../components/alerts/ConfirmAlert.vue";
import SuccessAlert from "../../components/alerts/SuccessAlert.vue";
import { request } from "../../composables/request.composable";
import kycStore from "../../store/modules/kyc.store";
import handleError from "../../composables/handle_error.composable";

const props = defineProps<{ status: string }>();

const route = useRoute();
const organisationId = route.params.id;

const showConfirmApproval = ref(false);
const showSuccess = ref(false);
const loading = ref(false);
const approvalIntent = ref(true);
const confirmMessage = ref({ message: "", id: "" });
const successMessage = ref("Action successful");
const errorMessage = ref(""); // 👈 new

function triggerConfirmation(id: number, approve: boolean) {
  approvalIntent.value = approve;
  confirmMessage.value = {
    message: approve
      ? "Do you want to approve this company?"
      : "Do you want to decline this company?",
    id: organisationId as string,
  };
  showConfirmApproval.value = true;
  errorMessage.value = ""; // Clear previous errors
}

async function submitApproval(id: string, approve: boolean) {
  loading.value = true;
  errorMessage.value = "";
  try {
    const response = await request(kycStore().approval(id, approve));

    if (response?.data?.succeeded) {
      successMessage.value = approve
        ? "Company approved successfully"
        : "Company declined successfully";
      showSuccess.value = true;
      showConfirmApproval.value = false;

      setTimeout(() => window.location.reload(), 2000);
    } else {
      errorMessage.value =
        response?.data?.message || "Approval failed. Please try again.";
    }
  } catch (error: any) {
    errorMessage.value = error?.message || "Something went wrong.";
    handleError(error, "Action failed");
  } finally {
    loading.value = false;
  }
}
</script>
