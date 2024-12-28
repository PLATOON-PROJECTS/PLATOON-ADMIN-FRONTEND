<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";

import ButtonBlue from "../../../components/buttons/ButtonBlue.vue";

// initialize router and route
const route = useRoute();
const router = useRouter();
</script>

<template>
  <div class="px-6 py-9">
    <div>
      <div class="space-y-6">
        <div class="flex justify-between">
          <div>
            <h3 class="font-bold text-2xl">Approver access</h3>
          </div>
          <div class="flex">
            <ButtonBlue>
              <template v-slot:placeholder>Save Changes</template>
            </ButtonBlue>
          </div>
        </div>
        <div
          class="bg-white py-6 h-[5rem] px-4 border-b border-grey items-center text-black-200 font-semimedium cursor-pointer text-sm space-x-8"
        >
          <div class="flex space-x-6">
            <span
              @click="
                router.push({
                  path: '/dashboard/manage-users/employee',
                })
              "
              :class="
                '/dashboard/manage-users/employee' === route.path &&
                'underline text-[#003b3d]'
              "
              class="decoration-[#003b3d] underline-offset-[30px] decoration-2"
              >Employee
            </span>

            <span
              @click="
                router.push({
                  path: '/dashboard/manage-users/payroll',
                })
              "
              :class="
                '/dashboard/manage-users/payroll' === route.path &&
                'underline text-[#003b3d]'
              "
              class="decoration-[#003b3d] underline-offset-[30px] decoration-2"
              >Payroll
            </span>
            <span
              @click="
                router.push({
                  path: '/dashboard/manage-users/pension',
                })
              "
              :class="
                '/dashboard/manage-users/pension' === route.path &&
                'underline text-[#003b3d]'
              "
              class="decoration-[#003b3d] underline-offset-[30px] decoration-2"
              >pension
            </span>
            <span
              @click="
                router.push({
                  path: '/dashboard/manage-users/tax',
                })
              "
              :class="
                '/dashboard/manage-users/tax' === route.path &&
                'underline text-[#003b3d]'
              "
              class="decoration-[#003b3d] underline-offset-[30px] decoration-2"
              >tax
            </span>

            <span
              @click="
                router.push({
                  path: '/dashboard/manage-users/manage-user',
                })
              "
              :class="
                '/dashboard/manage-users/manage-user' === route.path &&
                'underline text-[#003b3d]'
              "
              class="decoration-[#003b3d] underline-offset-[30px] decoration-2"
              >Manage Users
            </span>
            <span
              @click="
                router.push({
                  path: '/dashboard/manage-users/settings',
                })
              "
              :class="
                '/dashboard/manage-users/settings' === route.path &&
                'underline text-[#003b3d]'
              "
              class="decoration-[#003b3d] underline-offset-[30px] decoration-2"
              >Company Settings
            </span>
          </div>
        </div>
      </div>
      <!-- end of cards -->
      <router-view class="bg-white py-6 min-h-[80vh] h-auto" />
    </div>
  </div>
</template>
