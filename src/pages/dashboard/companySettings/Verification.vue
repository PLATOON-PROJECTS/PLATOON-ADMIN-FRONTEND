<template>
  <section class="px-8 py-6 space-y-10 bg-white">
    <!-- Status & Actions -->
    <div class="flex justify-between items-start bg-white">
      <div>
        <h1 class="text-sm font-medium text-[#A6A6A6]">Status</h1>
        <p
          :class="[
            'inline-block mt-1 px-3 py-1 rounded-full text-xs font-medium',
            isVerified
              ? 'bg-[#F6F7F9] text-[#46A754]'
              : 'bg-[#FFE5E6] text-[#FF4C51]',
          ]"
        >
          {{ isVerified ? "Verified" : "Unverified" }}
        </p>
      </div>
      <div class="flex gap-4">
        <button
          class="px-4 py-2 rounded-full border border-[#E6E6E6] text-sm font-medium hover:bg-gray-100"
        >
          Decline
        </button>
        <button
          class="px-4 py-2 rounded-full bg-[#306651] text-white text-sm font-medium hover:bg-green-700"
        >
          Approve
        </button>
      </div>
    </div>

    <!-- Business Owner Information -->
    <div class="space-y-4 border border-[#EDEDED] rounded-lg p-6 bg-white">
      <h2 class="text-lg font-medium text-black border-b border-[#EDEDED]">
        Business Owner Information
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Column 1 -->
        <div class="space-y-4">
          <div>
            <p class="text-sm text-[#A6A6A6] mb-2 font-medium">First Name</p>
            <p class="text-base text-[#444444] font-medium">John</p>
          </div>
          <div>
            <p class="text-sm text-[#A6A6A6] mb-2 font-medium">Email</p>
            <p class="text-base text-[#444444] font-medium">john@example.com</p>
          </div>
          <div>
            <p class="text-sm text-[#A6A6A6] mb-2 font-medium">BVN</p>
            <p class="text-base text-[#444444] font-medium">12345678901</p>
          </div>
        </div>
        <!-- Column 2 -->
        <div class="space-y-4">
          <div>
            <p class="text-sm text-[#A6A6A6] mb-2 font-medium">Middle Name</p>
            <p class="text-base text-[#444444] font-medium">Michael</p>
          </div>
          <div>
            <p class="text-sm text-[#A6A6A6] mb-2 font-medium">Phone Number</p>
            <p class="text-base text-[#444444] font-medium">
              +234 800 000 0001
            </p>
          </div>
          <div>
            <p class="text-sm text-[#A6A6A6] mb-2 font-medium">Country</p>
            <p class="text-base text-[#444444] font-medium">Nigeria</p>
          </div>
        </div>
        <!-- Column 3 -->
        <div class="space-y-4">
          <div>
            <p class="text-sm text-[#A6A6A6] mb-2 font-medium">Last Name</p>
            <p class="text-base text-[#444444] font-medium">Doe</p>
          </div>
          <div>
            <p class="text-sm text-[#A6A6A6] mb-2 font-medium">Gender</p>
            <p class="text-base text-[#444444] font-medium">Male</p>
          </div>
          <div>
            <p class="text-sm text-[#A6A6A6] mb-2 font-medium">Address</p>
            <p class="text-base text-[#444444] font-medium">
              123 Main Street, Lagos
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Business Documents -->
    <div class="space-y-4 border border-[#EDEDED] rounded-lg p-6 bg-white">
      <div
        class="flex justify-between items-center py-2 border-b border-[#EDEDED]"
      >
        <h2 class="text-lg font-semibold text-gray-800">Business Documents</h2>
        <button
          @click="showModal = true"
          class="px-4 py-2 flex items-center gap-2 text-[#306651] text-sm border border-[#306651] rounded-full"
        >
          <img src="/images/svg/cloud.svg" alt="Upload" />
          Upload
        </button>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full bg-white rounded-lg overflow-hidden">
          <thead
            class="bg-gray-100 text-left text-sm font-medium text-gray-600"
          >
            <tr>
              <th class="px-4 py-3">Document</th>
              <th class="px-4 py-3">Status</th>
              <th class="px-4 py-3">Uploaded</th>
              <th class="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody class="text-sm text-gray-800">
            <tr v-for="doc in documents" :key="doc.name">
              <td class="flex items-center gap-2 px-4 py-3">
                <IFileText color="#46A754" size="20px" />
                <div class="flex flex-col gap-2">
                  <p class="font-medium text-[#444444] text-base">
                    {{ doc.name }}
                  </p>
                  <p class="text-xs text-[#737373]">
                    Uploaded {{ doc.uploaded }}
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
              <td class="px-4 py-3">
                <span class="text-[#737373]">{{
                  doc.status === "Approved" ? doc.uploaded : "-"
                }}</span>
              </td>
              <td class="px-4 py-3">
                <div class="flex gap-2">
                  <button class="text-blue-600 hover:underline text-sm">
                    <IDownload color="#306651" />
                  </button>
                  <template v-if="doc.status === 'Pending'">
                    <button
                      class="px-3 py-1 bg-[#306651] text-white text-sm rounded-full hover:bg-green-700"
                    >
                      Accept
                    </button>
                    <button
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
    </div>
  </section>

  <!-- Modal -->
  <transition name="fade">
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center"
    >
      <div class="bg-white w-full max-w-md rounded-lg shadow-lg p-6 relative">
        <!-- Title & Close -->
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-medium text-[#222222DE]">Upload Document</h3>
          <button
            @click="showModal = false"
            class="text-gray-500 h-6 w-6 hover:text-black text-xl"
          >
            &times;
          </button>
        </div>

        <!-- Document Select -->
        <!-- Custom Dropdown -->
        <div class="relative mb-4">
          <label class="block text-sm text-[#2D2B32] font-medium mb-1"
            >Select Document</label
          >
          <button
            @click="isDropdownOpen = !isDropdownOpen"
            class="w-full border border-[#E6E6E6] rounded-lg p-4 text-sm text-left flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-[#306651]"
          >
            <span class="text-[#626669]">
              {{ selectedDoc || "Select a document" }}
            </span>
            <svg
              class="w-4 h-4 text-[#626669]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </button>

          <!-- Dropdown list -->
          <ul
            v-if="isDropdownOpen"
            class="absolute z-10 mt-1 w-full bg-white border border-[#E6E6E6] rounded-lg shadow-lg max-h-60 overflow-auto"
          >
            <li
              v-for="(doc, index) in documentOptions"
              :key="doc"
              @click="selectDocument(doc)"
              class="px-4 py-3 text-sm text-[#626669] hover:bg-gray-50 cursor-pointer"
              :class="{
                'border-b border-[#E6E6E6]': index < documentOptions.length - 1,
              }"
            >
              {{ doc }}
            </li>
          </ul>
        </div>

        <!-- Upload or Remove File -->
        <div class="mb-4 border border-[#E6E6E6] rounded-lg p-4">
          <div
            v-if="uploadedFile"
            class="flex flex-col items-center gap-4 bg-gray-100 px-3 py-2 rounded"
          >
            <IFileText color="#46A754" />
            <p class="text-sm text-gray-800 truncate max-w-[70%]">
              {{ uploadedFile.name }}
            </p>
            <button
              @click="removeFile"
              class="text-[#FF4C51] font-semibold border border-[#E6E6E6] rounded-lg px-4 py-2 text-sm hover:underline"
            >
              Remove
            </button>
          </div>

          <div v-else>
            <input
              type="file"
              @change="handleFileUpload"
              class="block w-full text-sm text-gray-600 file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-[#306651] file:text-white hover:file:bg-green-700"
            />
          </div>
        </div>

        <!-- Submit (optional) -->
        <button
          class="mt-2 w-[40%] bg-[#306651] text-white py-2 rounded-full hover:bg-green-700 text-sm font-medium"
        >
          Upload
        </button>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref } from "vue";
import IDownload from "../../../components/icons/IDownload.vue";
import IFileText from "../../../components/icons/IFileText.vue";
import { onMounted, onUnmounted } from "vue";

const showModal = ref(false);
const selectedDoc = ref("");
const uploadedFile = ref<File | null>(null);
const documentOptions = [
  "Certificate of Business Name",
  "Proof of Address",
  "Company Tax ID",
];

function handleFileUpload(event: Event) {
  const file = (event.target as HTMLInputElement)?.files?.[0];
  if (file) uploadedFile.value = file;
}

function removeFile() {
  uploadedFile.value = null;
}
const isDropdownOpen = ref(false);

function selectDocument(doc: string) {
  selectedDoc.value = doc;
  isDropdownOpen.value = false;
}

function handleClickOutside(event: MouseEvent) {
  const dropdown = document.querySelector(".relative");
  if (dropdown && !dropdown.contains(event.target as Node)) {
    isDropdownOpen.value = false;
  }
}

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});
onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});

const isVerified = ref(false);

const documents = ref([
  {
    name: "Certificate of Business Name",
    uploaded: "6 Jun, 2025",
    status: "Approved",
  },
  { name: "Proof of Address", uploaded: "6 Jun, 2025", status: "Pending" },
  { name: "Company Tax ID", uploaded: "6 Jun, 2025", status: "Rejected" },
]);
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
