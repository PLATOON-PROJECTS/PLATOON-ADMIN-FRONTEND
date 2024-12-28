<script lang="ts" setup>
import { ref } from "vue";
import {
  IWallet,
  IQuestionMark,
  ISearch,
  ILogo,
  IUserGear,
  IUserThree,
  IPayroll,
  IArrowRightTail,
} from "../../core/icons";
import Notification from "../../components/Notification.vue";
import ProfileAction from "../../components/dropdowns/profileAction.vue";
import DarkModeToggle from "../../components/DarkModeToggle.vue";
import confirmAlert from "../../components/alerts/ConfirmAlert.vue";
import { ComponentPosition as DarkModeButtonPosition } from "../../interface/enums.interface";
import { useBrowserStore } from "../../store";
import { useRouter } from "vue-router";
import { request } from "../../composables/request.composable";
import handleError from "../../composables/handle_error.composable";
import spinner from "../../components/timer/Spinner.vue";
import getPeriod from "../../core/helpers/get_period";
import BarChart from "../../components/BarChart.vue";
import { getItem } from "../../core/utils/storage.helper";
import handleSuccess from "../../composables/handle_success.composable";
import cache from "../../composables/swr_cache";
import { currency } from "../../core/utils/currencyType";

import {
  useWalletStore,
  useEmployeeStore,
  useUserStore,
  useAuthStore,
} from "../../store/index";

// initialize router
const router = useRouter();

// initialize store
const walletStore = useWalletStore();
const authStore = useAuthStore();
const userStore = useUserStore();
const employeeStore = useEmployeeStore();
// variables
const showProfileAction = ref(false);
const confirmMessage = ref({ message: "", id: "" });
const showConfirm = ref(false);
const employeeData = ref<any>([]);
const userInfo = ref(getItem(import.meta.env.VITE_USERDETAILS));
const responseData = ref<any>({ data: {}, message: "" });
const videoChange = ref(false);
const loading = ref(false);

console.log("userInfo before parsing:", userInfo.value);
const parsedUserInfo =
  typeof userInfo.value === "string"
    ? JSON.parse(userInfo.value)
    : userInfo.value;

// Access the organisationId safely
const organisationId = parsedUserInfo?.customerInfo?.organisationId;

// methods

const fetchWallet = async () => {
  const walletCached = cache("wallet");

  if (typeof walletCached !== "undefined") {
    responseData.value.data = walletCached;
  }

  const response = await request(walletStore.getWallet());

  const successResponse = handleSuccess(response);
  if (successResponse && typeof successResponse !== "undefined") {
    // console.log(successResponse.data.data);
    cache("wallet", successResponse.data.data);
    responseData.value.data = successResponse.data.data;
    // console.log(responseData.value);
  }
};

const dashboardData = async () => {
  const walletCached = cache("wallet");

  if (typeof walletCached !== "undefined") {
    responseData.value.data = walletCached;
  }

  const response = await request(walletStore.getWallet());

  const successResponse = handleSuccess(response);
  if (successResponse && typeof successResponse !== "undefined") {
    // console.log(successResponse.data.data);
    cache("wallet", successResponse.data.data);
    responseData.value.data = successResponse.data.data;
    // console.log(responseData.value);
  }
};

// const fetchEmployees = async () => {
//   const totalEmployeeCached = cache("total_employees");

//   if (typeof totalEmployeeCached !== "undefined") {
//     employeeData.value = totalEmployeeCached;
//   }
//   const response = await request(employeeStore.index());

//   const successResponse = handleSuccess(response);

//   if (successResponse && typeof successResponse !== "undefined") {
//     cache("total_employees", successResponse.data.data);
//     employeeData.value = successResponse.data.data;
//     // console.log(successResponse.data);
//   }
// };
const fetchEmployees = async (page = 1) => {
  loading.value = true;
  const totalEmployeeCached = cache("total_employees_length");
  if (typeof totalEmployeeCached !== "undefined") {
    employeeData.value = totalEmployeeCached;
  }
  const response = await request(employeeStore.index(organisationId, 10, page));

  const successResponse = handleSuccess(response);
  loading.value = false;

  if (successResponse && typeof successResponse !== "undefined") {
    employeeData.value = successResponse.data.data.pageItems.length;
    cache("total_employees_length", successResponse.data.data.pageItems.length);
    console.log("*********", successResponse.data.data.pageItems.length);
  }
};
const confirmLogout = () => {
  confirmMessage.value.message = `Are you sure you want to logout? `;
  showConfirm.value = true;
};

const logout = async () => {
  try {
    const response = await request(authStore.logoutUser());
    if (response && response.status === 200) {
      console.log("Logout successful:", response);
      window.location.href = "/login";
    } else {
      console.error("Logout failed:", response);
    }
  } catch (error) {
    console.error("Error during logout:", error);
  }
};

const fetchUserDetails = async () => {
  const userId = Number(localStorage.getItem("userId")); // Retrieve userId from storage
  console.log("User ID:", userId);
  if (userId) {
    const response = await request(userStore.show(userId));
    console.log("API Response:", response);
    const successResponse = handleSuccess(response);
    if (successResponse) {
      responseData.value.data.userDetails = successResponse.data;
      console.log("API Responseeeeeeeeee:", successResponse.data);
    }
  }
};

// fetchWallet();
fetchUserDetails();
fetchEmployees();
// console.log(useBrowserStore().$state.isDarkModeOn);
</script>
<template>
  <div class="">
    <div class="bg-[#003b3d] dark:bg-grey-dark pb-28 rounded-b-r-lg">
      <div class="lg:px-6 px-3 py-3-1 w-full flex items-center justify-between">
        <!-- search -->
        <div class="flex items-center">
          <a href="/dashboard" class="block lg:hidden">
            <ILogo :color="'#ffffff'" />
          </a>

          <p class="text-sm lg:block hidden text-white-rgba-100">
            Compared to N0.0 last month
          </p>
        </div>

        <!--  -->
        <div class="flex items-center lg:space-x-6 space-x-3">
          <DarkModeToggle :position="DarkModeButtonPosition.HOMEPAGE" />
          <button
            class="bg-clip-rgba p-3 rounded-full h-11 w-11 flex items-center justify-center"
          >
            <IQuestionMark :color="'#ffffff'" />
          </button>

          <Notification />
          <!--  -->
          <div class="flex items-center space-x-6">
            <IGridMenu :color="'#ffffff'" />
            <div
              class="relative lg:flex items-center justify-center hidden cursor-pointer bg-white h-[40px] w-[40px] rounded-full"
              @click="showProfileAction = !showProfileAction"
              id="step-2"
            >
              <img src="/images/png/avatar.png" alt="Avatar" />
              <IUserGear />
              <span
                class="absolute right-0 top-7 h-3 w-3 rounded-full bg-green border-2 border-white"
              ></span>
            </div>
          </div>
        </div>
      </div>
      <!-- Profile action dropdown -->
      <ProfileAction
        v-if="showProfileAction == true"
        @logout="confirmLogout"
        @closeProfileAction="showProfileAction = false"
        class="hidden lg:block md:block"
      />
      <!-- confirm alert -->
      <confirmAlert
        :showConfirm="showConfirm"
        @closeConfirm="showConfirm = false"
        v-if="showConfirm == true"
      >
        <template #title> Logout</template>
        <template #confirm>
          <span @click="[logout(), (showConfirm = false)]">
            CONFIRM</span
          ></template
        >
        <template #message> {{ confirmMessage.message }}</template>
      </confirmAlert>

      <div
        class="lg:w-1/3 mx-auto flex flex-col items-center justify-center pt-8 gap-1.5"
      >
        <h3
          class="flex flex-col lg:text-3xl+2 text-xl lg:font-normal font-semimedium text-white capitalize"
        >
          {{ getPeriod() }}
          {{
            JSON.parse(userInfo)?.customerInfo?.firstName
              ? JSON.parse(userInfo)
                  .customerInfo.firstName.charAt(0)
                  .toUpperCase() +
                JSON.parse(userInfo)
                  .customerInfo.firstName.slice(1)
                  .toLowerCase()
              : ""
          }}
          <!-- <span v-show="responseData.data.acc_details" class="mt-2 text-[17px] text-center">(Account Number: {{ responseData.data.acc_details ? responseData.data.acc_details.account_number : 0 }})</span> -->
        </h3>
        <form action="" class="lg:w-[400px] hidden lg:block mt-4">
          <div
            class="flex items-center space-x-6 bg-[#003b3d] border border-white rounded-full px-10 py-3-1"
          >
            <span>
              <ISearch :color="'white'" />
            </span>
            <input
              type="search"
              class="flex-1 focus:outline-none placeholder:text-white placeholder:text-sm bg-transparent text-white"
              placeholder="Search companies."
            />
          </div>
        </form>
      </div>
    </div>

    <!-- cards -->

    <div class="lg:px-6 -mt-18 grid lg:grid-cols-3 px-4 lg:gap-6 gap-3">
      <!-- card -->
      <div
        class="bg-white dark:bg-black-dark rounded-lg px-6 py-4 space-y-4 flex flex-col justify-between"
      >
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <div class="flex flex-col">
              <span
                class="text-base text-black-rgba dark:text-white font-medium"
                >Companies</span
              >
              <span class="text-sm text-black-rgba-100 font-semimedium"
                >Total number of companies</span
              >
            </div>
            <div
              class="bg-grey-100 dark:bg-grey-dark p-3 rounded-full h-12 w-12 flex items-center justify-center"
            >
              <IWallet class="dark:text-white" />
            </div>
          </div>
          <div>
            <h3 class="font-bold text-black-rgba dark:text-white text-2xl">
              {{ employeeData }}
            </h3>
            <span class="text-black-rgba-100 text-xs">Total Balance</span>
          </div>
        </div>

        <div class="flex items-center">
          <router-link
            to="/dashboard/companies"
            class="flex items-center space-x-2.5 bg-grey-100 dark:bg-grey-dark p-3 rounded-full px-4+1"
          >
            <span class="font-medium text-sm text-[#003b3d]">
              Manage Comapnies
            </span>
            <span>
              <IArrowRightTail />
            </span>
          </router-link>
        </div>
      </div>
      <!--  -->
      <div
        class="bg-white dark:bg-black-dark rounded-lg px-6 py-4 space-y-4 flex flex-col justify-between"
      >
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <div class="flex flex-col">
              <span
                class="text-base text-black-rgba dark:text-white font-medium"
                >Admin Users</span
              >
              <span class="text-sm text-black-rgba-100 font-semimedium"
                >Total number of admin users</span
              >
            </div>
            <div
              class="bg-grey-100 dark:bg-grey-dark p-3 rounded-full h-12 w-12 flex items-center justify-center"
            >
              <IUserThree />
            </div>
          </div>
          <div>
            <h3 class="font-bold text-black-rgba dark:text-white text-2xl">
              {{ employeeData }}
            </h3>
          </div>
        </div>

        <div>
          <button
            @click="router.push({ path: '/dashboard/manage-users/all-users' })"
            class="flex items-center space-x-2.5 bg-grey-100 dark:bg-grey-dark p-3 rounded-full px-4+1"
          >
            <span class="font-medium text-sm text-[#003b3d]"
              >Manage Admin Users</span
            >
            <span>
              <IArrowRightTail />
            </span>
          </button>
        </div>
      </div>
      <!--  -->
      <div
        class="bg-white dark:bg-black-dark rounded-lg px-6 py-4 space-y-4 flex flex-col justify-between"
      >
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <div class="flex flex-col">
              <span
                class="text-base text-black-rgba dark:text-white font-medium"
                >Funds</span
              >
              <span class="text-sm text-black-rgba-100 font-semimedium"
                >Total number of employees</span
              >
            </div>
            <div
              class="bg-grey-100 dark:bg-grey-dark p-3 rounded-full h-12 w-12 flex items-center justify-center"
            >
              <IPayroll />
            </div>
          </div>
          <div class="flex gap-4 items-center">
            <div>
              <h3 class="font-bold text-black-rgba dark:text-white text-2xl">
                ₦
                {{ currency(JSON.parse(userInfo)?.customerInfo?.wallet ?? 0) }}
              </h3>
              <span class="text-black-rgba-100 text-xs"
                >Total funds disbursed</span
              >
            </div>
            <div>
              <h3 class="font-bold text-black-rgba dark:text-white text-2xl">
                ₦
                {{ currency(JSON.parse(userInfo)?.customerInfo?.wallet ?? 0) }}
              </h3>
              <span class="text-black-rgba-100 text-xs"
                >Total Pending disbursement</span
              >
            </div>
          </div>
          <div class="flex gap-4 items-center">
            <div>
              <h3 class="font-bold text-black-rgba dark:text-white text-2xl">
                ₦
                {{ currency(JSON.parse(userInfo)?.customerInfo?.wallet ?? 0) }}
              </h3>
              <span class="text-black-rgba-100 text-xs"
                >Total funds recieved</span
              >
            </div>
            <div>
              <h3 class="font-bold text-black-rgba dark:text-white text-2xl">
                ₦
                {{ currency(JSON.parse(userInfo)?.customerInfo?.wallet ?? 0) }}
              </h3>
              <span class="text-black-rgba-100 text-xs"
                >Total revenue recieved</span
              >
            </div>
          </div>
        </div>
      </div>
      <!--  -->
    </div>
    <!-- <div class="lg:px-6 px-4 mt-3 lg:mt-6">
      <div class="lg:flex divide-x divide-grey bg-white border-rgba rounded-lg">
        <button
          type="button"
          class="flex gap-3 items-center cursor-pointer py-3 text-[20px] px-6 hover:text-green-600"
          @click="videoChange = true"
        >
          How Everything works
          <label
            class="cursor-pointer flex items-center space-x-2.5 bg-[#003b3d] dark:bg-grey-dark p-3 rounded-full px-4+1"
          >
            <span class="font-medium text-sm text-[#ffffff]"
              >View Demo video</span
            >
          </label>
        </button>
      </div>
    </div> -->

    <!-- Charts -->

    <div class="lg:px-6 px-4 mt-3 lg:mt-6">
      <div class="lg:flex divide-x divide-grey bg-white border-rgba rounded-lg">
        <div class="flex-grow flex items-center justify-center">
          <BarChart />
        </div>
        <div class="px-8-2 py-5-1 lg:w-[28%]">
          <div>
            <h3 class="text-2xl text-black-rgba font-medium">
              ₦ {{ currency(walletStore.totalAmount) }}
            </h3>
            <p class="text-sm text-black-rgba-100 font-semimedium">
              Total payments made this year
            </p>
          </div>

          <div class="mt-9+3 divide-y divide-grey">
            <div
              class="flex items-center justify-between py-3-1 border-t border-grey"
            >
              <div class="flex items-center space-x-2+1">
                <span class="bg-[#003b3d] p-1.5 rounded-full"></span>
                <span class="text-sm text-black-rgba font-normal">Salary</span>
              </div>
              <div class="space-x-7-1">
                <span class="text-sm text-black-rgba font-semibold"
                  >₦{{ currency(walletStore.totalAmount) }}</span
                >
                <!-- <span class="text-sm text-black-rgba font-semibold">15%</span> -->
              </div>
            </div>
            <!--  -->
            <!-- <div class="flex items-center justify-between py-3-1">
              <div class="flex items-center space-x-2+1">
                <span class="bg-blue p-1.5 rounded-full"></span>
                <span class="text-sm text-black-rgba font-normal">Taxes</span>
              </div>
              <div class="space-x-7-1">
                <span class="text-sm text-black-rgba font-semibold"
                  >₦300,600</span
                >
                <span class="text-sm text-black-rgba font-semibold">85%</span>
              </div>
            </div> -->
            <!--  -->
            <!-- <div class="flex items-center justify-between py-3-1">
              <div class="flex items-center space-x-2+1">
                <span class="bg-orange p-1.5 rounded-full"></span>
                <span class="text-sm text-black-rgba font-normal">Pension</span>
              </div>
              <div class="space-x-7-1">
                <span class="text-sm text-black-rgba font-semibold"
                  >₦290,500</span
                >
                <span class="text-sm text-black-rgba font-semibold">48%</span>
              </div>
            </div> -->
            <!--  -->
            <!-- <div class="flex items-center justify-between py-3-1">
              <div class="flex items-center space-x-2+1">
                <span class="bg-red-100 p-1.5 rounded-full"></span>
                <span class="text-sm text-black-rgba font-normal">Health</span>
              </div>
              <div class="space-x-7-1">
                <span class="text-sm text-black-rgba font-semibold"
                  >₦2.80M</span
                >
                <span class="text-sm text-black-rgba font-semibold">36%</span>
              </div>
            </div> -->
          </div>
        </div>
      </div>
    </div>
  </div>
  <div
    class="flex items-center justify-center fixed top-0 left-0 w-screen h-screen bg-black/30"
    v-if="videoChange"
    @click="videoChange = false"
  >
    <div class="w-[500px] rounded-md">
      <iframe
        width="560"
        height="315"
        src="https://www.youtube.com/embed/H8gqZTx9jp8?si=e7sRsc0XJCtcR4hp"
        title="YouTube video player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerpolicy="strict-origin-when-cross-origin"
        allowfullscreen
      ></iframe>
    </div>
  </div>
</template>

<style></style>
