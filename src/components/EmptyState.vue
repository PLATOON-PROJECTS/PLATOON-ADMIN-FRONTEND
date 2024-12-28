<script setup lang="ts">
import { IUserThree } from "../core/icons";
</script>
<template>
    <div class="w-full h-[500px] flex flex-col items-center justify-center space-y-6">
        <span class="bg-grey-100 p-3 rounded-full h-12 w-12 flex items-center justify-center">
            <slot name="icon"></slot>
        </span>
        <div class="text-center space-y-2">
            <h2 class="text-black-100 font-medium text-base">
                <slot name="heading"></slot>
            </h2>
            <p class="text-sm text-black-100 opacity-80">
                <slot name="desc"></slot>
            </p>
        </div>
        <div class="flex items-center space-x-4">
            <slot name="actions"></slot>
        </div>
    </div>
</template>

<style>

</style>
