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
                <thead class="text-black-200 text-sm text-left">
                  <tr class="whitespace-nowrap">
                    <th
                      scope="col"
                      class="py-4 font-normal text-left items-center space-x-3"
                    >
                      <span> Company Name </span>
                    </th>
                    <th scope=" col" class="py-4 font-normal text-left">
                      Pension Number
                    </th>
                    <th scope="col" class="py-4 font-normal text-left">PFA</th>
                    <th scope="col" class="py-4 font-normal text-left">
                      Gross Salary
                    </th>
                    <th scope="col" class="py-4 font-normal text-left">
                      Total Pension
                    </th>
                    <th scope="col" class="py-4 font-normal text-left">
                      Status
                    </th>
                    <th scope="col" class="py-4 font-normal text-center">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-grey-200">
                  <tr
                    v-for="(row, index) in 5"
                    :key="index"
                    class="text-black-100"
                  >
                    <td class="py-4 whitespace-nowrap">
                      <div class="flex items-center space-x-3">
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
                    <td class="py-4 whitespace-nowrap">
                      <div class="text-left flex flex-col">
                        <span class="text-sm font-semimedium"
                          >PFA7678687123</span
                        >
                      </div>
                    </td>
                    <td class="py-4 whitespace-nowrap">
                      <div class="font-normal text-left flex flex-col">
                        <span class="text-sm font-semimedium"
                          >Stanbic IBTC Pension</span
                        >
                      </div>
                    </td>
                    <td class="py-4 whitespace-nowrap">
                      <div class="font-normal text-left flex flex-col">
                        <span class="text-sm font-semimedium">₦31,000</span>
                      </div>
                    </td>
                    <td class="py-4 text-left whitespace-nowrap">
                      <div class="font-normal flex flex-col">
                        <span class="text-sm font-semimedium">₦800</span>
                      </div>
                    </td>
                    <td class="py-4 text-left whitespace-nowrap">
                      <div class="flex flex-col">
                        <!-- <span class="text-sm font-semimedium">{{
                              item.narration
                            }}</span> -->
                        <span class="text-sm text-[#46A754] font-semimedium"
                          >Approved</span
                        >
                        <span class="text-xs text-[#626669A3]"
                          >Submitted: 12/10/2022 15:32</span
                        >
                      </div>
                    </td>

                    <td class="py-4 px-8 text-left whitespace-nowrap w-[18%]">
                      <div class="flex items-center gap-4 justify-between">
                        <button
                          @click=""
                          class="text-[#003b3d] bg-red-light text-sm text-bold px-4+1 py-2 rounded-full"
                        >
                          Download CSV
                        </button>
                        <button>
                          <IMenuVertical />
                        </button>
                      </div>
                    </td>
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
