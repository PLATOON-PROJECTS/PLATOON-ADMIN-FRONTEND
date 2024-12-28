<script lang="ts" setup>
withDefaults(defineProps<{ color?: string }>(), {
    color: '#626669'
})
</script>
<template>
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M8.4375 12.5C11.0263 12.5 13.125 10.4013 13.125 7.8125C13.125 5.22367 11.0263 3.125 8.4375 3.125C5.84867 3.125 3.75 5.22367 3.75 7.8125C3.75 10.4013 5.84867 12.5 8.4375 12.5Z"
            :stroke="color" stroke-width="1.3" stroke-miterlimit="10" />
        <path
            d="M1.73444 15.6252C2.55573 14.6463 3.58144 13.8592 4.73948 13.3192C5.89753 12.7791 7.15979 12.4993 8.43756 12.4993C9.71533 12.4993 10.9776 12.7791 12.1356 13.3192C13.2937 13.8592 14.3194 14.6463 15.1407 15.6252"
            :stroke="color" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" />
        <path
            d="M17.1875 11.875C17.8779 11.875 18.4375 11.3154 18.4375 10.625C18.4375 9.93464 17.8779 9.375 17.1875 9.375C16.4971 9.375 15.9375 9.93464 15.9375 10.625C15.9375 11.3154 16.4971 11.875 17.1875 11.875Z"
            :stroke="color" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M17.1875 9.375V8.4375" :stroke="color" stroke-width="1.3" stroke-linecap="round"
            stroke-linejoin="round" />
        <path d="M16.1015 10L15.2968 9.53125" :stroke="color" stroke-width="1.3" stroke-linecap="round"
            stroke-linejoin="round" />
        <path d="M16.1015 11.25L15.2968 11.7188" :stroke="color" stroke-width="1.3" stroke-linecap="round"
            stroke-linejoin="round" />
        <path d="M17.1875 11.875V12.8125" :stroke="color" stroke-width="1.3" stroke-linecap="round"
            stroke-linejoin="round" />
        <path d="M18.2734 11.25L19.0781 11.7188" :stroke="color" stroke-width="1.3" stroke-linecap="round"
            stroke-linejoin="round" />
        <path d="M18.2734 10L19.0781 9.53125" :stroke="color" stroke-width="1.3" stroke-linecap="round"
            stroke-linejoin="round" />
    </svg>
</template>