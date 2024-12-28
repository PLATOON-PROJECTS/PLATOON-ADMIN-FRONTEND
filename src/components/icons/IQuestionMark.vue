<script lang="ts" setup>
withDefaults(defineProps<{ color?: string }>(), {
    color: 'black'
})
</script>
<template>
    <svg width="9" height="15" viewBox="0 0 9 15" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M4.5 15C5.32843 15 6 14.3284 6 13.5C6 12.6716 5.32843 12 4.5 12C3.67157 12 3 12.6716 3 13.5C3 14.3284 3.67157 15 4.5 15Z"
            :fill="color" />
        <path
            d="M4.5 9V8C5.19223 8 5.86892 7.79473 6.4445 7.41014C7.02007 7.02556 7.46867 6.47894 7.73358 5.83939C7.99848 5.19985 8.0678 4.49612 7.93275 3.81719C7.7977 3.13825 7.46436 2.51461 6.97487 2.02513C6.48539 1.53564 5.86175 1.2023 5.18282 1.06725C4.50388 0.932205 3.80015 1.00152 3.16061 1.26642C2.52107 1.53133 1.97444 1.97993 1.58986 2.55551C1.20527 3.13108 1 3.80777 1 4.5"
            :stroke="color" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
</template>