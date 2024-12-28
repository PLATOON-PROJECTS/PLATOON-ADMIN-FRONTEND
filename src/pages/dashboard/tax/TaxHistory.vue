<script lang="ts" setup>
import { FCheckBoxComp } from "../../../core/form";
import { ref } from "vue";
import { ICaretUpDown, IMenuVertical, IScales } from "../../../core/icons";
import CalenderInterface from "../../../layouts/CalenderLayout.vue";
import spinner from "../../../components/timer/Spinner.vue";
import EmptyState from "../../../components/EmptyState.vue";
import { useRouter } from "vue-router";
import { request } from "../../../composables/request.composable";
import handleError from "../../../composables/handle_error.composable";
import handleSuccess from "../../../composables/handle_success.composable";
import { useTaxStore } from "../../../store/index";
const router = useRouter();

// initialize store
const taxStore = useTaxStore();
// variables
const openCalender = ref(false);
const responseData = ref<any>();
const showSuccess = ref(false);
const loading = ref(false);
</script>
<template>
  <!-- Table -->
  <div
    class="bg-white rounded-t-lg divide-y divide-grey-200 overflow-auto scrollbar-hide w-full"
  >
    <successAlert
      :showSuccess="showSuccess"
      @closeSuccess="showSuccess = false"
      v-if="showSuccess == true"
    >
      <template #otherMessage>CLOSE</template>
      {{ responseData.message }}</successAlert
    >
    <spinner
      v-if="loading == true"
      class="flex justify-center items-center lg:h-[400px] h-[300px]"
    />
    <!--  -->
    <div v-else>
      <!--  -->
      <div class="flex items-center p-6 justify-between w-full">
        <div class="flex flex-col space-x-6 flex-shrink-0">
          <div class="mb-4">
            <p class="text-2xl font-medium">All history</p>
            <p class="text-sm font-medium text-[#626669A3]">
              Continue edit to complete process
            </p>
          </div>
          <!--  -->
          <!-- <div class="relative cursor-pointer">
            <div class="flex items-center space-x-2">
              <span
                class="text-sm text-black-200"
                @click="openCalender = !openCalender"
                >Sort by Date</span
              >
              <span>
                <ICaretUpDown />
              </span>
            </div>
            <CalenderInterface
              v-if="openCalender == true"
              class="absolute top-[30px] w-full"
            />
          </div> -->
          <!--  -->
          <div class="flex items-center space-x-2 cursor-pointer">
            <span class="text-sm text-black-200">Sort by Department</span>
            <span>
              <ICaretUpDown />
            </span>
          </div>
        </div>
      </div>
      <!--  -->
      <div class="py-6">
        <div class="align-middle inline-block min-w-full">
          <div class="overflow-hidden sm:rounded-lg">
            <table class="min-w-full table-fixed">
              <thead class="text-black-200 text-sm text-left">
                <tr class="whitespace-nowrap">
                  <th
                    scope="col"
                    class="py-4 font-normal text-left flex items-center space-x-3 flex-shrink-0"
                  >
                    <span> Month </span>
                  </th>
                  <th scope=" col" class="py-4 font-normal text-left">State</th>
                  <th scope="col" class="py-4 font-normal text-left">
                    Tax Type
                  </th>
                  <th scope="col" class="py-4 font-normal text-left">
                    Tax Value
                  </th>
                  <th scope="col" class="py-4 font-normal text-left">Tax ID</th>

                  <th scope="col" class="py-4 font-normal text-left">
                    Total Tax Paid
                  </th>
                  <th scope="col" class="py-4 font-normal text-left">Status</th>
                  <th scope="col" class="py-4 font-normal text-center">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-grey-200">
                <tr
                  v-for="(row, index) in 5"
                  :key="index"
                  class="text-black-100 whitespace-nowrap"
                >
                  <td class="py-4 w-[20%]">
                    <div class="flex items-center space-x-3 flex-shrink-0">
                      <div class="flex flex-col mt-3">
                        <span class="text-sm font-semimedium">January</span>
                      </div>
                    </div>
                  </td>
                  <td class="py-4 whitespace-nowrap w-[10%]">
                    <div class="text-left flex flex-col">
                      <span class="text-sm font-semimedium">Lagos</span>
                    </div>
                  </td>
                  <td class="py-4 whitespace-nowrap w-[10%]">
                    <div class="font-normal text-left flex flex-col">
                      <span class="text-sm font-semimedium">Paye</span>
                    </div>
                  </td>
                  <td class="py-4 whitespace-nowrap w-[10%]">
                    <div class="font-normal text-left flex flex-col">
                      <span class="text-sm font-semimedium">₦28,000</span>
                    </div>
                  </td>
                  <td class="py-4 whitespace-nowrap w-[10%]">
                    <div class="font-normal text-left flex flex-col">
                      <span class="text-sm font-semimedium">001</span>
                    </div>
                  </td>

                  <td class="py-4 text-left whitespace-nowrap w-[15%]">
                    <div class="font-normal flex flex-col">
                      <span class="text-sm font-semimedium">₦93,000</span>
                    </div>
                  </td>
                  <td class="py-4 text-left whitespace-nowrap w-[15%]">
                    <div class="font-normal flex flex-col mt-3">
                      <span class="text-sm text-[#003b3d] font-semimedium"
                        >Paid</span
                      >
                      <span class="text-xs text-[##626669A3] flex"
                        >Submitted: 12/10/2022 15:32</span
                      >
                    </div>
                  </td>
                  <router-link
                    :to="{ name: 'dashboard.tax-compliance.tax-history' }"
                  >
                    <td class="py-4 text-center whitespace-nowrap w-[15%]">
                      <button
                        class="inline-block bg-[#F0F2F2] text-[#306651] text-xs font-medium py-2 px-4 rounded-full"
                      >
                        view
                      </button>
                    </td>
                  </router-link>
                </tr>
              </tbody>
              <!-- empty state below -->
              <!-- <tbody class="w-full flex justify-center">
                <tr class="w-full no-hover">
                  <EmptyState>
                    <template #icon>
                      <IScales />
                    </template>
                    <template #heading>Remmitance History </template>
                    <template #desc>
                      When you make any tax remittance, all data will be
                      displayed here
                    </template>
                  </EmptyState>
                </tr>
              </tbody> -->
            </table>
          </div>
        </div>
        <!-- Pagination -->

        <div
          v-if="responseData && responseData.data[0]"
          class="px-6 mt-8 hidden items-center justify-between whitespace-nowrap lg:space-x-0 space-x-3"
        >
          <span class="opacity-50 text-sm font-semimedium"
            >Showing 1-6 of 30 items</span
          >

          <div class="flex items-center space-x-2">
            <span
              class="text-white bg-[#003b3d] text-sm font-semibold w-8 h-8 flex items-center justify-center rounded-full"
              >1</span
            >
            <span
              class="text-sm w-8 h-8 flex items-center justify-center rounded-full border opacity-50"
              >2</span
            >
            <span
              class="text-sm w-8 h-8 flex items-center justify-center rounded-full border opacity-50"
              >3</span
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped></style>
