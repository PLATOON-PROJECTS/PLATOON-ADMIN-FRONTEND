<template>
  <section class="px-8 py-2 space-y-8">
    <!-- Heading & Subheading -->
    <div>
      <h1 class="text-base font-medium text-gray-800">Subscription Plan</h1>
      <p class="text-[#626669A3] text-sm">
        Manage your subscription and payment details
      </p>
    </div>

    <!-- Cards Row -->
    <div class="flex items-center justify-between w-full gap-6">
      <!-- Standard Plan Card -->
      <div
        class="bg-white p-6 rounded-lg shadow flex flex-col justify-between w-[45%]"
      >
        <div class="flex justify-between items-start">
          <div class="flex flex-col gap-2">
            <h2
              class="text-base font-medium text-gray-800 flex items-center gap-2"
            >
              Standard Plan
              <span
                class="text-[#46A754] text-xs font-medium bg-[#F6F7F9] px-2 py-0.5 rounded-full"
                >Monthly</span
              >
            </h2>
            <p class="text-base text-[#727171] font-light mt-1">
              For small teams and startups.
            </p>
          </div>
          <div class="">
            <p class="text-2xl font-medium text-gray-800">
              ₦5,000 <span class="text-base text-[#727171]">/per month</span>
            </p>
          </div>
        </div>
        <!-- Progress Indicator -->
        <div class="mt-4 w-full">
          <div class="flex justify-end text-sm text-gray-500 mb-1">
            <span>Day {{ daysUsed }} of {{ totalDays }}</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div
              class="h-2 rounded-full transition-all duration-300"
              :style="{ width: progressWidth, backgroundColor: '#46A754' }"
            ></div>
          </div>
        </div>
      </div>

      <!-- Processing Fee Card -->
      <div
        class="bg-[#F6F7F9] p-6 rounded-lg shadow flex flex-col justify-between w-[25%]"
      >
        <div class="flex flex-col gap-2 items-start">
          <div>
            <h2 class="text-sm font-semibold text-[#306651]">Processing Fee</h2>
          </div>
          <div class="f">
            <p class="text-2xl font-medium text-gray-800">
              ₦500 <span class="text-base text-[#727171]">/per month</span>
            </p>
          </div>
        </div>
        <!-- Image + Manage link -->
        <div class="bg-white gap-3 mt-4 rounded-lg">
          <button
            class="flex text-sm gap-2 items-center mx-auto py-2 text-[#1F1F1F] font-medium hover:underline"
          >
            <ISettings color="#306651" />
            Manage Subscription
          </button>
        </div>
      </div>
    </div>

    <!-- Billing History Table -->
    <div class="space-y-2">
      <h2 class="text-base font-medium text-black">Billing History</h2>
      <p class="text-sm text-[#626669A3]">Download previous invoices.</p>
      <div class="overflow-x-auto">
        <table class="min-w-full bg-white rounded-lg overflow-hidden">
          <thead
            class="bg-gray-100 text-left text-sm font-medium text-[#626669]"
          >
            <tr>
              <th class="px-4 py-3">Invoice</th>
              <th class="px-4 py-3">Plan</th>
              <th class="px-4 py-3">Amount</th>
              <th class="px-4 py-3">Duration</th>
              <th class="px-4 py-3">Start Date</th>
              <th class="px-4 py-3">Expiry Date</th>
              <th class="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody class="text-sm text-[#222222] divide-y divide-[#EEEEEE]">
            <tr v-for="n in 5" :key="n">
              <td class="flex items-center gap-1 px-4 py-3">
                <IFileText size="20px" /> INV-000{{ n }}
              </td>
              <td class="px-4 py-3">Standard</td>
              <td class="px-4 py-3">₦80,000</td>
              <td class="px-4 py-3">Monthly</td>
              <td class="px-4 py-3">Jan 1, 2024</td>
              <td class="px-4 py-3">Jan 31, 2024</td>
              <td class="px-4 py-3 text-left">
                <div
                  class="inline-flex items-start justify-center bg-[#F0F2F2] px-3 py-1 rounded-full"
                >
                  <button class="text-sm text-[#1F1F1F] hover:underline">
                    Download
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ISettings, IFileText } from "../../../core/icons";
import { computed, ref } from "vue";

const daysUsed = ref(12);
const totalDays = ref(30);

// Calculate percent of days used
const progressWidth = computed(() => {
  const percent = Math.min((daysUsed.value / totalDays.value) * 100, 100);
  return `${percent}%`;
});
</script>
