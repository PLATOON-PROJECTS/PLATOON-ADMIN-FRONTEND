<transition name="fade">
  <div
    v-if="showModal"
    class="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center"
  >
    <div class="bg-white w-full max-w-md rounded-lg shadow-lg p-6 relative">
      <!-- Title & Close -->
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold text-gray-800">Upload Document</h3>
        <button @click="showModal = false" class="text-gray-500 hover:text-black text-xl">&times;</button>
      </div>

      <!-- Document Select -->
      <div class="mb-4">
        <label class="block text-sm text-gray-600 mb-1">Select Document</label>
        <select
          v-model="selectedDoc"
          class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#306651]"
        >
          <option value="" disabled>Select a document</option>
          <option v-for="doc in documentOptions" :key="doc" :value="doc">
            {{ doc }}
          </option>
        </select>
      </div>

      <!-- Upload or Remove File -->
      <div class="mb-4">
        <label class="block text-sm text-gray-600 mb-1">Upload File</label>

        <div v-if="uploadedFile" class="flex justify-between items-center bg-gray-100 px-3 py-2 rounded">
          <p class="text-sm text-gray-800 truncate max-w-[70%]">
            {{ uploadedFile.name }}
          </p>
          <button @click="removeFile" class="text-red-500 text-sm hover:underline">Remove</button>
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
        class="mt-2 w-full bg-[#306651] text-white py-2 rounded hover:bg-green-700 text-sm font-medium"
      >
        Upload
      </button>
    </div>
  </div>
</transition>

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
