<script setup lang="ts">
import ButtonBlue from "../components/buttons/ButtonBlue.vue";
import { FCheckBoxComp } from "../core/form";
import { IArrowDown, IClose, IArrowLeftTail } from "../core/icons";

const emit = defineEmits<{
  (e: "close"): void;
}>();
</script>

<template>
  <div class="relative z-[99999]" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>
    <div class="fixed inset-0 z-10 overflow-y-auto">
      <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div
          class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-5xl">
          <div class="bg-white px-[37px] py-[27px] space-y-8">
            <!-- content -->
            <header>
              <div class="flex items-start justify-between">
                <div class="flex items-start space-x-5-1">
                  <button v-on:click="$emit('close')">
                    <IArrowLeftTail />
                  </button>
                  <div>
                    <h3 class="text-black-rgba font-medium text-2xl">Add Employees</h3>
                    <p class="text-sm font-semimedium text-black-rgba-100">Select the employees you want to add to this
                      department</p>
                  </div>
                </div>
                <div>
                  <ButtonBlue>
                    <template v-slot:placeholder>Done</template>
                  </ButtonBlue>
                </div>
              </div>
            </header>

            <!-- table -->
            <div class="space-y-4">
              <div class="flex items-center space-x-3 pl-6">
                <FCheckBoxComp /> <span class="text-black-200 font-normal text-sm">Select All</span>
              </div>
              <div class="align-middle inline-block min-w-full">
                <div class="overflow-hidden sm:rounded-lg">
                  <table class="min-w-full table-fixed">
                    <thead class="text-black-200 text-sm text-left">
                      <tr>
                        <th scope="col" class="py-4 font-normal text-left flex items-center space-x-3 flex-shrink-0">
                          <div class="w-[22px]"></div>
                          <span> Name </span>
                        </th>
                        <th scope=" col" class="py-4 font-normal text-left">
                          Date added
                        </th>
                        <th scope="col" class="py-4 font-normal text-left">Grade</th>
                        <th scope="col" class="py-4 font-normal text-left">Type</th>
                        <th scope="col" class="py-4 font-normal text-left">Current Department</th>
                      </tr>
                    </thead>
                    <tbody class="bg-white">
                      <tr v-for="(i, index) in 10" :key="index" class="text-black-100">
                        <td class="py-4 w-[30%]">
                          <div class="flex items-center space-x-3 flex-shrink-0">
                            <FCheckBoxComp />
                            <div class="flex flex-col">
                              <span class="text-sm font-semimedium">Ighayere Ehondor Jemima</span>
                            </div>
                          </div>
                        </td>
                        <td class="py-4 whitespace-nowrap w-[20%]">
                          <div class="text-left flex flex-col">
                            <!-- <span class="text-sm font-semimedium">Jan 12, 2022 15:32</span> -->
                            <span class="text-sm font-semimedium">&nbsp;</span>
                          </div>
                        </td>
                        <td class="py-4 text-left whitespace-nowrap w-[10%]">
                          <div class="font-normal flex flex-col">
                            <span class="text-sm font-semimedium">L9</span>
                          </div>
                        </td>
                        <td class="py-4 whitespace-nowrap w-[10%]">
                          <div class="font-normal text-left flex flex-col">
                            <span class="text-sm font-semimedium">Full Time</span>
                          </div>
                        </td>
                        <td class="py-4 whitespace-nowrap w-[20%]">
                          <div class="font-normal text-left flex flex-col">
                            <span class="text-sm font-semimedium">-</span>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <!-- end content -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
