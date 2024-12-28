<script setup lang="ts">
import {
  IIncDec,
  IMenuVertical,
  ITablePencil,
  IArrowLeftTail,
} from "../../../core/icons";
import ButtonBlueOutline from "../../../components/buttons/ButtonBlueOutline.vue";
import ButtonBlue from "../../../components/buttons/ButtonBlue.vue";
import ButtonLightBlue from "../../../components/buttons/ButtonLightBlue.vue";
// icons
</script>
<template>
  <div class="bg-white h-full rounded-t-lg py-6 space-y-5">
    <div class="px-5 py-2">
      <div class="space-y-6">
        <div
          class="flex justify-between overflow-auto scrollbar-hide lg:space-x-0 space-x-3"
        >
          <div class="flex space-x-5">
            <div class="pt-1">
              <IArrowLeftTail />
            </div>
            <div>
              <h3 class="font-bold text-2xl whitespace-nowrap">
                January Salary Payment
              </h3>
              <p class="text-sm pt-1 font-semimedium whitespace-nowrap">
                <span class="text-black-200">Payroll period: </span>
                <span>Apr 1 - Apr 30, 2022</span>
              </p>
            </div>
            <div class="pt-1 whitespace-nowrap">
              <button
                class="text-white bg-black-200 rounded-full font-medium text-sm px-4+1"
              >
                Draft
              </button>
            </div>
          </div>
          <div class="flex space-x-4 text-sm flex-shrink-0">
            <div>
              <ButtonBlue>
                <template v-slot:placeholder>Save & Continue</template>
              </ButtonBlue>
            </div>
            <div>
              <ButtonLightBlue textColor="text-blue">
                <template v-slot:placeholder>Save changes for later</template>
              </ButtonLightBlue>
            </div>
          </div>
        </div>
        <div class="flex space-x-2">
          <span class="text-sm pt-1 font-semimedium text-black-200"
            >Filter by Department</span
          >
          <span class="pt-2">
            <IIncDec />
          </span>
        </div>
      </div>
    </div>
    <div class="space-y-10 overflow-auto scrollbar-hide">
      <!-- table -->
      <div class="border-t border-grey">
        <div class="py-6">
          <div class="align-middle inline-block min-w-full">
            <div class="overflow-hidden sm:rounded-lg">
              <table class="min-w-full table-fixed">
                <thead class="text-black-200 text-sm text-left">
                  <tr>
                    <th
                      scope="col"
                      class="py-4 text-left flex items-center space-x-3 whitespace-nowrap"
                    >
                      <!-- <CheckBox customClasses="indeterminate-check" /> -->
                      <!-- <FCheckBoxComp /> -->
                      <span> Name </span>
                    </th>
                    <th scope=" col" class="py-4 text-left whitespace-nowrap">
                      Gross Pay
                    </th>
                    <th scope="col" class="py-4 text-left whitespace-nowrap">
                      Bonus
                    </th>
                    <th scope="col" class="py-4 text-left whitespace-nowrap">
                      Deductions
                    </th>
                    <th scope="col" class="py-4 text-left whitespace-nowrap">
                      Tax
                    </th>
                    <th scope="col" class="py-4 text-left whitespace-nowrap">
                      Net Pay
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-grey-200">
                  <tr
                    v-for="(i, index) in 10"
                    :key="index"
                    class="text-black-100"
                  >
                    <td class="py-4 whitespace-nowrap">
                      <div class="flex items-center space-x-3">
                        <!-- <FCheckBoxComp /> -->
                        <div class="flex flex-col">
                          <span class="text-sm font-semimedium"
                            >Ighayere Ehondor Jemima</span
                          >
                          <span class="text-xs text-gray-rgba-3"
                            >₦800,000/yr</span
                          >
                        </div>
                      </div>
                    </td>
                    <td class="py-4 whitespace-nowrap">
                      <div class="text-left flex flex-col">
                        <span class="text-sm font-semimedium">₦72,900</span>
                        <span class="text-xs text-gray-rgba-3">₦72,900</span>
                      </div>
                    </td>
                    <td class="py-4 whitespace-nowrap">
                      <div class="flex items-center space-x-2">
                        <ITablePencil />
                        <div class="font-normal text-left flex flex-col">
                          <span class="text-sm font-semimedium"
                            >08000000000</span
                          >
                          <span class="text-xs text-gray-rgba-3">Mobile</span>
                        </div>
                      </div>
                    </td>
                    <td class="py-4 flex whitespace-nowrap">
                      <div class="flex items-center space-x-2">
                        <ITablePencil />
                        <div class="font-normal text-left flex flex-col">
                          <span class="text-sm font-semimedium"
                            >Software Technology</span
                          >
                          <span class="text-xs text-gray-rgba-3"
                            >Information Technology</span
                          >
                        </div>
                      </div>
                    </td>
                    <td class="py-4 items-center text-left whitespace-nowrap">
                      <div class="flex items-center space-x-2">
                        <ITablePencil />
                        <div class="font-normal flex flex-col">
                          <span class="text-sm font-semimedium">₦13,500</span>
                          <span class="text-xs text-gray-rgba-3">LAGIT</span>
                        </div>
                      </div>
                    </td>
                    <td class="py-4 text-left whitespace-nowrap">
                      <div class="flex items-center space-x-2">
                        <ITablePencil />
                        <div class="flex w-full justify-between">
                          <div class="text-left flex flex-col">
                            <span class="text-sm font-semimedium">₦65,000</span>
                            <span class="text-xs text-gray-rgba-3"
                              >Direct deposit</span
                            >
                          </div>
                          <!-- <button>
                            <IMenuVertical />
                          </button> -->
                        </div>
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

      <!-- <div class="flex space-x-4 px-6">
        <ButtonBlueOutline>
          <template v-slot:placeholder>Back</template>
        </ButtonBlueOutline>
        <ButtonBlue>
          <template v-slot:placeholder>Save & Continue</template>
        </ButtonBlue>
        <ButtonLightBlue>
          <template v-slot:placeholder>Save changes for later</template>
        </ButtonLightBlue>
      </div> -->
    </div>
  </div>
</template>

<style></style>
