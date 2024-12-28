<script setup lang="ts">
import { ref, reactive, inject, computed, provide } from 'vue';
import { useRouter } from 'vue-router';
import ButtonBlue from '../components/buttons/ButtonBlue.vue';
import SuccessAlert from '../components/alerts/SuccessAlert.vue';
import { IArrowDown, IClose } from '../core/icons';
import { request } from '../composables/request.composable';
import handleError from '../composables/handle_error.composable';
import handleSuccess from '../composables/handle_success.composable';
import spinner from '../components/timer/Spinner.vue';
import { useEmployeeStore, useUserStore } from '../store/index';
import { stringValidate, numberValidate } from '../validations/validate';
import { storeItem, getItem } from '../core/utils/storage.helper';
import useVuelidate from '@vuelidate/core';
import { Occurence } from '../Enums/enum';

import { required, email, helpers } from '@vuelidate/validators';


// initialize router
const router=useRouter()

// props
const props = defineProps<{ employeeId: any, employeeAmount:number }>();

// initialize store
const employeeStore = useEmployeeStore();
const userStore = useUserStore();
// emits
const emit = defineEmits<{
  (e: 'close_deduction'): void;
  (e: 'payroll_init'): void;
  (e: 'save_deduction', deductionData: { amount: number; reason: string }): void; 

}>();

// variables
const loading = ref(false);
const showOccurence = ref(false);

const data:any = ref({
  amount: props.employeeAmount ?? 0,
  reason: '',
  type: Occurence.ONCE,
  end_date: '',
});

const showSuccess = ref(false);
const responseData = ref<any>();
const valid = ref(false);

const render = inject<any>('render');

// methods

const handleSubmit = () => {
  if (v$.value.$invalid) {
    return; 
  }
  
  emit('save_deduction', {
    amount: data.value.amount,
    reason: data.value.reason
  });
  console.log('Emitting Deduction Data:', {
    amount: data.value.amount,
    reason: data.value.reason,
  }); 


  emit('close_deduction');
};

// validations rule
const rules = computed(() => {
  return {
    amount: {
      required: helpers.withMessage('Email amount is required', required),
    },
    reason: {
      required: helpers.withMessage(' Reason is required', required),
    },
  };
});

const v$ = useVuelidate(rules as any, data);
</script>

<template>
  <div
    class="relative z-[99999]"
    aria-labelledby="modal-title"
    role="dialog"
    aria-modal="true"
  >
    <successAlert
      :showSuccess="showSuccess"
      @closeSuccess="showSuccess = false"
      v-if="showSuccess == true"
    >
      <template #otherMessage>CLOSE</template>
      {{ responseData.message }}</successAlert
    >
    <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>

    <div class="fixed inset-0 z-10 overflow-y-auto">
      <div
        class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
      >
        <div
          class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md"
        >
          <form
            @submit.prevent="handleSubmit"
            class="bg-white px-[37px] py-[27px] space-y-8"
          >
            <!-- content -->
            <header>
              <div class="flex items-start justify-between">
                <div>
                  <h3 class="text-black-rgba font-medium text-2xl">
                    Add Deduction
                  </h3>
                  <p class="text-sm font-semimedium text-black-rgba-100">
                    Deduction will be removed from employee salary
                  </p>
                </div>
                <div>
                  <button
                    v-on:click="$emit('close_deduction')"
                    class="bg-blue-lighter rounded-full top-12 right-12 p-3"
                  >
                    <IClose />
                  </button>
                </div>
              </div>
            </header>

            <!-- form -->
            <div class="space-y-6">
              <div
                class="font-normal text-left rounded-xl px-4 h-[48px] relative border border-grey-300"
              >
                <p
                  class="absolute -top-2 font-normal text-xs left-5 text-[#000000] bg-white"
                >
                  Amount
                </p>
                <div class="flex justify-between items-center h-full w-full">
                  <input
                    type="text"
                    required
                    v-model.number="data.amount"
                    placeholder="Deduction amount"
                    class="placeholder-strong rounded-lg w-full text-sm outline-none border-none h-full focus:outline-none focus:border-none"
                  />
                </div>
                <div v-if="v$.amount.$error" class="text-red-600 text-xs">
                  {{ '* ' + v$.amount.$errors[0].$message }}
                </div>
              </div>
              <!-- <div
                class="font-normal relative w-auto text-left rounded-xl px-4 h-[48px] text-gray-rgba-3 border text-black"
              >
                <div class="flex justify-between items-center h-full">
                  <input
                    @click="showOccurence = !showOccurence"
                    type="text"
                    v-model="data.type"
                    class="text-sm text-black w-full border-none outline-none focus:outline-none focus:border:none"
                    placeholder="Select type"
                  />

                  <span>
                    <IArrowDown @click="showOccurence = !showOccurence" />
                  </span>
                </div>
                <div
                  class="absolute z-50 h-56 right-0 shadow-lg scrollbar-hide overflow-auto top-15 w-full"
                  v-if="showOccurence == true"
                >
                  <div
                    class="space-y-5 p-6 shadow-rgba text-black bg-white text-sm font-bold rounded-lg"
                  >
                    <p
                      class="cursor-pointer"
                      v-for="occurenceType in Occurence"
                      :key="occurenceType"
                      @click="
                        [(data.type = occurenceType), (showOccurence = false)]
                      "
                    >
                      {{ occurenceType }}
                    </p>
                  </div>
                </div>
              </div> -->
            </div>

            <!--  -->

            <div class="space-y-8">
              <div
                v-if="data.type === Occurence.RECURRING"
                class="font-normal text-left rounded-xl pl-4 h-[48px] my-4 border text-gray-rgba-3 mb-1"
              >
                <input
                  type="date"
                  v-model="data.end_date"
                  class="rounded-lg placeholder-strong w-full pr-4 text-black text-sm outline-none border-none h-full focus:outline-none focus:border-none"
                  placeholder="End Date"
                />
              </div>

              <div>
                <textarea
                  v-model="data.reason"
                  required
                  class="w-full focus:outline-none outline-none py-3 font-normal border-grey-300 text-left rounded-xl px-4 h-[70px] border text-black"
                  placeholder="Reason"
                ></textarea>
              </div>
              <div v-if="v$.reason.$error" class="text-red-600 text-xs">
                {{ '* ' + v$.reason.$errors[0].$message }}
              </div>
              <!--  -->
            </div>

            <!--  -->

            <div class="flex pb-5">
              <ButtonBlue type="submit">
                <template #placeholder>
                  <spinner v-if="loading == true" />
                  <span v-else>Add Deduction</span>
                </template>
              </ButtonBlue>
            </div>

            <!-- end content -->
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
