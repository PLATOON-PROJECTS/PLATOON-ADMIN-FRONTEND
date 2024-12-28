<script lang="ts" setup>
withDefaults(defineProps<{ color?: string }>(), {
    color: '#626669'
})
</script>
<template>
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11.875 8.75H15" :stroke="color" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M11.875 11.25H15" :stroke="color" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" />
        <path
            d="M7.19519 11.25C8.23072 11.25 9.07019 10.4105 9.07019 9.375C9.07019 8.33947 8.23072 7.5 7.19519 7.5C6.15966 7.5 5.32019 8.33947 5.32019 9.375C5.32019 10.4105 6.15966 11.25 7.19519 11.25Z"
            :stroke="color" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" />
        <path
            d="M4.77332 13.125C4.911 12.5873 5.22375 12.1106 5.66226 11.7702C6.10077 11.4299 6.64008 11.2451 7.19519 11.2451C7.7503 11.2451 8.28962 11.4299 8.72812 11.7702C9.16663 12.1106 9.47938 12.5873 9.61707 13.125"
            :stroke="color" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" />
        <path
            d="M16.875 3.75H3.125C2.77982 3.75 2.5 4.02982 2.5 4.375V15.625C2.5 15.9702 2.77982 16.25 3.125 16.25H16.875C17.2202 16.25 17.5 15.9702 17.5 15.625V4.375C17.5 4.02982 17.2202 3.75 16.875 3.75Z"
            :stroke="color" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" />
    </svg>

</template>