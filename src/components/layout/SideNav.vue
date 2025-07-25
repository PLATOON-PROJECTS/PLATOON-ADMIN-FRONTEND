<script lang="ts" setup>
import { ref, inject } from "vue";
import { useRouter } from "vue-router";
import spinner from "../../components/timer/Spinner.vue";
import SuccessAlert from "../../components/alerts/SuccessAlert.vue";
import { isActiveRoute } from "../../core/router";
import { useBrowserStore } from "../../store";
import general from "../dropdowns/general.vue";
import ButtonLightBlue from "../../components/buttons/ButtonLightBlue.vue";
import EmptyState from "../../components/EmptyState.vue";
import { ILinkBreak } from "../../core/icons";
import {
  IIdCard,
  IPayroll,
  ILogo,
  IRadioChecked,
  IArrowDown,
  IHome,
  IBuildings,
  IUserGear,
  IFileClockIcon,
  ISettings,
  ICompanySettings,
  IUserThree,
  IScales,
  IHealth,
  IUmbrella,
} from "../../core/icons";

import { request } from "../../composables/request.composable";
import handleError from "../../composables/handle_error.composable";
import handleSuccess from "../../composables/handle_success.composable";
import { useCompanyStore, useUserStore } from "../../store/index";
import { getItem } from "../../core/utils/storage.helper";
import { computed } from "vue";

// initialize router
const router = useRouter();

// initialize store
const companyStore = useCompanyStore();
const userStore = useUserStore();
// variables
const openCalender = ref(false);
const showSuccess = ref(false);
const loading = ref(false);
const responseData = ref<any>({ message: "Action successful" });
const companies = ref<any[]>([]);
const showDropDown = ref(false);
const userInfo = ref(getItem(import.meta.env.VITE_USERDETAILS));
const logged_in_company: any = ref({
  name: "",
});

const serverError = ref(false);

const browserStore = useBrowserStore();

// provide and inject
const render = inject<any>("render");

const parsedUserInfo =
  typeof userInfo.value === "string"
    ? JSON.parse(userInfo.value)
    : userInfo.value;

// Computed property to get initials
const initials = computed(() => {
  const userDetails = parsedUserInfo;
  const firstName = userDetails.customerInfo.firstName || "";
  const lastName = userDetails.customerInfo.lastName || "";
  return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
});

// methods
// const fetchCompany = async () => {
//   loading.value = true;
//   const response = await request(companyStore.index(), loading);

//   const successResponse = handleSuccess(response);

//   if (successResponse && typeof successResponse !== "undefined") {
//     companies.value = successResponse.data.data;
//     // console.log(successResponse.data.data)
//     logged_in_company.value = successResponse.data.data.find(
//       (element: any) => element.is_default == true
//     );
//     // always make the defualt company appear first
//     companies.value.sort((a, b) => {
//       return b.is_default - a.is_default;
//     });
//   }
// };
// fetchCompany();

// const switchCompany = async (id: string, name: string) => {
//   loading.value = true;
//   const response = await request(companyStore.switch(id), loading);
//   handleError(response, userStore);
//   const successResponse = handleSuccess(response, showSuccess);

//   if (successResponse && typeof successResponse !== "undefined") {
//     responseData.value.message = response.data.message;
//     fetchCompany();
//     render.value = true;
//     logged_in_company.value = successResponse.data.data.find(
//       (element: any) => element.is_default == true
//     );
//   }
// };

defineExpose({
  // fetchCompany,
  loading,
  request,
  handleSuccess,
  companies,
});
</script>
<template>
  <div
    class="bg-white dark:bg-black-dark w-64+4 px-3+1 py-4+1 h-full fixed left-0 top-0 z-10"
  >
    <successAlert
      :showSuccess="showSuccess"
      @closeSuccess="showSuccess = false"
      v-if="showSuccess == true"
    >
      <template #otherMessage>CLOSE</template>
      {{ responseData.message }}</successAlert
    >

    <div class="flex items-center space-x-10 px-3">
      <a href="/dashboard">
        <ILogo
          class="md:hidden block"
          :color="browserStore.$state.isDarkModeOn === true ? '' : '#222222'"
        />
        <img src="/images/png/logo.png" alt="logo" class="md:block hidden" />
      </a>
    </div>
    <div class="relative">
      <div
        class="bg-grey-100 relative dark:bg-grey-dark flex items-center space-x-3 mt-8-2 text-sm px-4 py-3 rounded-lg"
      >
        <div
          class="w-8 h-8 text-center bg-white dark:bg-grey-dark rounded-full uppercase flex items-center justify-center dark:text-white"
        >
          {{ initials }}
        </div>
        <div class="space-y-2 flex-grow">
          <!-- <div class="flex items-center justify-between">
            <span class="dark:text-white">Platoon</span>
            <span @click="showDropDown = !showDropDown" class="cursor-pointer">
              <IArrowDown />
            </span>
          </div> -->
          <div class="flex items-center space-x-2">
            <span class="dark:text-white w-full capitalise">
              {{
                JSON.parse(userInfo).customerInfo.organisationName
                  ? JSON.parse(userInfo)
                      .customerInfo.organisationName.charAt(0)
                      .toUpperCase() +
                    JSON.parse(userInfo).customerInfo.organisationName.slice(1)
                  : ""
              }}
            </span>
            <span class="text-green bg-green-rgba py-0.5-1 text-xs uppercase"
              >Admin</span
            >
            <!-- <span @click="showDropDown = !showDropDown" class="cursor-pointer">
              <IArrowDown />
            </span> -->
          </div>
          <div class="flex items-center justify-between">
            <span class="text-[12px] text-black/40">{{
              logged_in_company?.name
            }}</span>
          </div>
        </div>
      </div>
      <!-- drop down -->

      <div class="absolute w-full">
        <!-- <general
          v-if="showDropDown == true"
          class="max-h-80 h-auto overflow-auto scrollbar-hide"
        >
          <spinner v-if="loading == true" class="flex justify-center" />

          <div v-else> -->
        <!-- <div class="space-y-7" v-if="companies[0]">
              <div
                v-for="company in companies"
                :key="company"
                class="text-xs text-black-200 cursor-pointer"
                @click="switchCompany(company.id, company.name)"
              >
                <div class="flex" v-if="company.is_default == true">
                  <ButtonLightBlue
                    color="text-[#003b3d]"
                    class="max-w-full w-full"
                    @click="switchCompany(company.id, company.name)"
                  >
                    <template v-slot:placeholder>{{ company.name }}</template>
                  </ButtonLightBlue>
                </div>
                <span v-else>
                  {{ company.name }}
                </span>
              </div>
              <p
                class="text-[#003b3d] font-normal text-xs cursor-pointer"
                @click="router.push({ name: 'dashboard.company.settings' })"
              >
                + Add new Company
              </p>
            </div> -->

        <!--  -->
        <!-- <EmptyState v-else class="h-auto">
              <template #icon>
                <ILinkBreak />
              </template>
              <template #heading> Companies </template>
              <template #desc>
                All Companies related to account will be displayed her. Click on
                the “create company”
                <br />
                to get started
              </template>
              <template #actions>
                <button
                  @click="router.push({ name: 'dashboard.company.settings' })"
                  class="bg-[#003b3d] text-white px-4+1 py-2.5+1 rounded-full text-sm"
                >
                  Create Company
                </button>
              </template>
            </EmptyState> -->
        <!-- </div>
        </general> -->
      </div>
    </div>
    <div class="mt-11">
      <ul>
        <li>
          <router-link to="/dashboard/home">
            <div class="side-nav-link cursor-pointer">
              <div class="nav-link">
                <span>
                  <IHome
                    :color="
                      isActiveRoute('dashboard.home') ? '#003b3d' : '#626669'
                    "
                  />
                </span>
                <span
                  :class="[
                    isActiveRoute('dashboard.home')
                      ? 'text-[#003b3d] font-medium'
                      : 'text-black-200',
                  ]"
                  >Home</span
                >
              </div>
            </div>
          </router-link>
        </li>
        <li>
          <router-link to="/dashboard/companies">
            <div class="side-nav-link cursor-pointer">
              <div class="nav-link">
                <span>
                  <IBuildings
                    :color="
                      isActiveRoute('dashboard.companies')
                        ? '#003b3d'
                        : '#626669'
                    "
                  />
                </span>
                <span
                  :class="[
                    isActiveRoute('dashboard.companies')
                      ? 'text-[#003b3d] font-medium'
                      : 'text-black-200',
                  ]"
                  >Companies</span
                >
              </div>
            </div>
          </router-link>
        </li>
        <!-- <li id="step-1">
          <router-link to="/dashboard/employees">
            <div class="side-nav-link">
              <div class="nav-link">
                <span>
                  <IUserThree
                    :color="
                      isActiveRoute('dashboard.employees')
                        ? '#003b3d'
                        : '#626669'
                    "
                  />
                </span>
                <span
                  :class="[
                    isActiveRoute('dashboard.employees')
                      ? 'text-[#003b3d] font-medium'
                      : 'text-black-200',
                  ]"
                  >Employees</span
                >
              </div>
            </div>
          </router-link>
        </li> -->

        <!-- <li>
          <router-link to="/dashboard/payroll">
            <div class="side-nav-link">
              <div class="nav-link">
                <span>
                  <IPayroll
                    :color="
                      isActiveRoute('dashboard.payroll') ? '#003b3d' : '#626669'
                    "
                  />
                </span>
                <span
                  :class="[
                    isActiveRoute('dashboard.payroll')
                      ? 'text-[#003b3d] font-medium'
                      : 'text-black-200',
                  ]"
                  >Payroll</span
                >
              </div>
            </div>
          </router-link>
        </li> -->

        <!-- <li>
          <router-link to="/dashboard/subscription">
            <div class="side-nav-link">
              <div class="nav-link">
                <span class="w-6 h-6">
                  <img
                    src="/images/svg/svg8.svg"
                    alt="file text"
                    :color="
                      isActiveRoute('dashboard.subscription')
                        ? '#003b3d'
                        : '#626669'
                    "
                  />
                </span>
                <span
                  :class="[
                    isActiveRoute('dashboard.subscription')
                      ? 'text-[#003b3d] font-medium'
                      : 'text-black-200',
                  ]"
                  >Subscription</span
                >
              </div>
            </div>
          </router-link>
        </li> -->
        <!-- <li>
          <router-link to="/dashboard/health/existing">
            <div class="side-nav-link">
              <div class="nav-link">
                <span>
                  <IHealth
                    :color="
                      isActiveRoute('dashboard.health') ? '#003b3d' : '#626669'
                    "
                  />
                </span>
                <span
                  :class="[
                    isActiveRoute('dashboard.health')
                      ? 'text-[#003b3d] font-medium'
                      : 'text-black-200',
                  ]"
                  >Health Insurance</span
                >
              </div>
            </div>
          </router-link>
        </li> -->

        <!-- <li>
          <router-link to="/dashboard/pension/existing">
            <div class="side-nav-link">
              <div class="nav-link">
                <span>
                  <IUmbrella
                    :color="
                      isActiveRoute('dashboard.pension') ? '#003b3d' : '#626669'
                    "
                  />
                </span>
                <span
                  :class="[
                    isActiveRoute('dashboard.pension')
                      ? 'text-[#003b3d] font-medium'
                      : 'text-black-200',
                  ]"
                  >Pension</span
                >
              </div>
            </div>
          </router-link>
        </li> -->

        <!-- <li>
          <router-link to="/dashboard/tax-compliance">
            <div class="side-nav-link">
              <div class="nav-link">
                <span>
                  <IScales
                    :color="
                      isActiveRoute('dashboard.tax-compliance')
                        ? '#003b3d'
                        : '#626669'
                    "
                  />
                </span>
                <span
                  :class="[
                    isActiveRoute('dashboard.tax-compliance')
                      ? 'text-[#003b3d] font-medium'
                      : 'text-black-200',
                  ]"
                  >Tax & NHF</span
                >
              </div>
            </div>
          </router-link>
        </li> -->
        <li>
          <router-link to="/dashboard/manage-users/all-users">
            <div class="side-nav-link">
              <div class="nav-link">
                <span>
                  <IIdCard
                    :color="
                      isActiveRoute('dashboard.manage.users')
                        ? '#003b3d'
                        : '#626669'
                    "
                  />
                </span>
                <span
                  :class="[
                    isActiveRoute('dashboard.manage.users')
                      ? 'text-[#003b3d] font-medium'
                      : 'text-black-200',
                  ]"
                  >Manage Users</span
                >
              </div>
            </div>
          </router-link>
        </li>

        <li>
          <router-link to="/dashboard/myprofile">
            <div class="side-nav-link">
              <div class="nav-link">
                <span>
                  <IUserGear
                    :color="
                      isActiveRoute('dashboard.myprofile')
                        ? '#003b3d'
                        : '#626669'
                    "
                  />
                </span>
                <span
                  :class="[
                    isActiveRoute('dashboard.myprofile')
                      ? 'text-[#003b3d] font-medium'
                      : 'text-black-200',
                  ]"
                  >Profile</span
                >
              </div>
            </div>
          </router-link>
        </li>

        <li>
          <router-link to="/dashboard/settings">
            <div class="side-nav-link">
              <div class="nav-link">
                <span>
                  <ISettings
                    :color="
                      isActiveRoute('dashboard.settings')
                        ? '#003b3d'
                        : '#626669'
                    "
                  />
                </span>
                <span
                  :class="[
                    isActiveRoute('dashboard.settings')
                      ? 'text-[#003b3d] font-medium'
                      : 'text-black-200',
                  ]"
                >
                  Settings</span
                >
              </div>
            </div>
          </router-link>
        </li>
        <!-- <li class="border-t border-black/10 text-black/10 opacity-60">
          <div>
            <div class="side-nav-link">
              <div class="nav-link flex">
                <span>
                  <IScales />
                </span>
                <span class="block w-[70px]">Tax & NHF</span
                ><span class="text-[8px] text-green">Coming Soon</span>
              </div>
            </div>
          </div>
        </li> -->
        <!-- <li class="text-black/10 opacity-60">
          <div>
            <div class="side-nav-link">
              <div class="nav-link flex">
                <span>
                  <IUmbrella />
                </span>
                <span class="block w-[70px]">Pension</span
                ><span class="text-[8px] text-green">Coming Soon</span>
              </div>
            </div>
          </div>
        </li> -->
      </ul>
    </div>
  </div>
</template>
