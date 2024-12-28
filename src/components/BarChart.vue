<script setup lang="ts">
import { ref } from "vue";
import { BarChart } from "vue-chart-3";
import { IIncDec } from "../core/icons";
import cache from "../composables/swr_cache";
import handleError from "../composables/handle_error.composable";
import handleSuccess from "../composables/handle_success.composable";
import { request } from "../composables/request.composable";

import {
  useWalletStore,
  useEmployeeStore,
  useUserStore,
  useAuthStore,
} from "../store/index";


import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

// variables
const  showQuery=ref(false)
const queries= ref({
  data: {
    history: []
  }
});
const selectedQuery=ref("");
const walletStore = useWalletStore();
const responseData = ref<any>({ data: {}, message: "" });
const d = new Date();
let year = d.getFullYear();


const dashboardData = async () => {
  const dashboard = cache("dashboard");

  if (typeof dashboard !== "undefined") {
    responseData.value.data = dashboard;
  }

  queries.value = await request(walletStore.getChartYears() ?? ['Empty'])
  const response = await request(walletStore.getChartDetail(year));

  const successResponse = handleSuccess(response);
  if (successResponse && typeof successResponse !== "undefined") {
    // console.log(successResponse.data.data);
    cache("wallet", successResponse.data.data);
    responseData.value.data = successResponse.data.data;
    // console.log(responseData.value.data);
    // console.log('bar')
    walletStore.initChart(responseData.value.data?.payrolls);
  }
};

const updateDashboardData = async (selectedYear:number) => {
  const dashboard = cache("dashboard");

  if (typeof dashboard !== "undefined") {
    responseData.value.data = dashboard;
  }

  const response = await request(walletStore.getChartDetail(selectedYear));

  const successResponse = handleSuccess(response);
  if (successResponse && typeof successResponse !== "undefined") {
    // console.log(successResponse.data.data);
    cache("wallet", successResponse.data.data);
    responseData.value.data = successResponse.data.data;
    // console.log(responseData.value.data);
    // console.log('bar')
    walletStore.updateChart(responseData.value.data?.payrolls);
  }
};

// dashboardData();
</script>
<template>
  <!-- chart -->
  <div
    class="w-full px-6 py-6 space-y-6 whitespace-nowrap overflow-auto scrollbar-hide"
  >
    <div class="space-y-1">
      <h2 class="text-base text-black-100 font-medium">Payment History</h2>
      <p class="text-sm font-normal text-black-100 opacity-80">
        Showing results for last 12 months
      </p>
    </div>
    <!-- chart -->
    <div class="h-[22rem] sm:w-full w-[100vh]">
             <div class="relative w-20 pb-2">
          <div class="flex space-x-2">
            <span
              @click="showQuery = !showQuery"
              class="text-sm pt-1 font-semimedium text-black-200 whitespace-nowrap cursor-pointer"
            >
              {{
                selectedQuery === "" ? "Sort by " : selectedQuery
              }}</span
            >
            <span class="pt-2">
              <IIncDec class="cursor-pointer" @click="showQuery = !showQuery" />
            </span>
          </div>
        <!--  -->
        <div v-if="showQuery==true" class=" p-3 absolute z-50 max-h-56  bg-white shadow-lg scrollbar-hide overflow-auto  text-xs font-bold  w-auto ">
          <p v-for="query in queries.data.history" class="cursor-pointer" @click="[(selectedQuery=query,showQuery=false, updateDashboardData(query))]" :key="query">{{ query }}</p>
        </div>
      </div>
      <BarChart :chartData="walletStore.chartData" :options="walletStore.chartOptions" class="h-full w-full" />
    </div>
  </div>
</template>
