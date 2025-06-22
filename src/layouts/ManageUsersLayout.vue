<script setup lang="ts">
import { inject, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import ButtonBlue from "../components/buttons/ButtonBlue.vue";
import { onMounted } from "vue";

// initialize router and route
const route = useRoute();
const router = useRouter();

// variables
const manageUser = ref<any>();

// methods
// const fetchUsers = () => {
//   console.log("this one hhas been fired");
//   typeof manageUser.value.fetchUsers !== "undefined"
//     ? manageUser.value.fetchUsers()
//     : " ";
// };

const fetchUsers = () => {
  if (manageUser.value && typeof manageUser.value.fetchUsers === "function") {
    manageUser.value.fetchUsers();
  } else {
    console.error("fetchUsers method is not available on manageUser");
  }
};

// inject
const openCreateUser = inject("openCreateUser");

// onMounted(() => {
//   fetchUsers();
// });

// defineExpose({ fetchUsers });
</script>

<template>
  <div class="px-6 py-9">
    <div>
      <div class="space-y-6">
        <div
          class="flex justify-between whitespace-nowrap overflow-auto lg:space-x-o space-x-3 scrollbar-hide"
        >
          <h3 class="font-bold lg:text-2xl text-xl">
            User & Approval Level Managements
          </h3>
          <div class="flex">
            <ButtonBlue @click="openCreateUser = true">
              <template v-slot:placeholder>+ Add new users</template>
            </ButtonBlue>
          </div>
        </div>
        <div
          class="bg-white py-6 px-4 items-center rounded-t-lg text-black-200 cursor-pointer text-sm space-x-8"
        >
          <div class="flex space-x-6 border-b h-full border-grey pt-2">
            <span
              @click="
                router.push({
                  path: '/dashboard/manage-users/all-users',
                })
              "
              :class="
                '/dashboard/manage-users/all-users' === route.path &&
                'border-b-2 border-[#003b3d] h-full pb-7 text-[#003b3d] font-semimedium'
              "
              class="font-normal"
              >All Users</span
            >

            <span
              @click="
                router.push({
                  path: '/dashboard/manage-users/access-management',
                })
              "
              :class="
                '/dashboard/manage-users/access-management' === route.path &&
                'border-b-2 border-[#003b3d] h-full pb-7 text-[#003b3d] font-semimedium'
              "
              >Access Management
            </span>
          </div>
        </div>
      </div>

      <!-- end of cards -->
      <router-view v-slot="{ Component }">
        <component
          class="bg-white min-h-[80vh] w-full h-auto"
          ref="manageUser"
          @showAddUser="openCreateUser = true"
          :is="Component"
        ></component>
      </router-view>
    </div>
  </div>
</template>
