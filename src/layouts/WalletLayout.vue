<script setup lang="ts">
import { ref } from "vue";
import Card from "../components/cards/Card.vue";
import EmptyState from "../components/EmptyState.vue";
import SuccessAlert from "../components/alerts/SuccessAlert.vue";
import { request } from "../composables/request.composable";
import handleError from "../composables/handle_error.composable";
import handleSuccess from "../composables/handle_success.composable";
import spinner from "../components/timer/Spinner.vue";
import { useWalletStore, useUserStore } from "../store/index";
import { useRouter, useRoute } from "vue-router";
import {
  IMinusCircle,
  IDoubleMark,
  IArrowLeftTail,
  ICaretUpDown,
  IWallet,
} from "../core/icons";
import cache from "../composables/swr_cache";
import {currency} from '../core/utils/currencyType'

// initialize router
const router = useRouter();
const route = useRoute();

// initialize store
const walletStore = useWalletStore();
const userStore = useUserStore();

// variables
const responseData = ref<any>({ data: {} });
const showSuccess = ref(false);
const copiedState = ref(false);
const loading = ref(false);

// methods
const copy = async () => {
  await navigator.clipboard.writeText(
    responseData.value.data
      ? responseData.value.data.acc_details.account_number
      : ""
  );

    copiedState.value = true;

};
const fetchWallet = async () => {
  const walletCached = cache("wallet");

  if (typeof walletCached !== "undefined") {
    loading.value = false;
    responseData.value.data = walletCached;
  }
  const response = await request(walletStore.getWallet());

  const successResponse = handleSuccess(response);
  if (successResponse && typeof successResponse !== "undefined") {
    cache("wallet", successResponse.data.data);
    responseData.value.data = successResponse.data.data;
  }
};

const makeActive = (path: string) => {
  if (route.path === path) {
    return true;
  }
  return false;
};

// fetchWallet();
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

      <div v-if="responseData.data.acc_details">
        <button
          :disabled="loading"
          class="bg-[#003b3d] text-white px-4+1 py-2.5+1 rounded-full text-sm"
        >
          <spinner v-if="loading == true" />
          <span v-else @click="copy">
            {{ copiedState == true ? "Copied" : "Copy account number" }}</span
          >
        </button>
      </div>
    </div>
    <!-- cards-->
    <div class="grid lg:grid-cols-3 gap-6">
      <!-- card -->

      <div
        @click="router.push({ path: '/dashboard/mywallet/accounts' })"
        :class="
          makeActive('/dashboard/mywallet/accounts') == true
            ? 'bg-[#003b3d] bg-eclipse-svg-[#003b3d]'
            : 'bg-white bg-eclipse-svg-white'
        "
        class="rounded-lg px-6 py-4 flex flex-col justify-between"
      >
        <div class="space-y-2.5">
          <div class="flex items-center justify-between">
            <div class="flex flex-col">
              <span
                class="text-base font-medium"
                :class="
                  makeActive('/dashboard/mywallet/accounts') == true
                    ? 'text-white-rgba'
                    : 'text-black'
                "
                >Wallet Balance</span
              >
              <span
                class="text-sm font-semimedium"
                :class="
                  makeActive('/dashboard/mywallet/accounts') == true
                    ? 'text-white-rgba'
                    : 'text-black-rgba-100'
                "
                >Avaliable balance</span
              >
            </div>
            <div
              class="bg-white p-3 rounded-full h-12 w-12 flex items-center justify-center"
            >
              <IDoubleMark />
            </div>
          </div>
          <div class="pb-4 flex items-center space-x-3">
            <h3
              class="font-bold text-2xl"
              :class="
                makeActive('/dashboard/mywallet/accounts') == true
                  ? 'text-white-rgba'
                  : 'text-[#003b3d]'
              "
            >
              ₦{{ currency(responseData.data.balance) }}
            </h3>
            <button v-if="responseData.data.acc_details"
              @click="copy"
              :class="
                makeActive('/dashboard/mywallet/accounts') == true
                  ? 'bg-white'
                  : 'bg-grey-100'
              "
              class="flex items-center space-x-2.5 whitespace-nowrap text-[#003b3d] p-3 rounded-full px-4+1 text-sm font-medium"
            >
              {{ copiedState == true ? "Copied" : "Copy account number" }}
            </button>
          </div>
        </div>
      </div>
      <!--  -->
      <div
        @click="router.push({ path: '/dashboard/mywallet/transactions' })"
        :class="
          makeActive('/dashboard/mywallet/transactions') == true
            ? 'bg-[#003b3d]'
            : 'bg-white'
        "
        class="rounded-lg px-6 py-4 space-y-4 flex flex-col justify-between"
      >
        <div class="space-y-2.5">
          <div class="flex items-center justify-between">
            <div class="flex flex-col">
              <span
                :class="
                  makeActive('/dashboard/mywallet/transactions') == true
                    ? 'text-white-rgba'
                    : 'text-black'
                "
                class="text-base font-medium"
                >Transaction History</span
              >
              <span
                :class="
                  makeActive('/dashboard/mywallet/transactions') == true
                    ? 'text-white-rgba'
                    : 'text-black-rgba-100'
                "
                class="text-sm font-semimedium"
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

        <!-- <div>
          <button
            class="flex items-center space-x-2.5 bg-grey-100 p-3 rounded-full px-4+1"
          >
            <span class="font-medium text-sm text-[#003b3d]">Download CSV</span>
          </button>
        </div> -->
      </div>
    </div>

    <!-- router view -->
    <router-view />
  </div>
</template>
