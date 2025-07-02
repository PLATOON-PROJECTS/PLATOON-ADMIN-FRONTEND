<script lang="ts" setup>
import {
  ISearch,
  IGridMenu,
  IQuestionMark,
  ILogo,
  IUserGear,
} from "../../core/icons";
import { ComponentPosition } from "../../interface/enums.interface";
import Notification from "../Notification.vue";
import DarkModeToggle from "../DarkModeToggle.vue";
import { onMounted } from "vue";
import { useUserStore } from "../../store/index";

const userStore = useUserStore();

onMounted(() => {
  const userId = Number(localStorage.getItem("userId"));
  if (userId) {
    userStore.fetchUserProfilePhoto(userId).then(() => {
      console.log("Loaded:", userStore.profilePhotoUrl);
    });
  }
});
</script>
<template>
  <nav
    class="px-6 py-3-1 bg-white dark:bg-black-dark w-full flex items-center justify-between sticky top-0 z-40"
  >
    <!-- search -->
    <a href="/dashboard" class="block lg:hidden">
      <ILogo :color="'#222222'" />
    </a>
    <div class="lg:flex hidden items-center space-x-6">
      <!-- <span>
        <ISearch />
      </span> -->
      <input
        type="search"
        class="focus:outline-none placeholder:text-black-200 placeholder:text-sm hidden"
        placeholder="Search employee, actions etc."
      />
    </div>

    <!--  -->
    <div class="flex items-center lg:space-x-6 space-x-3">
      <DarkModeToggle :position="ComponentPosition.TOPNAV" />
      <button
        class="bg-grey-100 p-3 rounded-full h-11 w-11 flex items-center justify-center"
      >
        <IQuestionMark />
      </button>

      <!-- notification -->
      <Notification :position="ComponentPosition.TOPNAV" />
      <!--  -->

      <div class="lg:flex items-center space-x-6 hidden">
        <!-- <IGridMenu /> -->
        <div
          class="relative cursor-pointer bg-[#ededed] h-[40px] w-[40px] rounded-full flex items-center justify-center overflow-hidden"
          @click="$emit('closeProfileAction')"
        >
          <template v-if="userStore.profilePhotoUrl">
            <img
              :src="userStore.profilePhotoUrl"
              alt="Profile Photo"
              class="w-full h-full rounded-full object-cover"
            />
          </template>
          <template v-else>
            <div
              class="w-full h-full rounded-full bg-gray-200 flex items-center justify-center"
            >
              <span class="text-gray-500 text-xs">No Photo</span>
            </div>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>
