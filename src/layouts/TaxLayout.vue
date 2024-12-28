<script setup lang="ts">
import { ref } from "vue";
import Card from "../components/cards/Card.vue";
import ButtonBlueOutline from "../components/buttons/ButtonBlueOutline.vue";
import { isActiveRoute } from "../core/router";
import { useRouter, useRoute } from "vue-router";
import { request } from "../composables/request.composable";
import handleError from "../composables/handle_error.composable";
import handleSuccess from "../composables/handle_success.composable";
import { useTaxStore, useEmployeeStore } from "../store/index";
import cache from "../composables/swr_cache";

// initialize route and router
const router = useRouter();
const route = useRoute();
//initialize store

const taxStore = useTaxStore();
const employeeStore = useEmployeeStore();

// variables
const loading = ref(false);
const enrolledData = ref<any>([]);
const remittanceData = ref<any>([]);
const excludedData = ref<any>([]);
// methods
// const fetchEmployee = async () => {
//   loading.value = true;
//   const totalEmployeeCached = cache("total_employees");
//   if (typeof totalEmployeeCached !== "undefined") {
//     loading.value = false;

//     enrolledData.value.length = 0;
//     excludedData.value.length = 0;

//     totalEmployeeCached.forEach((data: any) => {
//       data.meta.tax
//         ? enrolledData.value.push(data)
//         : excludedData.value.push(data);
//     });
//   }

//   const response = await request(employeeStore.index(), loading);

//   const successResponse = handleSuccess(response);

//   if (successResponse && typeof successResponse !== "undefined") {
//     cache("total_employees", successResponse.data.data);

//     enrolledData.value.length = 0;
//     excludedData.value.length = 0;

//     successResponse.data.data.forEach((data: any) => {
//       data.meta.tax
//         ? enrolledData.value.push(data)
//         : excludedData.value.push(data);
//     });
//   }
// };
// fetchEmployee();
</script>
<template>
  <div :class="[route.meta?.showTaxCards ? 'space-y-6' : '', 'px-6 py-9']">
    <div
      v-if="route.meta?.showTaxCards"
      class="w-full flex justify-between lg:space-x-0 space-x-3 whitespace-nowrap overflow-auto scrollbar-hide"
    >
      <div class="pt-2">
        <h3 class="font-bold text-2xl">Tax & NHF</h3>
      </div>
      <!-- buttons -->
      <div class="flex items-center space-x-4">
        <ButtonBlueOutline
          @click="
            router.push(
              '/dashboard/tax-compliance/settings/edit-state-break-down'
            )
          "
        >
          <template v-slot:placeholder> Tax Settings</template>
        </ButtonBlueOutline>

        <button
          @click="
            router.push({ path: '/dashboard/tax-compliance/add-employee' })
          "
          class="bg-[#003b3d] text-white px-4+1 py-3 rounded-full text-sm"
        >
          + Add Employees
        </button>
      </div>
    </div>
    <!-- cards -->
    <div v-if="route.meta?.showTaxCards" class="grid lg:grid-cols-3 gap-6">
      <router-link
        :to="{ name: 'dashboard.tax-compliance.enrolled-employees' }"
      >
        <Card
          :activeColor="
            isActiveRoute('dashboard.tax-compliance.enrolled-employees')
              ? 'bg-[#003b3d] bg-eclipse-svg-blue'
              : 'bg-white'
          "
          :activeText="
            isActiveRoute('dashboard.tax-compliance.enrolled-employees')
              ? 'text-white'
              : 'text-black-rgba-100'
          "
          :activeOtherInfoColor="
            isActiveRoute('dashboard.tax-compliance.enrolled-employees')
              ? 'text-white'
              : 'text-black'
          "
          :activeIconBg="
            isActiveRoute('dashboard.tax-compliance.enrolled-employees')
              ? 'bg-blue-light'
              : 'bg-grey-100'
          "
        >
          <template v-slot:title>Enrolled Employees </template>
          <template v-slot:text>Employees with deductible taxes</template>

          <template v-slot:other-informations>
            {{ enrolledData ? enrolledData.length : 0 }}</template
          >
        </Card>
      </router-link>
      <router-link
        :to="{ name: 'dashboard.tax-compliance.excluded-employees' }"
      >
        <Card
          :activeText="
            isActiveRoute('dashboard.tax-compliance.excluded-employees')
              ? 'text-white'
              : 'text-black-rgba-100'
          "
          :activeOtherInfoColor="
            isActiveRoute('dashboard.tax-compliance.excluded-employees')
              ? 'text-white'
              : 'text-black'
          "
          :activeIconBg="
            isActiveRoute('dashboard.tax-compliance.excluded-employees')
              ? 'bg-green-light'
              : 'bg-grey-100'
          "
          :activeColor="
            isActiveRoute('dashboard.tax-compliance.excluded-employees')
              ? 'bg-green'
              : 'bg-white'
          "
        >
          <template v-slot:title>Excluded Employees</template>
          <template v-slot:text>Taxes not yet redeemed</template>

          <template v-slot:other-informations>
            {{ excludedData ? excludedData.length : 0 }}</template
          >
        </Card>
      </router-link>
      <router-link :to="{ name: 'dashboard.tax-compliance.history' }">
        <Card
          :activeColor="
            isActiveRoute('dashboard.tax-compliance.history')
              ? 'bg-black'
              : 'bg-white'
          "
          :activeText="
            isActiveRoute('dashboard.tax-compliance.history')
              ? 'text-white'
              : 'text-black-rgba-100'
          "
          :activeOtherInfoColor="
            isActiveRoute('dashboard.tax-compliance.history')
              ? 'text-white'
              : 'text-black'
          "
          :activeIconBg="
            isActiveRoute('dashboard.tax-compliance.history')
              ? 'bg-black-300'
              : 'bg-grey-100'
          "
        >
          <template v-slot:title>Remittance History</template>
          <template v-slot:text>See all history</template>
          <template v-slot:other-informations>
            N
            {{
              remittanceData && remittanceData.data
                ? remittanceData.data.length
                : 0
            }}
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
