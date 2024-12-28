<template>
    <div class="px-6 mt-8 flex items-center justify-between">
      <span class="opacity-50 text-sm font-semimedium">
        Showing {{ startItem }}-{{ endItem }} of {{ totalItems }} items
      </span>
  
      <div class="flex items-center space-x-2">
        <button
          v-for="page in totalPages"
          :key="page"
          @click="goToPage(page)"
          :class="{
            'text-white bg-[#003b3d] text-sm font-semibold w-8 h-8 flex items-center justify-center rounded-full': currentPage === page,
            'text-sm w-8 h-8 flex items-center justify-center rounded-full border opacity-50': currentPage !== page,
          }"
        >
          {{ page }}
        </button>
      </div>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { defineProps, defineEmits, computed } from 'vue';
  
  const props = defineProps({
    currentPage: {
      type: Number,
      required: true,
    },
    totalPages: {
      type: Number,
      required: true,
    },
    pageSize: {
      type: Number,
      required: true,
    },
    totalItems: {
      type: Number,
      required: true,
    },
  });
  
  const emit = defineEmits(['updatePage']);
  
  const startItem = computed(() => (props.currentPage - 1) * props.pageSize + 1);
  const endItem = computed(() => Math.min(props.currentPage * props.pageSize, props.totalItems));
  
  const goToPage = (page: number) => {
    if (page >= 1 && page <= props.totalPages) {
      emit('updatePage', page);
    }
  };
  </script>
  
  <style scoped>
  /* Add any additional styles if needed */
  </style>
  