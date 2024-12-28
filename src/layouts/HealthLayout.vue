<script setup lang="ts">
import { ref } from "vue";
import ButtonBlueOutline from "../components/buttons/ButtonBlueOutline.vue";
import Card from "../components/cards/Card.vue";
import { isActiveRoute } from "../core/router";
import { useRouter, useRoute } from "vue-router";
import { usePensionStore, useEmployeeStore } from "../store/index";
import { request } from "../composables/request.composable";
import handleError from "../composables/handle_error.composable";
import handleSuccess from "../composables/handle_success.composable";
import cache from "../composables/swr_cache";

// initialize router and route
const router = useRouter();
const route = useRoute();

//initialize store

const taxStore = usePensionStore();
const employeeStore = useEmployeeStore();

// variables
const loading = ref(false);
const enrolledData = ref<any>([]);
const remittanceData = ref<any>([]);
const excludedData = ref<any>([]);

// methods
// const fetchEmployee = async () => {
//   const totalExcludedPensionCache = cache("total_excluded_pension");
//   const totalEnrolledPensionCache = cache("total_enrolled_pension");

//   if (typeof totalExcludedPensionCache !== "undefined") {
//     excludedData.value = totalExcludedPensionCache;
//   }
//   if (typeof totalEnrolledPensionCache !== "undefined") {
//     enrolledData.value = totalEnrolledPensionCache;
//   }

//   const response = await request(employeeStore.index(), loading);

//   const successResponse = handleSuccess(response);

//   if (successResponse && typeof successResponse !== "undefined") {
//     // console.log(successResponse);
//     enrolledData.value.length = 0;
//     excludedData.value.length = 0;
//     successResponse.data.data.forEach((data: any) => {
//       data.meta.pension
//         ? enrolledData.value.push(data)
//         : excludedData.value.push(data);
//     });
//     cache("total_enrolled_pension", enrolledData.value);
//     cache("total_excluded_pension", excludedData.value);
//   }
// };

const isOpen = ref(false);
const selectedOption = ref<{ name: string; location: string } | null>(null);

const options = [
  { name: "Ernst & Young", location: "Lagos, Nigeria" },
  { name: "Deloitte West Africa", location: "Accra, Ghana" },
];

function toggleDropdown() {
  isOpen.value = !isOpen.value;
}

function selectOption(option: { name: string; location: string }) {
  selectedOption.value = option;
  isOpen.value = false;
}
// fetchEmployee();
</script>
<template>
  <div
    :class="[!route.meta?.hidePensionCards ? 'space-y-6' : '', 'px-6 py-9 ']"
  >
    <div
      v-if="!route.meta?.hidePensionCards"
      class="w-full flex justify-between"
    >
      <div class="pt-2 flex gap-4 items-center">
        <div>
          <h3 class="font-bold text-2xl">Health</h3>
        </div>

        <div class="relative w-64">
          <button
            @click="toggleDropdown"
            class="w-full bg-gray-200 text-left px-4 py-2 rounded-lg border border-[#626669A3] flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <span>{{ selectedOption?.name || "Ernst & Young" }}</span>
            <svg
              :class="isOpen ? 'transform rotate-180' : ''"
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 text-gray-500 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          <div
            v-if="isOpen"
            class="absolute z-10 bg-white mt-2 w-full rounded-lg shadow-md px-8 max-h-40 overflow-auto"
          >
            <div
              v-for="(option, index) in options"
              :key="index"
              @click="selectOption(option)"
              :class="[
                'px-4 py-3 cursor-pointer hover:bg-gray-100 text-sm',
                selectedOption?.name === option.name
                  ? 'text-[#306651] bg-white'
                  : '',
                index > 0 ? 'border-t border-[#62666929]' : '',
              ]"
            >
              <div class="font-normal">{{ option.name }}</div>
              <div
                class="text-sm"
                :class="
                  selectedOption?.name === option.name
                    ? 'text-[#222222AD]'
                    : 'text-[#222222AD]'
                "
              >
                {{ option.location }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- buttons -->
      <!-- <div class="flex">
        <ButtonBlueOutline @click="router.push('/dashboard/pension/settings')">
          <template v-slot:placeholder> Pension Settings</template>
        </ButtonBlueOutline>
      </div> -->
    </div>
    <!-- cards -->
    <div v-if="!route.meta?.hidePensionCards" class="grid lg:grid-cols-3 gap-6">
      <router-link to="/dashboard/health/existing">
        <Card
          :activeColor="
            isActiveRoute('dashboard.health.existing')
              ? 'bg-[#003b3d] bg-eclipse-svg-blue'
              : 'bg-white'
          "
          :activeText="
            isActiveRoute('dashboard.health.existing')
              ? 'text-white'
              : 'text-black-rgba-100'
          "
          :activeOtherInfoColor="
            isActiveRoute('dashboard.health.existing')
              ? 'text-white'
              : 'text-black'
          "
          :activeIconBg="
            isActiveRoute('dashboard.health.existing')
              ? 'bg-blue-light'
              : 'bg-grey-100'
          "
        >
          <template v-slot:title>Enrolled Employees</template>
          <template v-slot:text>All enrolled employees</template>

          <template v-slot:other-informations>
            {{ enrolledData && enrolledData.length }}</template
          >
        </Card>
      </router-link>
      <router-link to="/dashboard/health/excluded">
        <Card
          :activeText="
            isActiveRoute('dashboard.health.excluded')
              ? 'text-white'
              : 'text-black-rgba-100'
          "
          :activeOtherInfoColor="
            isActiveRoute('dashboard.health.excluded')
              ? 'text-white'
              : 'text-black'
          "
          :activeIconBg="
            isActiveRoute('dashboard.health.excluded')
              ? 'bg-green-light'
              : 'bg-grey-100'
          "
          :activeColor="
            isActiveRoute('dashboard.health.excluded') ? 'bg-green' : 'bg-white'
          "
        >
          <template v-slot:title>Excluded Employees</template>
          <template v-slot:text>All excluded employees </template>

          <template v-slot:other-informations>
            {{ excludedData && excludedData.length }}</template
          >
        </Card>
      </router-link>
      <router-link to="">
        <Card
          :activeColor="
            isActiveRoute('dashboard.health.history')
              ? 'bg-[#2F80ED]'
              : 'bg-white'
          "
          :activeText="
            isActiveRoute('dashboard.health.history')
              ? 'text-white'
              : 'text-black-rgba-100'
          "
          :activeOtherInfoColor="
            isActiveRoute('dashboard.health.history')
              ? 'text-white'
              : 'text-black'
          "
          :activeIconBg="
            isActiveRoute('dashboard.health.history')
              ? 'bg-black-300'
              : 'bg-grey-100'
          "
        >
          <template v-slot:title> Active Plans</template>
          <template v-slot:text>Health plans</template>
          <template v-slot:other-informations>
            AXA Mansard, Reliance
            <div class="flex">
              <ButtonLightBlue>
                <template v-slot:placeholder> Download CSV</template>
              </ButtonLightBlue>
            </div>
          </template>
        </Card>
      </router-link>
    </div>
    <!-- end of cards -->

    <main>
      <router-view></router-view>
    </main>
  </div>
</template>

<style></style>
