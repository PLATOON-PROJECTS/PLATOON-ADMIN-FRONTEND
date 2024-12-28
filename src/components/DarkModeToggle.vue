<script lang="ts" setup>
import { useDark, useToggle } from '@vueuse/core';
import { IHalfMoon } from '../core/icons';
import { ComponentPosition as DarkModeButtonPosition } from '../interface/enums.interface';
import { useBrowserStore } from '../store';

withDefaults(defineProps<{ position?: DarkModeButtonPosition }>(), {
    position: DarkModeButtonPosition.HOMEPAGE
})

const isDarkMode = useDark();
const toggleDarkMode = useToggle(isDarkMode);

const toggleDarkModeFunc = () => {
    toggleDarkMode()
    useBrowserStore().isDarkModeOn = !useBrowserStore().isDarkModeOn;
}
</script>
<template>
    <button @click="toggleDarkModeFunc()"
        :class="[position === DarkModeButtonPosition.HOMEPAGE ? 'bg-clip-rgba' : 'bg-grey-100']"
        class="p-3 rounded-full h-11 w-11 flex items-center justify-center">
        <IHalfMoon :color="position === DarkModeButtonPosition.HOMEPAGE ? 'white' : 'black'" />
    </button>
</template>