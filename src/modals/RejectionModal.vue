<script setup lang="ts">
import { ref, defineEmits, defineProps } from "vue";
import { useNotificationStore } from "../store/index";

const props = defineProps<{
  show: boolean;
  userId: number;
  roleId: number;
  organisationId: number;
  platoon?: boolean;
}>();

const emit = defineEmits(["close", "submitted"]);

const subject = ref("");
const reason = ref("");
const loading = ref(false);

const notificationStore = useNotificationStore();

const handleCancel = () => {
  emit("close");
  subject.value = "";
  reason.value = "";
};

const handleConfirm = async () => {
  console.log("RejectionModal handleConfirm called");
  loading.value = true;

  try {
    console.log("Creating notification with:", {
      userId: props.userId,
      roleId: props.roleId,
      organisationId: props.organisationId,
      platoon: props.platoon ?? false,
      subject: subject.value,
      body: reason.value,
    });

    await notificationStore.createNotification({
      userId: props.userId,
      roleId: props.roleId,
      organisationId: props.organisationId,
      platoon: props.platoon ?? false,
      subject: subject.value,
      body: reason.value,
    });

    console.log("Notification created successfully");
  } catch (error) {
    console.error("Error creating notification:", error);
    // Continue with document rejection even if notification fails
  }

  // Always emit submitted event to proceed with document rejection
  console.log("Emitting submitted event");
  emit("submitted");
  handleCancel();
};
</script>

<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
  >
    <div class="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
      <h2 class="text-lg font-semibold mb-4">Reject Request</h2>
      <form @submit.prevent="handleConfirm">
        <div class="mb-4">
          <label class="block text-sm font-medium mb-1" for="subject"
            >Subject</label
          >
          <input
            id="subject"
            v-model="subject"
            type="text"
            class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
            placeholder="Enter subject"
            required
          />
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium mb-1" for="reason"
            >Reason</label
          >
          <textarea
            id="reason"
            v-model="reason"
            rows="4"
            class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
            placeholder="Enter reason for rejection"
            required
          ></textarea>
        </div>
        <div class="flex justify-end gap-3 mt-6">
          <button
            type="button"
            @click="handleCancel"
            class="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="loading"
            class="px-4 py-2 rounded bg-red-600 text-black hover:bg-red-700 disabled:opacity-60"
          >
            {{ loading ? "Submitting..." : "Confirm" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
