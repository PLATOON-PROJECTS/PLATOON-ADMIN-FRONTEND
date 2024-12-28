<script setup lang="ts">
import { ref } from "vue";
import ButtonBlue from "../../../components/buttons/ButtonBlue.vue";
import ButtonLightBlue from "../../../components/buttons/ButtonLightBlue.vue";
import ButtonColorless from "../../../components/buttons/ButtonColorless.vue";
// icons
import {
  IIncDec,
  IArrowDown,
  IMenuVertical,
  IUserThree,
} from "../../../core/icons";
import EmptyState from "../../../components/EmptyState.vue";

// variables
const isTableEmpty = ref(true);
</script>
<template>
  <div class="bg-white h-full rounded-lg py-6 space-y-5">
    <div class="space-y-6 px-5">
      <div>
        <h3 class="font-bold text-xl">All history</h3>
        <p class="text-sm pt-1 font-semimedium">
          <span class="text-black-200">Continue edit to complete process</span>
        </p>
      </div>

      <div
        class="py-2 flex justify-between whitespace-nowrap scrollbar-hide overflow-auto"
      >
        <div class="flex space-x-5">
          <div class="flex space-x-2">
            <span class="text-sm pt-1 font-semimedium text-black-200"
              >Sort by Pension Manager</span
            >
            <span class="pt-2">
              <IIncDec />
            </span>
          </div>
          <!--  -->
          <div class="flex space-x-2">
            <span class="text-sm pt-1 font-semimedium text-black-200"
              >Sort by Department</span
            >
            <span class="pt-2">
              <IIncDec />
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="space-y-10 scrollbar-hide overflow-auto">
      <!-- table -->
      <div class="border-t border-grey">
        <div class="py-6">
          <div class="align-middle inline-block min-w-full">
            <div class="overflow-hidden sm:rounded-lg">
              <table class="min-w-full table-fixed">
                <thead
                  v-if="isTableEmpty == false"
                  class="text-black-200 text-sm text-left"
                >
                  <tr class="whitespace-nowrap">
                    <th
                      scope="col"
                      class="py-4 text-left flex items-center space-x-3"
                    >
                      <!-- <CheckBox customClasses="indeterminate-check" /> -->
                      <span> Name </span>
                    </th>
                    <th scope=" col" class="py-4 text-left">
                      Employee Contribution
                    </th>
                    <th scope="col" class="py-4 text-left">
                      Employer Contribution
                    </th>
                    <th scope="col" class="py-4 text-left">
                      Voluntary Contribution
                    </th>
                    <th scope="col" class="py-4 text-left">Total Pension</th>
                    <th scope="col" class="py-4 text-left">Action</th>
                  </tr>
                </thead>
                <tbody
                  v-if="isTableEmpty == false"
                  class="bg-white divide-y divide-grey-200"
                >
                  <tr
                    v-for="(i, index) in 5"
                    :key="index"
                    class="text-black-100 whitespace-nowrap"
                  >
                    <td class="py-4">
                      <div class="">
                        <div class="flex flex-col">
                          <span class="text-sm font-semimedium"
                            >Ighayere Ehondor Jemima</span
                          >
                          <span class="text-xs text-gray-rgba-3"
                            >Software Engineering</span
                          >
                        </div>
                      </div>
                    </td>
                    <td class="py-4">
                      <div class="text-left flex flex-col">
                        <span class="text-sm font-semimedium"
                          >PFA7678687123</span
                        >
                        <span class="text-xs text-gray-rgba-3"
                          >Stanbic IBTC Pension ...
                        </span>
                      </div>
                    </td>
                    <td class="whitespace-nowrap">
                      <div class="font-normal text-left flex mb-4">
                        <span class="text-sm font-semimedium">₦31,000</span>
                      </div>
                    </td>
                    <td class="whitespace-nowrap">
                      <div class="font-normal text-left mb-4">
                        <span class="text-sm font-semimedium">₦34,000</span>
                      </div>
                    </td>
                    <td class="text-left whitespace-nowrap">
                      <div class="font-normal mb-4">
                        <span class="text-sm font-semimedium">₦13,500</span>
                      </div>
                    </td>
                    <td class="text-left whitespace-nowrap">
                      <div class="flex items-center space-x-2 mb-4">
                        <div class="flex w-full justify-between">
                          <div class="text-left">
                              <ButtonLightBlue>
                                <template v-slot:placeholder>
                                  Download CSV</template
                                >
                              </ButtonLightBlue>
                          </div>
                          <!-- <button>
                            <IMenuVertical />
                          </button> -->
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
                <!-- empty state below -->
                <tbody v-else class="w-full">
                  <tr class="w-full no-hover">
                    <EmptyState>
                      <template #icon>
                        <IUserThree />
                      </template>
                      <template #heading> Pension History</template>
                      <template #desc>
                        All history for pension will be displayed here. Click on
                        the “add pension” <br />
                        to begin you first pension history
                      </template>
                      <template #actions>
                        <button
                          class="bg-blue text-white px-4+1 py-2.5+1 rounded-full text-sm"
                        >
                          + add pension
                        </button>
                      </template>
                    </EmptyState>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <!-- end of table -->
      <div
        class="hidden justify-between items-center whitespace-nowrap lg:space-x-0 space-x-3 px-6 text-sm text-gray-rgba-3"
      >
        <span> Showing 1-6 of 30 items</span>
        <div class="flex space-x-3">
          <ButtonBlue>
            <template v-slot:placeholder>1</template>
          </ButtonBlue>
          <ButtonColorless>
            <template v-slot:placeholder>2</template>
          </ButtonColorless>
          <ButtonColorless>
            <template v-slot:placeholder>3</template>
          </ButtonColorless>
        </div>
      </div>
    </div>
  </div>
</template>

<style></style>
