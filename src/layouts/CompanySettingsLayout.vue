<script setup lang="ts">
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import spinner from "../components/timer/Spinner.vue";
import { IArrowLeftTail } from "../core/icons";

import ButtonBlue from "../components/buttons/ButtonBlue.vue";

const childComponent = ref<any>();
// initialize router and route
const route = useRoute();
const router = useRouter();
// variables
const loading = ref(false);

// emits
const emit = defineEmits<{ (e: "fetchCompanies"): void }>();
// methods
const save = () => {
  childComponent.value.saveChanges().then(() => {
    emit("fetchCompanies");
  });
};
</script>

<template>
  <div class="px-6 py-9">
    <div>
      <div class="space-y-6">
        <div
          class="bg-white py-6 h-[10rem] px-4 rounded-t-lg items-center text-black-200 cursor-pointer text-sm justify-between flex space-x-8 whitespace-nowrap overflow-auto scrollbar-hide"
        >
          <div class="flex flex-col">
            <div class="flex items-start space-x-5-1">
              <button @click="router.back()">
                <IArrowLeftTail />
              </button>
              <div>
                <h3
                  class="text-black-rgba font-medium lg:text-2xl text-lg whitespace-nowrap"
                >
                  Company Name
                </h3>
                <span class="text-sm text-gray-rgba-3">Manage Company</span>
              </div>
            </div>
            <div class="w-full flex space-x-6 border-b border-grey pt-7">
              <span
                @click="
                  router.push({
                    path: '/dashboard/company-settings/company-information',
                  })
                "
                :class="
                  '/dashboard/company-settings/company-information' ===
                    route.path &&
                  'border-b-2 border-[#003b3d] h-full pb-7 text-[#003b3d] font-semimedium'
                "
                class="font-normal"
                >Company Information</span
              >

              <span
                @click="
                  router.push({
                    path: '/dashboard/company-settings/contact-information',
                  })
                "
                :class="
                  '/dashboard/company-settings/contact-information' ===
                    route.path &&
                  'border-b-2 border-blue h-full pb-7 text-blue font-semimedium'
                "
                class="font-normal"
                >Contact Information
              </span>

              <span
                @click="
                  router.push({
                    path: '/dashboard/company-settings/payroll-history',
                  })
                "
                :class="
                  '/dashboard/company-settings/payroll-history' ===
                    route.path &&
                  'border-b-2 border-blue h-full pb-7 text-blue font-semimedium'
                "
                class="font-normal"
                >Payroll History
              </span>
              <span
                @click="
                  router.push({
                    path: '/dashboard/company-settings/employees-logs',
                  })
                "
                :class="
                  '/dashboard/company-settings/employees-logs' === route.path &&
                  'border-b-2 border-blue h-full pb-7 text-blue font-semimedium'
                "
                class="font-normal"
                >Employees
              </span>
              <span
                @click="
                  router.push({
                    path: '/dashboard/company-settings/delete',
                  })
                "
                :class="
                  '/dashboard/company-settings/delete' === route.path &&
                  'border-b-2 border-[#003b3d] h-full pb-7 text-[#003b3d] font-semimedium'
                "
                class="font-normal"
                >Delete Company
              </span>
            </div>
          </div>
          <div
            class="flex"
            v-if="
              '/dashboard/company-settings/company-information' ===
                route.path ||
              '/dashboard/company-settings/contact-information' === route.path
            "
          >
            <div class="flex gap-4">
              <ButtonBlue
                @click="save"
                :disabled="childComponent?.disabled"
                :style="{ backgroundColor: '#FFB400', color: '#fff' }"
              >
                <template v-slot:placeholder>
                  <spinner v-if="loading == true" />
                  <span v-else>Suspend</span>
                </template>
              </ButtonBlue>

              <ButtonBlue
                @click="save"
                :disabled="childComponent?.disabled"
                class="bg-[#FF4C51] text-white hover:bg-red-600 disabled:bg-gray-300"
              >
                <template v-slot:placeholder>
                  <spinner v-if="loading == true" />
                  <span v-else>Delete</span>
                </template>
              </ButtonBlue>
            </div>
          </div>
        </div>
      </div>
      <!-- end of cards -->

      <router-view
        v-slot="{ Component }"
        class="bg-white py-6 min-h-[80vh] h-auto"
      >
        <component
          ref="childComponent"
          :is="Component"
          @loadingTrue="loading = true"
          @loadingFalse="loading = false"
        />
      </router-view>
    </div>
  </div>
</template>
