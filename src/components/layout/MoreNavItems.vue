<script lang="ts" setup>
import { useBrowserStore } from "../../store";
import { ISliderDown } from "../../core/icons";
import {
  IIdCard,
  IPayroll,
  ILogo,
  IRadioChecked,
  IArrowDown,
  IHome,
  IUserGear,
  ICompanySettings,
  IUserThree,
  IScales,
  IUmbrella,
} from "../../core/icons";
import { ref } from "vue";

import { isActiveRoute } from "../../core/router";

const browserStore = useBrowserStore();

// variables
const showDropDown = ref(false);

// method
const closeMenu = () => {
  emit("closeMenu");
};
// emits
const emit = defineEmits<{ (event: "closeMenu"): void }>();
</script>
<template>
  <div class="w-screen z-50 bg-[#000000A3] ] h-screen fixed right-0 bottom-0">
    <div
      class="bg-white dark:bg-black-dark w-full px-2 py-3 text-xs h-auto fixed bottom-0 rounded-t-2xl"
    >
      <ISliderDown class="flex justify-center w-full" @click="closeMenu" />
      <div class="mt-11">
        <ul>
          <li>
            <router-link to="/dashboard/home">
              <div class="side-nav-link cursor-pointer">
                <div class="nav-link" @click="closeMenu">
                  <span>
                    <IHome
                      :color="
                        isActiveRoute('dashboard.home') ? '#0960CD' : '#626669'
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
          <li id="step-1">
            <router-link to="/dashboard/employees">
              <div class="side-nav-link" @click="closeMenu">
                <div class="nav-link">
                  <span>
                    <IUserThree
                      :color="
                        isActiveRoute('dashboard.employees')
                          ? '#0960CD'
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
          </li>
          <li>
            <router-link to="/dashboard/payroll/add-new">
              <div class="side-nav-link" @click="closeMenu">
                <div class="nav-link">
                  <span>
                    <IPayroll
                      :color="
                        isActiveRoute('dashboard.payroll')
                          ? '#0960CD'
                          : '#626669'
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
          </li>
          <!-- <li>
          <div class="side-nav-link">
            <div class="nav-link">
              <span>
                <IFirstAidKit :color="isActiveRoute('dashboard.home') ? '#0960CD' : '#626669'" />
              </span>
              <span>Health Insurance</span>
            </div>
          </div>
        </li> -->
          <li>
            <router-link to="/dashboard/pension/existing">
              <div class="side-nav-link" @click="closeMenu">
                <div class="nav-link">
                  <span>
                    <IUmbrella
                      :color="
                        isActiveRoute('dashboard.pension')
                          ? '#0960CD'
                          : '#626669'
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
          </li>
          <li>
            <router-link to="/dashboard/tax-compliance">
              <div class="side-nav-link" @click="closeMenu">
                <div class="nav-link">
                  <span>
                    <IScales
                      :color="
                        isActiveRoute('dashboard.tax-nhf')
                          ? '#0960CD'
                          : '#626669'
                      "
                    />
                  </span>
                  <span>Tax & Compliance</span>
                </div>
              </div>
            </router-link>
          </li>
          <li>
            <router-link to="/dashboard/manage-users/all-users">
              <div class="side-nav-link" @click="closeMenu">
                <div class="nav-link">
                  <span>
                    <IIdCard
                      :color="
                        isActiveRoute('dashboard.manage.users')
                          ? '#0960CD'
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
            <router-link to="/dashboard/company-settings/company-information">
              <div class="side-nav-link" @click="closeMenu">
                <div class="nav-link">
                  <span>
                    <ICompanySettings
                      :color="
                        isActiveRoute('dashboard.company.settings')
                          ? '#0960CD'
                          : '#626669'
                      "
                    />
                  </span>
                  <span
                    :class="[
                      isActiveRoute('dashboard.company.settings')
                        ? 'text-[#003b3d] font-medium'
                        : 'text-black-200',
                    ]"
                    >Company Settings</span
                  >
                </div>
              </div>
            </router-link>
          </li>
          <li>
            <router-link to="/dashboard/myprofile">
              <div class="side-nav-link" @click="closeMenu">
                <div class="nav-link">
                  <span>
                    <IUserGear
                      :color="
                        isActiveRoute('dashboard.myprofile')
                          ? '#0960CD'
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
        </ul>
      </div>
    </div>
  </div>
</template>
