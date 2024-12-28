<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";

import ButtonBlue from "../components/buttons/ButtonBlue.vue";
import { IArrowLeftTail } from "../core/icons";

// initialize router and route
const route = useRoute();
const router = useRouter();
</script>

<template>
  <div class="px-6 py-9">
    <div>
      <div class="space-y-2 bg-white px-6 pt-10">
        <div
          class="flex justify-between whitespace-nowrap overflow-auto scrollbar-hide lg:space-x-0 space-x-3"
        >
          <div class="flex space-x-4">
            <IArrowLeftTail />
            <div class="space-y-1">
              <h3 class="font-bold text-2xl">Approver access</h3>
              <p class="text-black-200 font-semimedium text-sm">
                Manage admin permission
              </p>
            </div>
          </div>
          <div>
            <ButtonBlue>
              <template v-slot:placeholder>Save Changes</template>
            </ButtonBlue>
          </div>
        </div>
        <div
          class="bg-white whitespace-nowrap overflow-auto scrollbar-hide px- items-center text-black-200 font-semimedium cursor-pointer text-sm space-x-8"
        >
          <div class="flex space-x-6">
            <span
              @click="
                router.push({
                  path: '/dashboard/manage-permission/employee',
                })
              "
              :class="
                '/dashboard/manage-permission/employee' === route.path &&
                ' border-b-2  text-[#003b3d]'
              "
              class="py-6"
              >Employees</span
            >

            <span
              @click="
                router.push({
                  path: '/dashboard/manage-permission/payroll',
                })
              "
              :class="
                '/dashboard/manage-permission/payroll' === route.path &&
                'underline text-[#003b3d]'
              "
              class="py-6"
              >Payroll
            </span>
            <span
              @click="
                router.push({
                  path: '/dashboard/manage-permission/pension',
                })
              "
              :class="
                '/dashboard/manage-permission/pension' === route.path &&
                'underline text-[#003b3d]'
              "
              class="py-6"
              >Pension
            </span>
            <span
              @click="
                router.push({
                  path: '/dashboard/manage-permission/tax',
                })
              "
              :class="
                '/dashboard/manage-permission/tax' === route.path &&
                'underline text-[#003b3d]'
              "
              class="py-6"
              >Tax & NHF
            </span>
            <span
              @click="
                router.push({
                  path: '/dashboard/manage-permission/manage-user',
                })
              "
              :class="
                '/dashboard/manage-permission/manage-user' === route.path &&
                'underline text-[#003b3d]'
              "
              class="py-6"
              >Manage Users
            </span>
            <span
              @click="
                router.push({
                  path: '/dashboard/manage-permission/company-settings',
                })
              "
              :class="
                '/dashboard/manage-permission/company-settings' ===
                  route.path && 'underline text-[#003b3d]'
              "
              class="py-6"
              >Company Settings
            </span>
          </div>
        </div>
      </div>

      <!-- end of cards -->
      <router-view
        class="bg-white py-7 min-h-[80vh] w-full h-auto border-t border-grey"
      ></router-view>
    </div>
  </div>
</template>
