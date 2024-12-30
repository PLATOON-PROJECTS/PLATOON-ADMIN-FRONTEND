<script setup lang="ts">
import { ref } from "vue";
import settingsService from "../../service/settings/settings.service";
import { useAuthStore, useUserStore } from "../../store/index";
import ButtonBlue from "../../components/buttons/ButtonBlue.vue";

const authStore = useAuthStore();
const userStore = useUserStore();

const payrollFee = ref<number | null>(null);
const disabled = ref(true);
const errorMessage = ref("");
const loading = ref(false);
const showSuccess = ref(false);
const responseData = ref<any>(null);
const isEditing = ref(false);

const toggleEdit = () => {
  isEditing.value = !isEditing.value;
  disabled.value = !isEditing.value;
};

const updatePayrollFee = async () => {
  if (payrollFee.value !== null) {
    loading.value = true;
    errorMessage.value = "";
    showSuccess.value = false;
    try {
      const response = await settingsService.update(payrollFee.value);
      if (response && response.succeeded) {
        // Handle success
        showSuccess.value = true;
        responseData.value = response;
        console.log("Payroll fee updated successfully");
        isEditing.value = false;
        disabled.value = true;
      } else {
        // Handle error
        errorMessage.value =
          response?.message || "Failed to update payroll fee";
      }
    } catch (error) {
      console.error("Error in updatePayrollFee:", error);
      errorMessage.value =
        (error as any).message ||
        "An error occurred while updating payroll fee";
    } finally {
      loading.value = false;
    }
  }
};
</script>

<template>
  <div class="px-6 py-9 space-y-6 cursor-pointer">
    <h3 class="text-black-rgba font-medium text-2xl">Settings</h3>

    <div class="bg-white min-h-screen rounded-t-lg p-6 space-y-9 h-auto">
      <div
        class="flex items-center justify-between overflow-auto scrollbar-hide lg:space-x-0 space-x-3"
      >
        <div>
          <h3 class="text-black-rgba font-medium text-base">Manage Settings</h3>
          <h3 class="mt-6 text-black-rgba font-medium text-base">
            Company Settings
          </h3>
          <span class="text-sm text-[#626669A3]"
            >This company payroll fee will be updated and saved.</span
          >
        </div>

        <ButtonBlue @click="isEditing ? updatePayrollFee() : toggleEdit()">
          <template #placeholder>
            <spinner v-if="loading == true" />
            <span v-else>{{
              isEditing ? "Save Changes" : "Edit Settings"
            }}</span>
          </template>
        </ButtonBlue>
      </div>

      <div class="relative w-[30%] text-[#626669]">
        <label for="Payroll fee" class="mb-4"> Payroll fee</label>
        <input
          :disabled="disabled"
          type="number"
          id="Payroll"
          v-model="payrollFee"
          maxlength="54"
          class="input-float text-black peer pr-10.5"
          placeholder=""
        />

        <div v-if="errorMessage" class="text-red-600 text-xs">
          {{ errorMessage }}
        </div>
        <successAlert
          :showSuccess="showSuccess"
          @closeSuccess="showSuccess = false"
          v-if="showSuccess == true"
        >
          <template #otherMessage>CLOSE</template>
          {{ responseData.message }}
        </successAlert>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Hide number input arrows */
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  appearance: textfield;
  -moz-appearance: textfield;
}
</style>
