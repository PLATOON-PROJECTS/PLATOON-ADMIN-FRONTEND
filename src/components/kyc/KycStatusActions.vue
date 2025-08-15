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

  <!-- Decline Modal -->
  <DeclineModal
    :show="showDeclineModal"
    :userId="userId"
    :roleId="0"
    :organisationId="Number(route.params.id) || 0"
    @close="showDeclineModal = false"
    @submitted="handleDeclineSubmitted"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRoute } from "vue-router";
import ConfirmAlert from "../../components/alerts/ConfirmAlert.vue";
import SuccessAlert from "../../components/alerts/SuccessAlert.vue";
import DeclineModal from "../../modals/DeclineModal.vue";
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

// DeclineModal variables
const showDeclineModal = ref(false);
const selectedOrganisationId = ref<number | null>(null);

// Get userId from localStorage
const userId = Number(localStorage.getItem("userId")) || 0;

function triggerConfirmation(id: number, approve: boolean) {
  if (approve) {
    // Use confirmation dialog for approval
    approvalIntent.value = true;
    confirmMessage.value = {
      message: "Do you want to approve this company?",
      id: organisationId as string,
    };
    showConfirmApproval.value = true;
  } else {
    // Use DeclineModal for decline with notification
    selectedOrganisationId.value = id;
    showDeclineModal.value = true;
  }
  errorMessage.value = ""; // Clear previous errors
}

// Handle decline modal submission
async function handleDeclineSubmitted() {
  showDeclineModal.value = false;

  if (selectedOrganisationId.value) {
    loading.value = true;
    errorMessage.value = "";
    try {
      console.log(
        "Calling approval API to decline company:",
        selectedOrganisationId.value
      );
      const response = await request(
        kycStore().approval(selectedOrganisationId.value.toString(), false)
      );

      console.log("Decline response:", response);

      if (response?.data?.succeeded) {
        successMessage.value = "Company declined successfully";
        showSuccess.value = true;
        setTimeout(() => window.location.reload(), 2000);
      } else {
        errorMessage.value =
          response?.data?.message || "Decline failed. Please try again.";
      }
    } catch (error: any) {
      console.error("Error declining company:", error);
      errorMessage.value = error?.message || "Something went wrong.";
      handleError(error, "Decline failed");
    } finally {
      loading.value = false;
      selectedOrganisationId.value = null;
    }
  }
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
