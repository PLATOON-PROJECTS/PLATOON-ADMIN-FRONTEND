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
      <div class="pt-2">
        <h3 class="font-bold text-2xl">Pensions</h3>
      </div>
      <!-- buttons -->
      <div class="flex">
        <ButtonBlueOutline @click="router.push('/dashboard/pension/settings')">
          <template v-slot:placeholder> Pension Settings</template>
        </ButtonBlueOutline>
      </div>
    </div>
    <!-- cards -->
    <div v-if="!route.meta?.hidePensionCards" class="grid lg:grid-cols-3 gap-6">
      <router-link to="/dashboard/pension/existing">
        <Card
          :activeColor="
            isActiveRoute('dashboard.pension.existing')
              ? 'bg-[#003b3d] bg-eclipse-svg-blue'
              : 'bg-white'
          "
          :activeText="
            isActiveRoute('dashboard.pension.existing')
              ? 'text-white'
              : 'text-black-rgba-100'
          "
          :activeOtherInfoColor="
            isActiveRoute('dashboard.pension.existing')
              ? 'text-white'
              : 'text-black'
          "
          :activeIconBg="
            isActiveRoute('dashboard.pension.existing')
              ? 'bg-blue-light'
              : 'bg-grey-100'
          "
        >
          <template v-slot:title>Enrolled Employees</template>
          <template v-slot:text>Employees with pension</template>

          <template v-slot:other-informations>
            {{ enrolledData && enrolledData.length }}</template
          >
        </Card>
      </router-link>
      <router-link to="/dashboard/pension/excluded">
        <Card
          :activeText="
            isActiveRoute('dashboard.pension.excluded')
              ? 'text-white'
              : 'text-black-rgba-100'
          "
          :activeOtherInfoColor="
            isActiveRoute('dashboard.pension.excluded')
              ? 'text-white'
              : 'text-black'
          "
          :activeIconBg="
            isActiveRoute('dashboard.pension.excluded')
              ? 'bg-green-light'
              : 'bg-grey-100'
          "
          :activeColor="
            isActiveRoute('dashboard.pension.excluded')
              ? 'bg-green'
              : 'bg-white'
          "
        >
          <template v-slot:title>Excluded Employees</template>
          <template v-slot:text>Employees not on any plan </template>

          <template v-slot:other-informations>
            {{ excludedData && excludedData.length }}</template
          >
        </Card>
      </router-link>
      <router-link to="/dashboard/pension/history">
        <Card
          :activeColor="
            isActiveRoute('dashboard.pension.history') ? 'bg-black' : 'bg-white'
          "
          :activeText="
            isActiveRoute('dashboard.pension.history')
              ? 'text-white'
              : 'text-black-rgba-100'
          "
          :activeOtherInfoColor="
            isActiveRoute('dashboard.pension.history')
              ? 'text-white'
              : 'text-black'
          "
          :activeIconBg="
            isActiveRoute('dashboard.pension.history')
              ? 'bg-black-300'
              : 'bg-grey-100'
          "
        >
          <template v-slot:title> Pension History</template>
          <template v-slot:text>See all history</template>
          <template v-slot:other-informations>
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
