<template>
  <div class="space-y-4 border border-[#EDEDED] rounded-lg p-6 bg-white">
    <div
      class="flex justify-between items-center py-2 border-b border-[#EDEDED]"
    >
      <h2 class="text-lg font-medium text-black">Business Owner Information</h2>
      <button
        v-if="!isSubmitted"
        @click="submitInfo"
        :disabled="loading"
        class="bg-[#306651] text-white px-4 py-2 rounded-full hover:bg-green-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ loading ? "Submitting..." : "Update Information" }}
      </button>
    </div>

    <form
      @submit.prevent="submitInfo"
      class="grid grid-cols-1 md:grid-cols-3 gap-6"
    >
      <div class="space-y-4">
        <div>
          <label class="text-sm text-[#A6A6A6] mb-2 font-medium block"
            >First Name *</label
          >
          <input
            v-model="formData.firstname"
            type="text"
            required
            class="w-full px-3 py-2 border border-[#EDEDED] rounded-lg focus:outline-none focus:border-[#306651]"
            placeholder="Enter first name"
          />
        </div>
        <div>
          <label class="text-sm text-[#A6A6A6] mb-2 font-medium block"
            >Email *</label
          >
          <input
            v-model="formData.email"
            type="email"
            required
            class="w-full px-3 py-2 border border-[#EDEDED] rounded-lg focus:outline-none focus:border-[#306651]"
            placeholder="Enter email address"
          />
        </div>
        <div>
          <label class="text-sm text-[#A6A6A6] mb-2 font-medium block"
            >BVN *</label
          >
          <input
            v-model="formData.bvn"
            type="text"
            required
            maxlength="11"
            class="w-full px-3 py-2 border border-[#EDEDED] rounded-lg focus:outline-none focus:border-[#306651]"
            placeholder="Enter BVN"
          />
        </div>
      </div>

      <div class="space-y-4">
        <div>
          <label class="text-sm text-[#A6A6A6] mb-2 font-medium block"
            >Middle Name</label
          >
          <input
            v-model="formData.middlename"
            type="text"
            class="w-full px-3 py-2 border border-[#EDEDED] rounded-lg focus:outline-none focus:border-[#306651]"
            placeholder="Enter middle name"
          />
        </div>
        <div>
          <label class="text-sm text-[#A6A6A6] mb-2 font-medium block"
            >Phone Number *</label
          >
          <input
            v-model="formData.phone"
            type="tel"
            required
            class="w-full px-3 py-2 border border-[#EDEDED] rounded-lg focus:outline-none focus:border-[#306651]"
            placeholder="Enter phone number"
          />
        </div>
        <div>
          <label class="text-sm text-[#A6A6A6] mb-2 font-medium block"
            >Country *</label
          >
          <input
            v-model="formData.country"
            type="text"
            required
            class="w-full px-3 py-2 border border-[#EDEDED] rounded-lg focus:outline-none focus:border-[#306651]"
            placeholder="Enter country"
          />
        </div>
      </div>

      <div class="space-y-4">
        <div>
          <label class="text-sm text-[#A6A6A6] mb-2 font-medium block"
            >Last Name *</label
          >
          <input
            v-model="formData.lastname"
            type="text"
            required
            class="w-full px-3 py-2 border border-[#EDEDED] rounded-lg focus:outline-none focus:border-[#306651]"
            placeholder="Enter last name"
          />
        </div>
        <div>
          <label class="text-sm text-[#A6A6A6] mb-2 font-medium block"
            >Gender *</label
          >
          <select
            v-model="formData.gender"
            required
            class="w-full px-3 py-2 border border-[#EDEDED] rounded-lg focus:outline-none focus:border-[#306651]"
          >
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label class="text-sm text-[#A6A6A6] mb-2 font-medium block"
            >Address *</label
          >
          <textarea
            v-model="formData.address"
            required
            rows="3"
            class="w-full px-3 py-2 border border-[#EDEDED] rounded-lg focus:outline-none focus:border-[#306651] resize-none"
            placeholder="Enter address"
          ></textarea>
        </div>
      </div>
    </form>

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
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { request } from "../../composables/request.composable";
import handleError from "../../composables/handle_error.composable";
import SuccessAlert from "../../components/alerts/SuccessAlert.vue";
import { useKycStore } from "../../store/index";

const route = useRoute();
const kycStore = useKycStore();
const loading = ref(false);
const isSubmitted = ref(false);
const showSuccess = ref(false);
const successMessage = ref("");

const formData = ref({
  organisationId: 0,
  firstname: "",
  middlename: "",
  lastname: "",
  phone: "",
  email: "",
  gender: "",
  country: "",
  address: "",
  bvn: "",
});

onMounted(() => {
  formData.value.organisationId = Number(route.params.id);
});

const submitInfo = async () => {
  loading.value = true;
  try {
    const response = await request(kycStore.submitKycInfo(formData.value));

    if (response?.data) {
      successMessage.value =
        "Business owner information submitted successfully";
      showSuccess.value = true;
      isSubmitted.value = true;

      // Emit event to parent to refresh data
      emit("info-submitted");

      // Hide success message after 3 seconds
      setTimeout(() => {
        showSuccess.value = false;
      }, 3000);
    }
  } catch (error) {
    handleError(error, "Failed to submit business owner information");
  } finally {
    loading.value = false;
  }
};

const emit = defineEmits(["info-submitted"]);
</script>
