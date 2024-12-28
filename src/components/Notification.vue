<script lang="ts" setup>
import { INotification } from "../core/icons";
import { ComponentPosition as NotificationPosition } from "../interface/enums.interface";

withDefaults(
  defineProps<{
    position?: NotificationPosition;
  }>(),
  {
    position: NotificationPosition.HOMEPAGE,
  }
);
</script>
<template class="">
  <div class="dropdown dropdown-end">
    <label
      tabindex="0"
      class="relative flex items-center bg-grey-100 lg:p-2.5 p-3.5 rounded-full space-x-3 cursor-pointer"
      :class="[
        position === NotificationPosition.HOMEPAGE
          ? 'bg-clip-rgba text-white'
          : 'bg-grey-100',
      ]"
    >
      <span>
        <INotification
          :color="
            position === NotificationPosition.HOMEPAGE ? 'white' : 'black'
          "
        />
      </span>
      <span class="font-semimedium text-sm lg:block"
        >Your notifications</span
      >
      <span
        class="text-xxs p-1 rounded-full lg:relative absolute lg:top-[0px] lg:right-[0px] top-[-4px] right-[-13px]"
        :class="[
          position === NotificationPosition.HOMEPAGE
            ? 'text-white bg-red'
            : 'text-red bg-red-rgba',
        ]"
        >99+</span
      >
    </label>

    <!-- content -->
    <ul
      tabindex="0"
      class="dropdown-content menu p-6 shadow-rgba bg-white rounded-lg lg:w-[480px] mt-4 divide-y divide-grey-200"
      :class="[
        position === NotificationPosition.HOMEPAGE ? '-left-56' : '-left-44',
      ]"
    >
      <li>
        <div class="flex flex-col items-start space-y-1 p-4">
          <a class="text-sm text-black font-bold">Title of Notification</a>
          <p class="text-sm text-gray-rgba-4 font-semimedium">
            Description of the notification in full, with no truncation. This
            should be used for platform update or things that arent really long.
            Maybe we’d discuss what this feature is really needed
          </p>
        </div>
      </li>
      <li>
        <div class="flex flex-col items-start space-y-1 p-4">
          <a class="text-sm text-black font-bold">Title of Notification</a>
          <p class="text-sm text-gray-rgba-4 font-semimedium">
            Description of the notification in full, with no truncation. This
            should be used for platform update or things that arent really long.
            Maybe we’d discuss what this feature is really needed
          </p>
        </div>
      </li>
      <li>
        <div class="flex flex-col items-start space-y-1 p-4">
          <a class="text-sm text-black font-bold">Title of Notification</a>
          <p class="text-sm text-gray-rgba-4 font-semimedium">
            Description of the notification in full, with no truncation. This
            should be used for platform update or things that arent really long.
            Maybe we’d discuss what this feature is really needed
          </p>
        </div>
      </li>
    </ul>
  </div>
</template>
