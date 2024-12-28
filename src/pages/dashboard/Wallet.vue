<script lang="ts" setup>
import { ref } from "vue";
import EmptyState from "../../components/EmptyState.vue";
import SuccessAlert from "../../components/alerts/SuccessAlert.vue";
import { request } from "../../composables/request.composable";
import handleError from "../../composables/handle_error.composable";
import handleSuccess from "../../composables/handle_success.composable";
import spinner from "../../components/timer/Spinner.vue";
import { useWalletStore, useUserStore } from "../../store/index";
import { stringValidate, numberValidate } from "../../validations/validate";
import { storeItem, getItem } from "../../core/utils/storage.helper";
import { useRouter } from "vue-router";
import {
  IMinusCircle,
  IDoubleMark,
  IArrowLeftTail,
  ICaretUpDown,
  IWallet,
} from "../../core/icons";
import {currency} from '../../core/utils/currencyType'

// initialize router
const router = useRouter();

// initialize store
const walletStore = useWalletStore();
const userStore = useUserStore();

// variables
const loading = ref(false);
const accounts = ref<any[]>([]);
const history = ref<any[]>([]);
const showSuccess = ref(false);
const responseData = ref<any>({ message: "Action successful" });

// methods
const createWallet = async () => {
  const response = await request(walletStore.create(), loading);

  handleError(response, userStore);
  const successResponse = handleSuccess(response, showSuccess);

  if (successResponse && typeof successResponse !== "undefined") {
    responseData.value = successResponse;
  }
};
const fetchWallet = async () => {
  const response = await request(walletStore.getWallet());

  const successResponse = handleSuccess(response);
  if (successResponse && typeof successResponse !== "undefined") {
    responseData.value = successResponse;
    // console.log(responseData.value);
  }
};
const fetchTransactions = async () => {
  const response = await request(walletStore.getWalletHistory(), loading);

  handleError(response, userStore);
  const successResponse = handleSuccess(response);

  if (successResponse && typeof successResponse !== "undefined") {
    history.value = successResponse.data;
    // console.log(successResponse)
  }
};
// fetchWallet();
fetchTransactions();
</script>
<template>
  <div class="px-6 py-9 space-y-6">
    <successAlert
      :showSuccess="showSuccess"
      @closeSuccess="showSuccess = false"
      v-if="showSuccess == true"
    >
      <template #otherMessage>CLOSE</template>
      {{ responseData.message }}</successAlert
    >
    <div
      class="flex items-center justify-between scrollbar-hide overflow-auto lg:space-x-0 space-x-3 whitespace-nowrap"
    >
      <div class="flex items-center space-x-5-1">
        <button @click="router.back()">
          <IArrowLeftTail />
        </button>
        <span class="text-black-rgba font-medium sm:text-2xl text-xl"
          >Manage Wallet</span
        >
      </div>

      <div>
        <button
          :disabled="loading"
          class="bg-[#003b3d] text-white px-4+1 py-2.5+1 rounded-full text-sm"
        >
          <spinner v-if="loading == true" />
          <span v-else>+ Add New Account</span>
        </button>
      </div>
    </div>
    <!-- cards-->
    <div class="grid lg:grid-cols-3 gap-6">
      <!-- card -->
      <div
        class="bg-[#003b3d] rounded-lg px-6 py-4 flex flex-col justify-between bg-eclipse-svg-blue"
      >
        <div class="space-y-2.5">
          <div class="flex items-center justify-between">
            <div class="flex flex-col">
              <span class="text-base text-white-rgba font-medium"
                >Wallet Balance</span
              >
              <span class="text-sm text-white-rgba-2 font-semimedium"
                >Avaliable balance</span
              >
            </div>
            <div
              class="bg-blue-light p-3 rounded-full h-12 w-12 flex items-center justify-center"
            >
              <IDoubleMark />
            </div>
          </div>
          <div class="pb-4 flex items-center space-x-3">
            <h3 class="font-bold text-white-rgba text-2xl">
              ₦ {{ responseData.data ? currency(responseData.data.data.balance) : "0.00" }}
            </h3>
            <button
              class="flex items-center space-x-2.5 bg-white whitespace-nowrap text-[#003b3d] p-3 rounded-full px-4+1 text-sm font-medium"
            >
              Fund Wallet
            </button>
          </div>
        </div>
      </div>
      <!--  -->
      <div
        class="bg-white rounded-lg px-6 py-4 space-y-4 flex flex-col justify-between"
      >
        <div class="space-y-2.5">
          <div class="flex items-center justify-between">
            <div class="flex flex-col">
              <span class="text-base text-black-rgba font-medium"
                >Transaction History</span
              >
              <span class="text-sm text-black-rgba-100 font-semimedium"
                >All transactions history</span
              >
            </div>
            <div
              class="bg-grey-100 p-3 rounded-full h-12 w-12 flex items-center justify-center"
            >
              <IMinusCircle />
            </div>
          </div>
        </div>

        <div>
          <button
            class="flex items-center space-x-2.5 bg-grey-100 p-3 rounded-full px-4+1"
          >
            <span class="font-medium text-sm text-[#003b3d]">Download CSV</span>
          </button>
        </div>
      </div>
    </div>
    <!-- Table -->
    <!-- <div class="bg-white rounded-t-lg divide-y divide-grey-200"> -->
    <!--  -->
    <!-- <div class="flex items-center space-x-6 p-6">
        <h2 class="font-medium text-base">Manage Accounts</h2>
      </div> -->
    <!--  -->
    <!-- <div class="py-6 scrollbar-hide overflow-auto">
        <table class="w-full">
          <thead v-if="accounts[0]" class="text-black-200 text-sm text-left">
            <tr class="whitespace-nowrap">
              <th scope="col" class="py-4 font-normal text-left">
                Card details
              </th>
              <th scope="col" class="py-4 font-normal text-left text-sm">
                Date added
              </th>
              <th scope="col" class="py-4 font-normal text-left text-sm">
                Expiry Date
              </th>
              <th scope="col" class="py-4 font-normal text-left text-sm">
                Action
              </th>
            </tr>
          </thead>
          <tbody v-if="accounts[0]" class="bg-white divide-y divide-grey-200">
            <tr class="text-black-100 whitespace-nowrap">
              <td class="py-4 whitespace-nowrap w-[20%]">
                <div class="text-sm flex items-start space-x-1.5"> -->
    <!-- <img src="/images/png/mastercard.png" alt=""> -->
    <!-- <div class="flex flex-col items-start mt-4">
                    <div class="flex items-center space-x-1">
                      <span class="text-sm">********0902</span> -->
    <!-- <span class="text-green bg-green-rgba p-1 rounded-full">default</span> -->
    <!-- </div>
                    <span class="text-gray-rgba-3 text-xs"
                      >First Bank Nigeria</span
                    >
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
                    class="text-white text-xs font-medium bg-green px-4+1 py-2 rounded-full"
                  >
                    Default Card
                  </button>
                </div>
              </td>
            </tr>
            <tr v-for="i in 9" :key="i" class="text-black-100">
              <td class="py-4 whitespace-nowrap w-[20%]">
                <div class="text-sm flex items-start space-x-1.5"> -->
    <!-- <img src="/images/png/mastercard.png" alt=""> -->
    <!-- <div class="flex flex-col mt-5 items-start">
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
            </tr>
          </tbody> -->
    <!-- empty state below -->
    <!-- <tbody v-else class="w-full">
            <tr class="w-full no-hover">
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
                    class="bg-blue text-white px-4+1 py-2.5+1 rounded-full text-sm"
                  >
                    + Add new Account
                  </button>
                </template>
              </EmptyState>
            </tr>
          </tbody>
        </table> -->
    <!-- </div> -->
    <!-- </div> -->

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
                    <span class="text-gray-rgba-3 text-xs">{{
                      transaction.created_at.split("T")[0]
                    }}</span>
                  </div>
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
                    class="bg-[#003b3d] text-white px-4+1 py-2.5+1 rounded-full text-sm"
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
