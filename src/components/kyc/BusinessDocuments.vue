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

    <div class="overflow-x-auto">
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
</template>

<script setup lang="ts">
import { ref } from "vue";
import IEyeOpened from "../../components/icons/IEyeOpened.vue";
import IFileText from "../../components/icons/IFileText.vue";
import ConfirmAlert from "../../components/alerts/ConfirmAlert.vue"; // import
import SuccessAlert from "../../components/alerts/SuccessAlert.vue"; // import
import { request } from "../../composables/request.composable";
import handleError from "../../composables/handle_error.composable";
import kycStore from "../../store/modules/kyc.store";

const props = defineProps<{ documents: any[] }>();
defineEmits(["open-upload"]);

const showConfirmApproval = ref(false);
const showSuccess = ref(false);
const loading = ref(false);
const approvalIntent = ref(true);
const confirmMessage = ref({ message: "", id: "" });
const successMessage = ref("Action successful");

// Confirm modal trigger
function triggerConfirmation(accept: boolean, docId: number) {
  approvalIntent.value = accept;
  confirmMessage.value = {
    message: accept
      ? "Do you want to approve this document?"
      : "Do you want to reject this document?",
    id: docId.toString(),
  };
  showConfirmApproval.value = true;
}

// Call the document approval API
async function submitDocumentApproval(documentId: number, accept: boolean) {
  loading.value = true;
  try {
    const response = await request(kycStore().docApprove(documentId, accept));

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
  CAC_BN1: "Business Name (CAC BN1)",
  SR: "Status Report",
};

function getDocumentTypeFull(type: string) {
  return documentTypeMap[type] || type;
}
</script>
