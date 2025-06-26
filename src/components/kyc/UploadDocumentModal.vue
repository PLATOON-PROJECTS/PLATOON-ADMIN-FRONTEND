<template>
  <transition name="fade">
    <div
      v-if="modelValue"
      class="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center"
    >
      <div class="bg-white w-full max-w-md rounded-lg shadow-lg p-6 relative">
        <!-- Header -->
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-medium text-[#222222DE]">Upload Document</h3>
          <button
            @click="$emit('update:modelValue', false)"
            class="text-gray-500 h-6 w-6 hover:text-black text-xl"
          >
            &times;
          </button>
        </div>

        <!-- Dropdown -->
        <div class="relative mb-4">
          <label class="block text-sm text-[#2D2B32] font-medium mb-1"
            >Select Document</label
          >
          <button
            @click="isDropdownOpen = !isDropdownOpen"
            class="w-full border border-[#E6E6E6] rounded-lg p-4 text-sm text-left flex justify-between items-center"
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
              />
            </svg>
          </button>

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

        <!-- File Upload -->
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

        <!-- Submit -->
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
import { ref, onMounted, onUnmounted } from "vue";
import IFileText from "../../components/icons/IFileText.vue";

defineProps<{
  modelValue: boolean;
}>();
defineEmits(["update:modelValue"]);

const uploadedFile = ref<File | null>(null);
const selectedDoc = ref("");
const isDropdownOpen = ref(false);

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
