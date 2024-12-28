<script lang="ts" setup>
import TopNavbar from "../components/layout/TopNavbar.vue";
import ProfileAction from "../components/dropdowns/profileAction.vue";
import EditPensionDetails from "../modals/EditPensionDetails.vue";
import CreateUser from "../modals/CreateUser.vue";
import UpdateUser from "../modals/UpdateUser.vue";
import confirmAlert from "../components/alerts/ConfirmAlert.vue";
import { request } from "../composables/request.composable";
import handleError from "../composables/handle_error.composable";
import handleSuccess from "../composables/handle_success.composable";
import spinner from "../../components/timer/Spinner.vue";
import { useAuthStore, useUserStore } from "../store/index";

import { useRoute } from "vue-router";
import { onMounted, ref, provide, nextTick, render, watchEffect } from "vue";

// libs
import {
  VOnboardingWrapper,
  VOnboardingStep,
  useVOnboarding,
} from "v-onboarding";
import "v-onboarding/dist/style.css";
import SideNav from "../components/layout/SideNav.vue";
import BottomNav from "../components/layout/BottomNav.vue";

// initialize store
const authStore = useAuthStore();
const userStore = useUserStore();

const route = useRoute();
// variables
const layout = ref<any>();
const wrapper = ref(null);
const reRender = ref(true);
const smWrapper = ref(null);
const renderComponent = ref(true);
const confirmMessage = ref({ message: "", id: "" });
const showConfirm = ref(false);
const openPensionModal = ref(false);
const showProfileAction = ref(false);
const openCreateUser = ref(false);
const openUpdateUser = ref(false);
const { start, goToStep, finish } = useVOnboarding(wrapper);
const onboardingSm = useVOnboarding(smWrapper);
const sideNav = ref<any>();
const isOnboarded = ref(localStorage.getItem('onBoarded') && JSON.parse(localStorage.getItem('onBoarded') ?? '')?.onboarded == true ? true : false)

const steps = [
  {
    attachTo: {
      element: "#step-1",
    },
    content: {
      title: "Employees",
      description:
        "Little max of three line information telling the users what this menu can do",
    },
    options: {
      popper: {
        placement: "auto",
        modifiers: [
          {
            name: "offset",
            options: {
              offset: [60, 20],
            },
          },
          {
            name: "arrow",
            options: {
              padding: 5,
            },
          },
        ],
      },
    },
  },
  {
    attachTo: { element: "#step-2" },
    content: {
      title: "Manage Profile",
      description:
        "Make changes to your profile, manage users and update your company and Tax details",
    },
    options: {
      popper: {
        placement: "bottom",
        modifiers: [
          {
            name: "offset",
            options: {
              offset: [-108, 25],
            },
          },
          {
            name: "arrow",
            options: {
              padding: 5,
            },
          },
        ],
      },
    },
    on: {
      // beforeStep: function () { },
      afterStep: function () {},
    },
  },
];

const stepsTwo = [
  {
    attachTo: {
      element: "#sm-step-1",
    },
    content: {
      title: "Employees",
      description:
        "Little max of three line information telling the users what this menu can do",
    },
    options: {
      popper: {
        placement: "auto",
        modifiers: [
          {
            name: "offset",
            options: {
              offset: [60, 20],
            },
          },
          {
            name: "arrow",
            options: {
              padding: 5,
            },
          },
        ],
      },
    },
  },
];

// methods
const fetchCompany = () => {
  sideNav.value.fetchCompany();
};

const fetchUsers = () => {
  typeof layout.value !== "undefined" && layout.value.fetchUsers
    ? layout.value.fetchUsers()
    : " ";
};

// methods
const confirmLogout = () => {
  confirmMessage.value.message = `Are you sure you want to logout? `;
  showConfirm.value = true;
};

const forceRerender = async () => {
  // Remove MyComponent from the DOM
  renderComponent.value = false;

  // Wait for the change to get flushed to the DOM
  await nextTick();

  // Add the component back in
  renderComponent.value = true;
  reRender.value = false;
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

// provide and inject
provide("isOpen", openPensionModal);
provide("openCreateUser", openCreateUser);
provide("openUpdateUser", openUpdateUser);
provide("render", reRender);

watchEffect(() => {
  if (reRender.value == true) {
    forceRerender();
  }
});

onMounted(() => {
  if (!localStorage.getItem("onBoarded")) {
    start(), onboardingSm.start();
    const onBoarded = JSON.stringify({ onboarded: true });
    localStorage.setItem("onBoarded", onBoarded);
  }
});
</script>
<template>
  <!-- steps for smaller screen -->
  <VOnboardingWrapper ref="smWrapper" :steps="stepsTwo" class="hidden">
    <template #default="{ previous, next, step, isFirst, isLast }">
      <!-- <div class="bg-onboarding"></div> -->
      <VOnboardingStep>
        <div
          class="shadow rounded-lg w-[280px] border-t-8 border-[#ffffff bg-white"
        >
          <div class="p-6">
            <div class="flex flex-col items-start justify-between">
              <div v-if="step.content">
                <h3
                  v-if="step.content.title"
                  class="text-base font-medium leading-6 text-black-300"
                >
                  {{ step.content.title }}
                </h3>
                <div
                  v-if="step.content.description"
                  class="mt-2 max-w-xl text-sm text-grey-300"
                >
                  <p>{{ step.content.description }}</p>
                </div>
              </div>
              <div class="mt-5 flex items-center space-x-3 relative">
                <button
                  @click="next"
                  type="button"
                  class="bg-[#003b3d flex items-start justify-center rounded-full py-2 px-5 text-white font-medium text-sm"
                >
                  {{ isLast ? "Finish" : "Next" }}
                </button>
                <template v-if="!isFirst">
                  <button
                    @click="previous"
                    type="button"
                    class="text-[#003b3d] border border-[#003b3d] py-2 px-5 rounded-full font-medium text-sm"
                  >
                    Back
                  </button>
                </template>
              </div>
            </div>
          </div>
        </div>
      </VOnboardingStep>
      <div
        v-show="false"
        @click="finish()"
        class="fixed cursor-pointer lg:bottom-7 bottom-[50%] left-0 right-0 text-center opacity-9 text-white-rgba-100 font-medium z-20"
      >
        I got it.
        <button class="border-b border-white-rgba-100 p-1">
          Skip Onboarding
        </button>
      </div>
    </template>
  </VOnboardingWrapper>
  <VOnboardingWrapper ref="wrapper" :steps="steps" class="hidden">
    <template #default="{ previous, next, step, exit, isFirst, isLast, index }">
      <!-- <div class="bg-onboarding"></div> -->
      <VOnboardingStep>
        <div
          class="shadow rounded-lg w-[280px] border-t-8 border-[#003b3d] bg-white"
        >
          <div class="p-6">
            <div class="flex flex-col items-start justify-between">
              <div v-if="step.content">
                <h3
                  v-if="step.content.title"
                  class="text-base font-medium leading-6 text-black-300"
                >
                  {{ step.content.title }}
                </h3>
                <div
                  v-if="step.content.description"
                  class="mt-2 max-w-xl text-sm text-grey-300"
                >
                  <p>{{ step.content.description }}</p>
                </div>
              </div>
              <div class="mt-5 flex items-center space-x-3 relative">
                <button
                  @click="next"
                  type="button"
                  class="bg-[#003b3d] flex items-start justify-center rounded-full py-2 px-5 text-white font-medium text-sm"
                >
                  {{ isLast ? "Finish" : "Next" }}
                </button>
                <template v-if="!isFirst">
                  <button
                    @click="previous"
                    type="button"
                    class="text-[#003b3d] border border-[#003b3d] py-2 px-5 rounded-full font-medium text-sm"
                  >
                    Back
                  </button>
                </template>
              </div>
            </div>
          </div>
        </div>
      </VOnboardingStep>
      <div
        v-show="false"
        @click="finish()"
        class="fixed cursor-pointer lg:bottom-7 bottom-[50%] left-0 right-0 text-center opacity-9 text-white-rgba-100 font-medium z-20"
      >
        I got it.
        <button class="border-b border-white-rgba-100 p-1">
          Skip Onboarding
        </button>
      </div>
    </template>
  </VOnboardingWrapper>

  <div class="min-h-screen h-full bg-grey-100 dark:bg-black lg:flex relative">
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

    <!-- edit pension modal -->
    <EditPensionDetails v-if="openPensionModal == true" />
    <!-- create user modal-->
    <CreateUser v-if="openCreateUser == true" @fetchUsers="fetchUsers()" />
    <!-- Update user modal-->
    <UpdateUser v-if="openUpdateUser == true" />
    <!-- side nav -->
    <SideNav class="hidden lg:block" ref="sideNav" />
    <!-- bottom nav -->
    <BottomNav class="lg:hidden block" />
    <!--  -->
    <!-- top nav and main page -->
    <div class="lg:flex-1 w-screen lg:ml-64+4 relative h-full">
      <!-- top navbar -->
      <TopNavbar
        v-if="!route.meta?.noTopNav"
        @closeProfileAction="showProfileAction = !showProfileAction"
      />
      <!-- Profile action dropdown -->
      <ProfileAction
        @logout="confirmLogout"
        v-if="showProfileAction == true"
        @closeProfileAction="showProfileAction = false"
      />
      <!-- main content -->
      <main class="h-full relative">
        <div class="-z-10 lg:pb-0 pb-20">
          <router-view v-slot="{ Component }" v-if="renderComponent == true">
            <component
              ref="layout"
              :is="Component"
              @fetchCompanies="fetchCompany"
            />
          </router-view>
        </div>
      </main>
    </div>
  </div>
</template>
