<script lang="ts" setup>
import ButtonLightBlue from "../../../components/buttons/ButtonLightBlue.vue";
import ButtonBlue from "../../../components/buttons/ButtonBlue.vue";
import FCheckedComponent from "../../../components/forms/FCheckBox.vue";
import { useRouter } from "vue-router";

const router = useRouter()
</script>

<template>
  <div class="px-6 py-10">
    <div class="space-y-6">
      <!--  -->
      <div class="w-full flex justify-between">
        <div class="pt-2">
          <h3 class="font-bold text-xl">Pensions</h3>
        </div>
        <div class="flex">
          <ButtonBlue @click="router.push('/dashboard/pension/existing')">
            <template v-slot:placeholder>Continue</template>
          </ButtonBlue>
        </div>
      </div>
      <!--  -->
      <div class="grid lg:grid-cols-3 grid-cols-1 lg:space-x-4">
        <div class="bg-white h-full rounded-lg py-6 px-6 space-y-5">
          <form class="space-y-10">
            <div class="space-y-1">
              <p class="text-base font-medium">Select pension</p>
              <p class="text-sm font-medium text-gray-rgba-4">
                Please select a pension type and click proceed.
              </p>
            </div>

            <div class="space-y-4">
              <div class="flex space-x-4">
                <FCheckedComponent class="mt-1" />
                <div class="flex-col flex">
                  <span class="text-black-rgba font-medium text-base">8% employee deduction</span>
                  <span class="text-xs text-gray-rgba-3">Monthly deductions</span>
                </div>
              </div>
              <!--  -->
              <div class="flex space-x-4">
                <FCheckedComponent class="mt-1" />
                <div class="flex-col flex">
                  <span class="text-black-rgba font-medium text-base">25% employee deduction</span>
                  <span class="text-xs text-gray-rgba-3">Monthly deductions</span>
                </div>
              </div>
              <!--  -->
              <!--  -->
              <div class="flex space-x-4">
                <FCheckedComponent class="mt-1" />
                <div class="flex-col flex">
                  <span class="text-black-rgba font-medium text-base">50% employee deduction</span>
                  <span class="text-xs text-gray-rgba-3">Monthly deductions</span>
                </div>
              </div>
              <!--  -->
            </div>
          </form>
        </div>
        <div class="bg-white h-full col-span-2 rounded-lg py-6 px-6 space-y-5">
          <div class="lg:w-[78%]">
            <div class="">
              <div class="lg:w-[80%]">
                <p class="text-base font-medium">Configure salary breakdown</p>
                <p class="text-sm text-gray-rgba-3">
                  This allows you to breakdown your employees salaries (e.g
                  basic, housing, transport, etc). You can add custom items too.
                </p>
              </div>
            </div>
            <div class="space-y-8">
              <div class="grid sm:grid-cols-2 pt-7 gap-4">
                <div class="relative">
                  <input type="text" id="Name" maxlength="55" class="input-float peer pr-10.5" placeholder="" />
                  <label for="Name"
                    class="input-float-label text-gray-rgba-3 font-semimedium peer-focus:text-black-100 peer-placeholder-shown:scale-75 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:px-2">
                    Item</label>
                </div>

                <div
                  class="font-normal items-center text-left rounded-xl px-2 py-3 border text-gray-rgba-3 flex justify-between">
                  <input type="text"
                    class="rounded-lg text-sm outline-none border-none focus:outline-none focus:border-none"
                    placeholder="0.0" />
                  <span>%</span>
                </div>
                <div class="relative">
                  <input type="text" id="Name2" maxlength="55" class="input-float peer pr-10.5" placeholder="" />
                  <label for="Name3"
                    class="input-float-label text-gray-rgba-3 font-semimedium peer-focus:text-black-100 peer-placeholder-shown:scale-75 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:px-2">
                    Item</label>
                </div>
                <div
                  class="cursor-pointer font-normal items-center text-left py-3 rounded-xl px-2 border text-gray-rgba-3 flex justify-between">
                  <input type="text"
                    class="rounded-lg text-sm outline-none border-none focus:outline-none focus:border-none"
                    placeholder="0.0" />
                  <span>%</span>
                </div>
                <div class="relative">
                  <input type="text" id="Nam" maxlength="55" class="input-float peer pr-10.5" placeholder="" />
                </div>
                <div
                  class="cursor-pointer font-normal items-center text-left py-3 rounded-xl px-2 border text-gray-rgba-3 flex justify-between">
                  <input type="text"
                    class="rounded-lg text-sm outline-none border-none focus:outline-none focus:border-none"
                    placeholder="0.0" />
                  <span>%</span>
                </div>
              </div>
              <!--  -->
              <div class="flex">
                <ButtonLightBlue>
                  <template v-slot:placeholder>+ Add new item</template>
                </ButtonLightBlue>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
