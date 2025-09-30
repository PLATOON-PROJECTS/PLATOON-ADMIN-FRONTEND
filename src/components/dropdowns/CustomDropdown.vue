<template>
  <div class="relative">
    <!-- Dropdown Button -->
    <button
      @click="toggleDropdown"
      @blur="handleBlur"
      class="w-full px-3 py-2 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300 hover:border-gray-400 transition-colors duration-200 flex items-center justify-between"
      :class="{ 'ring-2 ring-blue-500 border-blue-500': isOpen }"
    >
      <span class="text-left truncate">
        {{ selectedOption?.label || placeholder }}
      </span>
      <svg
        class="w-4 h-4 ml-2 transition-transform duration-200"
        :class="{ 'rotate-180': isOpen }"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </button>

    <!-- Dropdown Menu -->
    <div
      v-if="isOpen"
      class="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto scrollbar-hide"
    >
      <div class="py-1">
        <!-- Default option (if provided) -->
        <button
          v-if="defaultOption"
          @click="selectOption(defaultOption)"
          class="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
          :class="{
            'bg-blue-50 text-blue-600':
              selectedOption?.value === defaultOption.value,
          }"
        >
          {{ defaultOption.label }}
        </button>

        <!-- Regular options -->
        <button
          v-for="option in options"
          :key="option.value"
          @click="selectOption(option)"
          class="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
          :class="{
            'bg-blue-50 text-blue-600': selectedOption?.value === option.value,
          }"
        >
          {{ option.label }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";

interface DropdownOption {
  value: any;
  label: string;
}

interface Props {
  options: DropdownOption[];
  modelValue?: any;
  placeholder?: string;
  defaultOption?: DropdownOption;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: "Select an option",
  defaultOption: undefined,
});

const emit = defineEmits<{
  "update:modelValue": [value: any];
  change: [value: any, option: DropdownOption];
}>();

const isOpen = ref(false);

const selectedOption = computed(() => {
  if (
    props.modelValue === undefined ||
    props.modelValue === null ||
    props.modelValue === ""
  ) {
    return props.defaultOption;
  }

  const option = props.options.find((opt) => opt.value === props.modelValue);
  return option || props.defaultOption;
});

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const selectOption = (option: DropdownOption) => {
  emit("update:modelValue", option.value);
  emit("change", option.value, option);
  isOpen.value = false;
};

const handleBlur = (event: FocusEvent) => {
  // Delay closing to allow click events to register
  setTimeout(() => {
    isOpen.value = false;
  }, 150);
};

// Close dropdown when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (!target.closest(".relative")) {
    isOpen.value = false;
  }
};

// Add event listener when dropdown opens
watch(isOpen, (newValue) => {
  if (newValue) {
    document.addEventListener("click", handleClickOutside);
  } else {
    document.removeEventListener("click", handleClickOutside);
  }
});
</script>

<style scoped>
/* Hide scrollbar completely */
.scrollbar-hide {
  -ms-overflow-style: none; /* Internet Explorer 10+ */
  scrollbar-width: none; /* Firefox */
}

.scrollbar-hide::-webkit-scrollbar {
  display: none; /* Safari and Chrome */
}
</style>
