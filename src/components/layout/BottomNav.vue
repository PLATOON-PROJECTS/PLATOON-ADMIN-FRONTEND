<script lang="ts" setup>
import { IIdCard, IPayroll, IHome, IMore, IUserThree } from "../../core/icons";
import { ref } from "vue";
import MoreNavItems from "../layout/MoreNavItems.vue";
import { isActiveRoute } from "../../core/router";
// variables
const showMoreMenu = ref(false);
</script>
<template>
  <div class="bg-white dark:bg-black-dark text-xs z-40 fixed bottom-0">
    <MoreNavItems
      v-if="showMoreMenu == true"
      @closeMenu="showMoreMenu = false"
    />
    <div>
      <ul class="grid grid-cols-5">
        <li>
          <router-link to="/dashboard/home">
            <div class="side-nav-link cursor-pointer">
              <div class="flex flex-col items-center h-10 justify-between">
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
        <li id="sm-step-1">
          <router-link to="/dashboard/employees">
            <div class="side-nav-link">
              <div class="flex flex-col items-center h-10 justify-between">
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
            <div class="side-nav-link">
              <div class="flex flex-col items-center h-10 justify-between">
                <span>
                  <IPayroll
                    :color="
                      isActiveRoute('dashboard.payroll') ? '#0960CD' : '#626669'
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

        <li>
          <router-link to="/dashboard/manage-users/all-users">
            <div class="side-nav-link">
              <div class="flex flex-col items-center h-10 justify-between">
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
                  >Users</span
                >
              </div>
            </div>
          </router-link>
        </li>

        <li>
          <div class="side-nav-link">
            <div
              class="flex flex-col items-center h-10 justify-between"
              @click="showMoreMenu = true"
            >
              <span>
                <IMore :color="'#0960CD'" />
              </span>
              <span class="text-black-200">More</span>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
