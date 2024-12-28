<script setup lang="ts">
import { ref, computed } from 'vue';
import { required, helpers } from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';
import ButtonBlue from '../components/buttons/ButtonBlue.vue';
import SuccessAlert from '../components/alerts/SuccessAlert.vue';
import { IClose } from '../core/icons';

// Props
const props = defineProps<{ employeeId: any; employeeAmount: number }>();

// Emits
const emit = defineEmits<{
  (e: 'close_tax'): void;
  (e: 'save_tax', taxData: { amount: number }): void;
}>();

// Variables
const loading = ref(false);
const showSuccess = ref(false);
const responseData = ref<any>();
const data = ref({ amount: props.employeeAmount ?? 0 });

// Validation rules
const rules = computed(() => ({
  amount: {
    required: helpers.withMessage('Tax amount is required', required),
  },
}));

// Submit handler
const handleSubmit = () => {
  if (v$.value.$invalid) {
    return;
  }

  emit('save_tax', { amount: data.value.amount });
  console.log('Emitting Tax Data:', { amount: data.value.amount });

  emit('close_tax');
};

const v$ = useVuelidate(rules as any, data);
</script>


<template>
    <div
      class="relative z-[99999]"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <SuccessAlert
        :showSuccess="showSuccess"
        @closeSuccess="showSuccess = false"
        v-if="showSuccess"
      >
        <template #otherMessage>CLOSE</template>
        {{ responseData.message }}
      </SuccessAlert>
  
      <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>
  
      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div
          class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
        >
          <div
            class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md"
          >
            <form @submit.prevent="handleSubmit" class="bg-white px-[37px] py-[27px] space-y-8">
              <header>
                <div class="flex items-start justify-between">
                  <div>
                    <h3 class="text-black-rgba font-medium text-2xl">
                      Add New Tax
                    </h3>
                    <p class="text-sm font-semimedium text-black-rgba-100">
                      Tax will be deducted from the employee's salary.
                    </p>
                  </div>
                  <button
                    type="button"
                    v-on:click="$emit('close_tax')"
                    class="bg-blue-lighter rounded-full top-12 right-12 p-3"
                  >
                    <IClose />
                  </button>
                </div>
              </header>
  
              <!-- Form -->
              <div class="space-y-6">
                <div
                  class="font-normal text-left rounded-xl px-4 h-[48px] relative border border-grey-300"
                >
                  <p class="absolute -top-2 font-normal text-xs left-5 text-[#000000] bg-white">
                    Amount
                  </p>
                  <div class="flex justify-between items-center h-full w-full">
                    <input
                      type="text"
                      required
                      v-model.number="data.amount"
                      placeholder="Tax amount"
                      class="placeholder-strong rounded-lg w-full text-sm outline-none border-none h-full focus:outline-none focus:border-none"
                    />
                  </div>
                  <div v-if="v$.amount.$error" class="text-red-600 text-xs">
                    {{ '* ' + v$.amount.$errors[0].$message }}
                  </div>
                </div>
              </div>
  
              <!-- Submit Button -->
              <div class="flex pb-5">
                <ButtonBlue type="submit">
                  <template #placeholder>
                    <spinner v-if="loading" />
                    <span v-else>Add Tax</span>
                  </template>
                </ButtonBlue>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </template>
  
