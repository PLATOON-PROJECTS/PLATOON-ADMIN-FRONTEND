<script lang="ts" setup>
import { ref } from "vue";
import userStore from "../../store/modules/user.store";
import successAlert from "../alerts/SuccessAlert.vue";

import { defineEmits } from "vue";

const emit = defineEmits(["imageUploaded", "logout", "closeProfileAction"]);

const selectedFile = ref<File | null>(null);
const showUploadInput = ref(false); // Reactive variable to control visibility
const store = userStore(); // Initialize the store
const showSuccess = ref(false);
const successMessage = ref("");

const onFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    selectedFile.value = target.files[0];
  }
};

const uploadImage = async () => {
  if (!selectedFile.value) {
    alert("Please select a file to upload.");
    return;
  }

  const formData = new FormData();
  formData.append("Image", selectedFile.value);

  const userId = Number(localStorage.getItem("userId"));
  console.log("User ID:", userId);

  formData.append("UserId", userId.toString());

  try {
    const response = await store.uploadPassport(selectedFile.value, userId);

    if (response?.data?.succeeded) {
      console.log("Image uploaded successfully:", response.data);
      console.log("Image:", response.data.data);
      showUploadInput.value = false;

      emit("imageUploaded", response.data.data);
    } else {
      showSuccess.value = true;
      successMessage.value = "Failed to update profile picture.";
    }
  } catch (error: any) {
    console.error("Error uploading image:", error.response?.data || error);
  }
};
</script>

<template>
  <successAlert
    @closeSuccess="showSuccess = false"
    v-if="showSuccess == true"
    :showSuccess="showSuccess"
  >
    <template #otherMessage>CLOSE</template>
    {{ successMessage }}
  </successAlert>
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
          <div class="">
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
              class="bg-blue-500 text-[#222222AD] rounded px-4 py-2"
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
              class="mt-2 bg-blue-500 text-[#222222AD] rounded px-4 py-2"
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
<style scoped>
.bg-width-animate {
  -webkit-transition: width 1s ease-in-out;
  -moz-transition: width 1s ease-in-out;
  -o-transition: width 1s ease-in-out;
  transition: width 1s ease-in-out;
}
</style>
