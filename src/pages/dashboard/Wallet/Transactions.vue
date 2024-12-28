<script setup lang="ts">
import { ref } from "vue";
import EmptyState from "../../../components/EmptyState.vue";
import SuccessAlert from "../../../components/alerts/SuccessAlert.vue";
import { request } from "../../../composables/request.composable";
import handleError from "../../../composables/handle_error.composable";
import handleSuccess from "../../../composables/handle_success.composable";
import spinner from "../../../components/timer/Spinner.vue";
import { useWalletStore, useUserStore } from "../../../store/index";
import { useRouter } from "vue-router";
import cache from "../../../composables/swr_cache";
import {
  IMinusCircle,
  IDoubleMark,
  IArrowLeftTail,
  ICaretUpDown,
  IWallet,
} from "../../../core/icons";

// initialize router
const router = useRouter();

// initialize store
const walletStore = useWalletStore();
const userStore = useUserStore();

// variables
const loading = ref(false);
const history = ref<any[]>([]);

const showSuccess = ref(false);
const responseData = ref<any>({ message: "Action successful" });

const fetchTransactions = async () => {
  loading.value = true;
  const walletCached = cache("transaction");

  if (typeof walletCached !== "undefined") {
    loading.value = false;
    history.value = walletCached;
  }
  const response = await request(walletStore.getWalletHistory(), loading);

  handleError(response, userStore);
  const successResponse = handleSuccess(response);

  if (successResponse && typeof successResponse !== "undefined") {
    cache("transaction", successResponse.data.data);
    history.value = successResponse.data.data;
    // console.log(successResponse);
  }
};
fetchTransactions();
</script>
<template>
  <div>
    <!-- Table -->

    <div class="bg-white rounded-t-lg divide-y divide-grey-200">
      <!--  -->
      <div class="flex items-center space-x-6 p-6">
        <h2 class="font-medium text-base">Transaction History</h2>
      </div>
      <!--  -->

      <spinner
        v-if="loading == true"
        class="flex justify-center items-center lg:h-[400px] h-[300px]"
      />
      <div v-else class="py-6 scrollbar-hide overflow-auto">
        <table class="w-full">
          <thead v-if="history[0]" class="text-black-200 text-sm text-left">
            <tr class="whitespace-nowrap">
              <th scope="col" class="py-4 font-normal text-left">Amount</th>
              <th scope="col" class="py-4 font-normal text-left text-sm">
                Date added
              </th>
              <th scope="col" class="py-4 font-normal text-left text-sm">
                Status
              </th>
              <th scope="col" class="py-4 font-normal text-left text-sm">
                Reference
              </th>
              <th scope="col" class="py-4 font-normal text-left text-sm">
                Currency
              </th>
              <th scope="col" class="py-4 font-normal text-left text-sm">
                Type
              </th>
            </tr>
          </thead>
          <tbody v-if="history[0]" class="bg-white divide-y divide-grey-200">
            <tr
              class="text-black-100 whitespace-nowrap"
              v-for="transaction in history"
              :key="transaction.id"
            >
              <td class="py-4 whitespace-nowrap w-[20%]">
                <div class="text-sm flex items-start space-x-1.5">
                  <!-- <img src="/images/png/mastercard.png" alt=""> -->
                  <div class="flex flex-col items-start mt-4">
                    <div class="flex items-center space-x-1">
                      <span class="text-sm">{{ transaction.amount }}</span>
                      <!-- <span class="text-green bg-green-rgba p-1 rounded-full">default</span> -->
                    </div>
                    <span class="text-gray-rgba-3 text-xs"></span>
                  </div>
                </div>
              </td>
              <td class="py-4">
                <div class="text-sm text-left">
                  {{ transaction.created_at.split("T")[0] }}
                </div>
              </td>
              <td class="py-4">
                <div class="text-sm text-left">{{ transaction.status }}</div>
              </td>
              <td class="py-4 text-left whitespace-nowrap">
                <div class="text-sm">{{ transaction.reference }}</div>
              </td>
              <td class="py-4 text-left whitespace-nowrap">
                <div class="flex items-center space-x-2">
                  {{ transaction.currency }}
                </div>
              </td>
              <td class="py-4 text-left whitespace-nowrap">
                <div class="flex items-center space-x-2">
                  {{ transaction.type }}
                </div>
              </td>
            </tr>
          </tbody>
          <!-- empty state below -->
          <tbody v-else class="w-full">
            <tr class="w-full no-hover">
              <EmptyState>
                <template #icon>
                  <IWallet />
                </template>
                <template #heading> Transaction history </template>
                <template #desc>
                  Transaction history for your company will be displayed here
                </template>
                <template #actions>
                  <button
                    class="bg-[#003b3d text-white px-4+1 py-2.5+1 rounded-full text-sm"
                  >
                    + Add new transaction
                  </button>
                </template>
              </EmptyState>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
