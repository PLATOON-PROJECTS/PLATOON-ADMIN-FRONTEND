<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { NotificationItem } from "src/service/notification/interface/notification.interface";
import INotification from "../components/icons/INotification.vue";
import { ComponentPosition as NotificationPosition } from "../interface/enums.interface";
import { useNotificationStore } from "../store";

const props = withDefaults(
  defineProps<{
    position?: NotificationPosition;
  }>(),
  {
    position: NotificationPosition.HOMEPAGE,
  }
);

const notifications = ref<NotificationItem[]>([]);
const notificationStore = useNotificationStore();
const router = useRouter();
const userId = Number(localStorage.getItem("userId"));

onMounted(async () => {
  if (!userId) {
    console.warn("UserId not found in localStorage");
    return;
  }

  try {
    const result = await notificationStore.getNotifications(userId, 10, 1);
    notifications.value = result.data.pageItems;
  } catch (err) {
    console.error("Error fetching notifications:", err);
  }
});

// ✅ Handler for click
function handleNotificationClick(item: NotificationItem) {
  console.log("Clicked:", item);
  if (item.subject?.toLowerCase().trim() === "kyc" && item.organisationId) {
    console.log(
      "Routing to:",
      `/dashboard/company-settings/${item.organisationId}/verification`
    );
    router.push(
      `/dashboard/company-settings/${item.organisationId}/verification`
    );
  } else {
    console.log("No match for KYC or no organisationId");
  }
}
</script>

<template>
  <div class="dropdown dropdown-end">
    <!-- Trigger -->
    <label
      tabindex="0"
      class="relative flex items-center p-3 rounded-full cursor-pointer transition hover:bg-gray-100"
      :class="[
        props.position === NotificationPosition.HOMEPAGE
          ? 'bg-clip-rgba text-white'
          : 'bg-white border border-gray-200',
      ]"
    >
      <INotification
        :color="
          props.position === NotificationPosition.HOMEPAGE ? 'white' : 'black'
        "
      />
      <span class="sr-only">Notifications</span>
      <span
        class="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 text-black text-xs font-semibold px-1.5 py-0.5 rounded-full"
      >
        {{ notifications.length }}
      </span>
    </label>

    <!-- Dropdown -->
    <div
      tabindex="0"
      class="dropdown-content w-80 lg:w-[400px] mt-4 bg-white shadow-lg rounded-xl overflow-hidden ring-1 ring-black/5"
      :class="[
        props.position === NotificationPosition.HOMEPAGE
          ? '-left-56'
          : '-left-44',
      ]"
    >
      <div
        v-if="notifications.length === 0"
        class="p-6 text-sm text-gray-500 text-center"
      >
        You have no notifications.
      </div>
      <ul v-else class="">
        <li
          v-for="(item, idx) in notifications"
          :key="item.id"
          class="hover:bg-gray-50 transition cursor-pointer"
          :class="{
            'border-b border-[#EDEDED]': idx !== notifications.length - 1,
          }"
          @click="handleNotificationClick(item)"
        >
          <div class="flex items-start gap-3 p-4">
            <!-- Status dot -->
            <div class="mt-1">
              <span
                v-if="!item.isRead"
                class="w-2 h-2 rounded-full bg-blue-500 block"
              ></span>
              <span
                v-else
                class="w-2 h-2 rounded-full bg-gray-300 block"
              ></span>
            </div>

            <!-- Content -->
            <div class="flex-1">
              <h4 class="text-sm font-semibold text-gray-800 mb-1">
                {{ item.subject }}
              </h4>
              <p class="text-sm text-gray-600 leading-snug mb-2">
                {{ item.body }}
              </p>
              <time class="text-xs text-gray-400">
                {{ new Date(item.createdAt).toLocaleString() }}
              </time>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
