<template>
  <div class="space-y-4 border border-[#EDEDED] rounded-lg p-6 bg-white">
    <h2 class="text-lg font-medium text-black border-b border-[#EDEDED]">
      Business Owner Information
    </h2>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="space-y-4">
        <div>
          <p class="text-sm text-[#A6A6A6] mb-2 font-medium">First Name</p>
          <p class="text-base text-[#444444] font-medium">
            {{ info.firstname }}
          </p>
        </div>
        <div>
          <p class="text-sm text-[#A6A6A6] mb-2 font-medium">Email</p>
          <p class="text-base text-[#444444] font-medium">{{ info.email }}</p>
        </div>
        <div>
          <p class="text-sm text-[#A6A6A6] mb-2 font-medium">BVN</p>
          <p class="text-base text-[#444444] font-medium">{{ info.bvn }}</p>
        </div>
      </div>
      <div class="space-y-4">
        <div>
          <p class="text-sm text-[#A6A6A6] mb-2 font-medium">Middle Name</p>
          <p class="text-base text-[#444444] font-medium">
            {{ info.middlename }}
          </p>
        </div>
        <div>
          <p class="text-sm text-[#A6A6A6] mb-2 font-medium">Phone Number</p>
          <p class="text-base text-[#444444] font-medium">{{ info.phone }}</p>
        </div>
        <div>
          <p class="text-sm text-[#A6A6A6] mb-2 font-medium">Country</p>
          <p class="text-base text-[#444444] font-medium">{{ info.country }}</p>
        </div>
      </div>
      <div class="space-y-4">
        <div>
          <p class="text-sm text-[#A6A6A6] mb-2 font-medium">Last Name</p>
          <p class="text-base text-[#444444] font-medium">
            {{ info.lastname }}
          </p>
        </div>
        <div>
          <p class="text-sm text-[#A6A6A6] mb-2 font-medium">Gender</p>
          <p class="text-base text-[#444444] font-medium">{{ info.gender }}</p>
        </div>
        <div>
          <p class="text-sm text-[#A6A6A6] mb-2 font-medium">Address</p>
          <p class="text-base text-[#444444] font-medium">{{ info.address }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ info: Record<string, any> }>();
</script>
