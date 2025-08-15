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

const markAsRead = async (notificationId: number) => {
  try {
    await notificationStore.markAsRead(notificationId);
  } catch (error) {
    console.error("Failed to mark notification as read:", error);
  }
};

const markAllAsRead = async () => {
  try {
    await notificationStore.markAllAsRead(userId);
  } catch (error) {
    console.error("Failed to mark all notifications as read:", error);
  }
};

const handleNotificationClick = async (notification: NotificationItem) => {
  // Mark as read if not already read
  if (!notification.isRead) {
    await markAsRead(notification.id);
  }

  // Handle navigation for KYC notifications
  if (
    notification.subject?.toLowerCase().trim() === "kyc" &&
    notification.organisationId
  ) {
    router.push(
      `/dashboard/company-settings/${notification.organisationId}/verification`
    );
  }
};

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
</script>

<template>
  <!-- Notification Bell Fixed to Top-Right -->
  <div class="top-6 right-6 z-50 no-scrollbar">
    <!-- Bell Trigger -->
    <div class="relative group">
      <button
        class="bg-white shadow-lg rounded-full p-3 flex items-center justify-center hover:bg-gray-100 transition"
        aria-label="Notifications"
      >
        <INotification :color="'#e11d48'" class="w-6 h-6" />
        <!-- Simple red dot indicator for unread notifications -->
        <span
          v-if="notificationStore.unreadCount > 0"
          class="absolute -top-1 -right-1 w-3 h-3 bg-[#FF4C51] rounded-full border-2 border-white shadow-sm animate-pulse"
        ></span>
      </button>
      <!-- Dropdown -->
      <div
        class="hidden overflow-auto max-h-80 group-focus-within:block group-hover:block absolute right-0 mt-2 w-96 lg:w-[400px] bg-white rounded-xl shadow-2xl ring-1 ring-black/10 transition-all"
      >
        <div
          class="p-4 border-b border-[#EEEEEE] flex items-center justify-between"
        >
          <span class="font-semibold text-lg text-gray-800">Notifications</span>
          <!-- <div class="flex items-center gap-2">
            <button
              v-if="notificationStore.unreadCount > 0"
              @click="markAllAsRead"
              class="text-xs text-blue-600 hover:text-blue-800 underline"
            >
              Mark all as read
            </button>
            <span class="text-xs text-gray-400">{{
              new Date().toLocaleDateString()
            }}</span>
          </div> -->
        </div>
        <div
          v-if="notifications.length === 0"
          class="p-8 text-center text-gray-400"
        >
          <div class="mb-2">
            <INotification :color="'#e5e7eb'" class="w-8 h-8 mx-auto" />
          </div>
          <div>No notifications yet.</div>
        </div>
        <ul v-else class="divide-y divide-[#EEEEEE]">
          <li
            v-for="(item, idx) in notifications"
            :key="item.id"
            :class="[
              'flex items-start gap-3 px-4 py-5 hover:bg-gray-50 transition cursor-pointer',
              !item.isRead ? 'bg-blue-50' : '',
            ]"
            @click="handleNotificationClick(item)"
          >
            <!-- Status dot -->
            <span
              :class="[
                'w-2 h-2 rounded-full mt-2 block',
                item.isRead ? 'bg-gray-300' : 'bg-blue-500',
              ]"
            ></span>
            <!-- Content -->
            <div class="flex-1">
              <div class="flex items-center justify-between">
                <h4
                  :class="[
                    'text-sm font-semibold',
                    item.isRead ? 'text-gray-600' : 'text-gray-800',
                  ]"
                >
                  {{ item.subject }}
                  <span v-if="!item.isRead" class="text-blue-600 ml-1">•</span>
                </h4>
                <!-- View Button for KYC -->
                <div
                  v-if="
                    item.subject?.toLowerCase().trim() === 'kyc' &&
                    item.organisationId
                  "
                >
                  <button
                    class="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-semibold hover:bg-green-200 transition"
                    @click.stop="handleNotificationClick(item)"
                  >
                    View
                  </button>
                </div>
              </div>
              <p
                :class="[
                  'text-sm mt-1 mb-2',
                  item.isRead ? 'text-gray-500' : 'text-gray-700',
                ]"
              >
                {{ item.body }}
              </p>
              <time class="text-xs text-gray-400 whitespace-nowrap">
                {{
                  new Date(item.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                }}
              </time>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Show dropdown on focus or hover */
.group:focus-within .group-focus-within\:block,
.group:hover .group-hover\:block {
  display: block;
}
</style>
