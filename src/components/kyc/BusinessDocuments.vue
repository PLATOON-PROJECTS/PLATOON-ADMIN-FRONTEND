<template>
  <div class="space-y-4 border border-[#EDEDED] rounded-lg p-6 bg-white">
    <div
      class="flex justify-between items-center py-2 border-b border-[#EDEDED]"
    >
      <h2 class="text-lg font-semibold text-gray-800">Business Documents</h2>
      <button
        @click="$emit('open-upload')"
        :disabled="props.documents.length >= 3"
        class="px-4 py-2 flex items-center gap-2 text-[#306651] text-sm border border-[#306651] rounded-full"
        :class="{
          'opacity-50 cursor-not-allowed': props.documents.length >= 3,
        }"
      >
        <img src="/images/svg/cloud.svg" alt="Upload" />
        Upload
      </button>
    </div>

    <div v-if="documents.length > 0" class="overflow-x-auto">
      <table class="min-w-full bg-white rounded-lg overflow-hidden">
        <thead class="bg-gray-100 text-left text-sm font-medium text-gray-600">
          <tr>
            <th class="px-4 py-3">Document</th>
            <th class="px-4 py-3">Status</th>
            <th class="px-4 py-3">Uploaded</th>
            <th class="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody class="text-sm text-gray-800">
          <tr v-for="doc in documents" :key="doc.id">
            <td class="flex items-center gap-2 px-4 py-3">
              <IFileText color="#46A754" size="20px" />
              <div class="flex flex-col gap-2">
                <p class="font-medium text-[#444444] text-base">
                  {{ getDocumentTypeFull(doc.documentType) }}
                </p>
                <p class="text-xs text-[#737373]">
                  Uploaded: {{ new Date(doc.createdAt).toLocaleDateString() }}
                </p>
              </div>
            </td>
            <td class="px-4 py-3">
              <span
                :class="[
                  'inline-block px-3 py-1 rounded-full text-sm font-medium',
                  doc.status === 'Approved'
                    ? 'text-[#46A754]'
                    : doc.status === 'Pending'
                    ? 'text-[#FFB400]'
                    : 'text-[#FF4C51]',
                ]"
              >
                {{ doc.status }}
              </span>
            </td>
            <td class="px-4 py-3 text-[#737373]">
              {{ new Date(doc.createdAt).toLocaleDateString() }}
            </td>
            <td class="px-4 py-3">
              <div class="flex gap-2 items-center">
                <a
                  v-if="doc.documentUrl.endsWith('.pdf')"
                  :href="`https://docs.google.com/viewer?url=${encodeURIComponent(
                    doc.documentUrl
                  )}&embedded=true`"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="shadow-lg border border-[#EEEEEE] p-2 text-[#306651] hover:underline hover:text-blue-500"
                  @click.stop
                >
                  View
                </a>
                <a
                  v-else
                  :href="doc.documentUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="shadow-lg border border-[#EEEEEE] p-2 text-[#306651] hover:underline hover:text-blue-500"
                  @click.stop
                >
                  View
                </a>

                <!-- Show buttons only if status is Pending -->
                <template v-if="doc.status === 'Pending'">
                  <button
                    @click="triggerConfirmation(true, doc.id)"
                    class="px-3 py-1 bg-[#306651] text-white text-sm rounded-full hover:bg-green-700"
                  >
                    Accept
                  </button>
                  <button
                    @click="triggerConfirmation(false, doc.id)"
                    class="px-3 py-1 bg-[#FF4C51] text-white text-sm rounded-full hover:bg-red-700"
                  >
                    Reject
                  </button>
                </template>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty state for documents -->
    <div v-else class="text-center py-8">
      <div class="text-gray-400 mb-4">
        <svg
          class="mx-auto h-12 w-12"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      </div>
      <h3 class="text-sm font-medium text-gray-900 mb-2">
        No documents uploaded
      </h3>
      <p class="text-sm text-gray-500 mb-4">
        Upload your business documents to complete the KYC verification process.
      </p>
      <button
        @click="$emit('open-upload')"
        class="bg-[#306651] text-white px-4 py-2 rounded-full hover:bg-green-700 text-sm font-medium"
      >
        Upload Document
      </button>
    </div>

    <!-- Confirm Alert -->
    <confirmAlert
      :showConfirm="showConfirmApproval"
      @closeConfirm="showConfirmApproval = false"
      v-if="showConfirmApproval"
    >
      <template #title>{{
        approvalIntent ? "Approve Document" : "Reject Document"
      }}</template>
      <template #message>{{ confirmMessage.message }}</template>
      <template #confirm>
        <span
          @click="
            submitDocumentApproval(Number(confirmMessage.id), approvalIntent)
          "
          class="cursor-pointer text-[#306651] font-semibold"
        >
          CONFIRM
        </span>
      </template>
    </confirmAlert>

    <!-- Success Alert -->
    <successAlert
      :showSuccess="showSuccess"
      @closeSuccess="showSuccess = false"
      v-if="showSuccess"
    >
      <template #otherMessage>CLOSE</template>
      {{ successMessage }}
    </successAlert>
  </div>

  <!-- Rejection Modal -->
  <RejectionModal
    :show="showRejectionModal"
    :userId="userId"
    :roleId="0"
    :organisationId="organisationId"
    @close="
      () => {
        console.log('RejectionModal closed');
        showRejectionModal = false;
      }
    "
    @submitted="
      () => {
        console.log('RejectionModal submitted event received');
        handleRejectionSubmitted();
      }
    "
  />
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import IFileText from "../../components/icons/IFileText.vue";
import ConfirmAlert from "../../components/alerts/ConfirmAlert.vue"; // import
import SuccessAlert from "../../components/alerts/SuccessAlert.vue"; // import
import { request } from "../../composables/request.composable";
import handleError from "../../composables/handle_error.composable";
import kycStore from "../../store/modules/kyc.store";
import RejectionModal from "../../modals/RejectionModal.vue";

const route = useRoute();

const props = defineProps<{ documents: any[] }>();
defineEmits(["open-upload"]);

const showConfirmApproval = ref(false);
const showSuccess = ref(false);
const loading = ref(false);
const approvalIntent = ref(true);
const confirmMessage = ref({ message: "", id: "" });
const successMessage = ref("Action successful");

// RejectionModal variables
const showRejectionModal = ref(false);
const selectedDocumentId = ref<number | null>(null);

// Computed properties for IDs
const userId = computed(() => Number(window.localStorage.getItem("userId")));
const organisationId = computed(() => Number(route.params.id));

// Confirm modal trigger
function triggerConfirmation(accept: boolean, docId: number) {
  if (accept) {
    approvalIntent.value = true;
    confirmMessage.value = {
      message: "Do you want to approve this document?",
      id: docId.toString(),
    };
    showConfirmApproval.value = true;
  } else {
    // Open RejectionModal for rejection with notification
    selectedDocumentId.value = docId;
    showRejectionModal.value = true;
  }
}

// Handle rejection modal submission
async function handleRejectionSubmitted() {
  console.log(
    "handleRejectionSubmitted called with documentId:",
    selectedDocumentId.value
  );
  showRejectionModal.value = false;

  if (selectedDocumentId.value) {
    loading.value = true;
    try {
      console.log(
        "Calling docApprove API to reject document:",
        selectedDocumentId.value
      );
      // Call the API to reject the document
      const response = await request(
        kycStore().docApprove(
          selectedDocumentId.value,
          false,
          "Document rejected"
        )
      );

      console.log("docApprove response:", response);

      // Update UI immediately regardless of API response structure
      const targetDoc = props.documents.find(
        (d) => d.id === selectedDocumentId.value
      );
      if (targetDoc) {
        console.log("Updating document status to Rejected for:", targetDoc);
        targetDoc.status = "Rejected";
        console.log("Document status updated, UI should refresh now");
      }

      successMessage.value = "Document rejected successfully";
      showSuccess.value = true;

      // Refresh the page after successful rejection
      setTimeout(() => {
        window.location.reload();
      }, 1500); // Wait 1.5 seconds to show success message before refresh
    } catch (error) {
      console.error("Error rejecting document:", error);
      handleError(error, "Document rejection failed");
    } finally {
      loading.value = false;
      selectedDocumentId.value = null;
    }
  } else {
    console.log("No selectedDocumentId found");
  }
}

// Call the document approval API
async function submitDocumentApproval(documentId: number, accept: boolean) {
  loading.value = true;
  try {
    const response = await request(
      kycStore().docApprove(documentId, accept, "")
    );

    if (response?.data) {
      successMessage.value = accept
        ? "Document approved successfully"
        : "Document rejected successfully";
      showSuccess.value = true;
      showConfirmApproval.value = false;

      // update locally:
      const targetDoc = props.documents.find((d) => d.id === documentId);
      if (targetDoc) {
        targetDoc.status = accept ? "Approved" : "Rejected";
      }
    }
  } catch (error) {
    handleError(error, "Document approval failed");
  } finally {
    loading.value = false;
  }
}

const documentTypeMap: Record<string, string> = {
  POA: "Proof of Address",
  CAC: "Corporate Affairs Commission (CAC)",
  CAC_BN1: "Business Name/Limited Liability Company",
  SR: "Status Report",
};

function getDocumentTypeFull(type: string) {
  return documentTypeMap[type] || type;
}
</script>
