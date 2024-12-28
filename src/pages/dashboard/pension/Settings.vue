<script setup lang="ts">
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { IArrowLeftTail } from "../../../core/icons";

// initialize router and route
const route = useRoute();
const router = useRouter();
// variables
const showEdit = ref(true);
// methods
</script>

<template>
  <div class="px-6 py-10 space-y-6">
    <div class="bg-white h-full rounded-lg border-b border-grey px-5 py-6 space-y-5">
      <div
        class="flex items-center justify-between scrollbar-hide overflow-auto whitespace-nowrap lg:space-x-0 space-x-3">
        <div class="flex space-x-5-1">
          <div class="pt-1">
            <button @click="router.back()">
              <IArrowLeftTail />
            </button>
          </div>

          <div class="flex flex-col">
            <h3 class="text-black-rgba font-medium text-xl lg:text-2xl">
              Pensions Settings
            </h3>
            <span class="text-sm text-gray-rgba-3">Manage settings</span>
          </div>
        </div>

        <div>
          <button class="bg-[#003b3d] text-white px-4+1 py-2.5+1 rounded-full text-sm">
            + Add New Account
          </button>
        </div>
      </div>
      <!--  -->
      <div
        class="border-b border-grey text-black-200 whitespace-nowrap scrollbar-hide overflow-auto font-semimedium cursor-pointer text-sm flex space-x-8">
        <span @click="
          router.push({
            path: '/dashboard/pension/settings/edit-salary',
          })
        " :class="
  '/dashboard/pension/settings/edit-salary' === route.path &&
  'border-b-2 border-[#003b3d] h-full pb-7 text-[#003b3d] font-semimedium'
" class="font-normal">Edit Salary Breakdown</span>

        <span @click="
          router.push({
            path: '/dashboard/pension/settings/disable-pension',
          })
        " :class="
  '/dashboard/pension/settings/disable-pension' === route.path &&
  'border-b-2 border-[#003b3d] h-full pb-7 text-[#003b3d] font-semimedium'
        " class="font-normal">Disable Pension
        </span>
      </div>
      <!--  -->
      <router-view></router-view>
    </div>
  </div>
</template>
<style scoped>

</style>
