<script lang="ts" setup>
import { useUserStore } from "../../store";
import { ref } from "vue";

// Local state
const selectedFile = ref<File | null>(null);
const showUploadInput = ref(false);

const userStore = useUserStore(); // ✅ Pinia store instance

// Handle file select
function onFileChange(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    selectedFile.value = target.files[0];
  }
}

// Upload
async function uploadImage() {
  if (!selectedFile.value) {
    alert("Please select a file to upload.");
    return;
  }

  const userId = Number(localStorage.getItem("userId"));
  if (!userId) {
    alert("User ID not found.");
    return;
  }

  try {
    const response = await userStore.uploadPassport(selectedFile.value, userId);
    if (response && response.status === 200) {
      alert("Profile picture uploaded successfully!");
      showUploadInput.value = false; // Hide input after success
    } else {
      alert("Upload failed.");
    }
  } catch (error) {
    console.error(error);
    alert("An error occurred during upload.");
  }
}
</script>

<template>
  <div class="bg-width-animate">
    <Transition
      name="confirm-slide"
      enter-active-class="animate__animated animate__fadeInUpBig"
      leave-active-class="animate__animated animate__fadeOutUpBig"
      :duration="400"
    >
      <div
        class="rounded-lg px-7 py-6 space-y-6 flex shadow-lg flex-col justify-between top-18 bg-white h-auto mx-4 right-0 fixed z-[9999]"
      >
        <div class="space-y-2">
          <div>
            <span class="text-base font-medium"> Manage Profile </span>
          </div>

          <div>
            <router-link
              to="/dashboard/myprofile"
              class="font-normal text-[#222222AD]"
            >
              Edit information, change password
            </router-link>
          </div>

          <div>
            <button
              @click="showUploadInput = !showUploadInput"
              class="bg-blue-500 rounded px-4 py-2"
            >
              Upload Profile Picture
            </button>
          </div>

          <!-- Conditionally Render Image Upload Section -->
          <div v-if="showUploadInput">
            <label class="block text-sm font-medium text-gray-700"
              >Select Image</label
            >
            <input
              type="file"
              @change="onFileChange"
              accept="image/*"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
            />
            <button
              @click="uploadImage"
              class="mt-2 bg-blue-500 rounded px-4 py-2"
            >
              Upload
            </button>
          </div>
        </div>

        <div
          class="pb-4"
          @click="[$emit('logout'), $emit('closeProfileAction')]"
        >
          <h3 class="text-base font-medium flex items-center cursor-pointer">
            Logout
          </h3>
        </div>
      </div>
    </Transition>
  </div>
</template>
