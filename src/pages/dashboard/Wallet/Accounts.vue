<script setup lang="ts">
import { ref } from "vue";
import EmptyState from "../../../components/EmptyState.vue";
import SuccessAlert from "../../components/alerts/SuccessAlert.vue";
import { request } from "../../../composables/request.composable";
import handleError from "../../../composables/handle_error.composable";
import handleSuccess from "../../../composables/handle_success.composable";
import spinner from "../../../components/timer/Spinner.vue";
import { useWalletStore, useUserStore } from "../../../store/index";
import { useRouter, useRoute } from "vue-router";
import {
  IMinusCircle,
  IDoubleMark,
  IArrowLeftTail,
  ICaretUpDown,
  IWallet,
} from "../../../core/icons";
import cache from "../../../composables/swr_cache";

// initialize router
const router = useRouter();
const route = useRoute();

// initialize store
const walletStore = useWalletStore();
const userStore = useUserStore();

// variables
const loading = ref(false);
const accounts = ref<any[]>([]);

const showSuccess = ref(false);

const responseData = ref<any>({ message: "Action successful" });

// methods
const fetchWallet = async () => {
  loading.value = true;
  const walletCached = cache("wallet");

  if (typeof walletCached !== "undefined") {
    loading.value = false;
    responseData.value.data = walletCached;
    accounts.value.length = 0;
    accounts.value.push(walletCached);
  }

  const response = await request(walletStore.getWallet(), loading);

  const successResponse = handleSuccess(response);
  if (successResponse && typeof successResponse !== "undefined") {
    // console.log(successResponse.data.data);
    cache("wallet", successResponse.data.data);
    responseData.value.data = successResponse.data.data;
    accounts.value.length = 0;
    accounts.value.push(successResponse.data.data);
  }

};

// fetchWallet();

</script>

<template>
  <div>
    <!-- Table -->
    <div class="bg-white rounded-t-lg divide-y divide-grey-200">
      <!--  -->
      <div class="flex items-center space-x-6 p-6">
        <h2 class="font-medium text-base">Manage Accounts</h2>
      </div>
      <!--  -->

      <spinner
        v-if="loading == true"
        class="flex justify-center items-center lg:h-[400px] h-[300px]"
      />
      <!--  -->
      <div v-else class="py-6 scrollbar-hide overflow-auto">
        <table class="w-full">
          <thead v-if="accounts[0] && accounts[0].acc_details" class="text-black-200 text-sm text-left">
            <tr class="whitespace-nowrap">
              <th scope="col" class="py-4 font-normal text-left">
                Account number
              </th>
              <th scope="col" class="py-4 font-normal text-left text-sm">
                Account Name
              </th>
              <th scope="col" class="py-4 font-normal text-left text-sm">
                Bank
              </th>
            </tr>
          </thead>
          <tbody v-if="accounts[0] && accounts[0].acc_details" class="bg-white divide-y divide-grey-200">
            <tr
              v-for="account in accounts"
              :key="account.id"
              class="text-black-100 whitespace-nowrap"
            >
              <td class="py-4 whitespace-nowrap">
                <div class="text-sm flex items-start space-x-1.5">
                  <div class="flex flex-col items-start">
                    <div class="flex items-center space-x-1">
                      <span>{{
                        account.acc_details &&
                        account.acc_details.account_number
                          ? account.acc_details.account_number
                          : ""
                      }}</span>
                      <!-- <span class="text-green bg-green-rgba p-1 rounded-full"
                        >default</span
                      > -->
                    </div>
                  </div>
                </div>
              </td>
              <td class="py-4">
                <div class="text-sm text-left">
                  {{
                    account.acc_details && account.acc_details.account_name
                      ? account.acc_details.account_name
                      : ""
                  }}
                </div>
              </td>
              <td class="py-4 text-left whitespace-nowrap">
                <div class="text-sm">
                  {{
                    account.acc_details && account.acc_details.bank
                      ? account.acc_details.bank
                      : ""
                  }}
                </div>
              </td>
            </tr>
            <!-- <tr v-for="i in 9" :key="i" class="text-black-100">
              <td class="py-4 whitespace-nowrap w-[20%]">
                <div class="text-sm flex items-start space-x-1.5">
                  <img src="/images/png/mastercard.png" alt="" />
                  <div class="flex flex-col mt-5 items-start">
                    <div class="flex items-center space-x-1">
                      <span class="text-sm">********0902</span>
                    </div>
                    <span class="text-gray-rgba-3 text-xs">GTCO</span>
                  </div>
                </div>
              </td>
              <td class="py-4">
                <div class="text-sm text-left">Jan 12, 2022 15:32</div>
              </td>
              <td class="py-4 text-left whitespace-nowrap">
                <div class="text-sm">05/09</div>
              </td>
              <td class="py-4 text-left whitespace-nowrap">
                <div class="flex items-center space-x-2">
                  <button
                    class="text-green bg-green-rgba text-xs text-bold px-4+1 py-2 rounded-full"
                  >
                    Make Default
                  </button>
                  <button
                    class="text-red text-xs font-medium bg-red-light px-4+1 py-2 rounded-full"
                  >
                    Remove Card
                  </button>
                </div>
              </td>
            </tr> -->
          </tbody>
          <!-- empty state below -->
          <tbody v-else class="w-full">
            <tr class="w-full no-hover justify-center">
              <EmptyState>
                <template #icon>
                  <IWallet />
                </template>
                <template #heading> Wallet accounts </template>
                <template #desc>
                  Accounts setup for your company will be displayed here
                </template>
                <template #actions>
                  <button
                    class="bg-[#003b3d text-white px-4+1 py-2.5+1 rounded-full text-sm"
                  >
                    + Add new Account
                  </button>
                </template>
              </EmptyState>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Table -->
  </div>
</template>
