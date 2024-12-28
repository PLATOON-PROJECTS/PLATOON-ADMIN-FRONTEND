<script lang="ts" setup>
import { ISearch, IGridMenu, IQuestionMark, ILogo, IUserGear, } from "../../core/icons";
import { ComponentPosition } from "../../interface/enums.interface";
import Notification from "../Notification.vue";
import DarkModeToggle from "../DarkModeToggle.vue";
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
      <span>
        <ISearch />
      </span>
      <input
        type="search"
        class="focus:outline-none placeholder:text-black-200 placeholder:text-sm"
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
          class="relative cursor-pointer bg-[#ededed] h-[40px] w-[40px] rounded-full flex items-center justify-center"
          @click="$emit('closeProfileAction')"
        >
          <IUserGear />
          <span
            class="absolute right-0 top-7 h-3 w-3 rounded-full bg-green border-2 border-white"
          ></span>
        </div>
      </div>
    </div>
  </nav>
</template>
