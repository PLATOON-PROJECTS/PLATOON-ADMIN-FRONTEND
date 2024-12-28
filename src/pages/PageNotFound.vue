<script setup lang="ts">
import { ILinkBreak } from '../core/icons';


</script>
<template>
    <div class="w-screen h-screen bg-grey-100 flex flex-col items-center justify-center">
        <div class="flex flex-col items-center space-y-8">
            <div class="bg-white rounded-full p-7 w-[100px] h-[100px]">
                <ILinkBreak />
            </div>
            <div class="flex flex-col items-center">
                <h3 class="text-2xl font-medium">Oops</h3>
                <p class="text-sm text-[#626669] text-center opacity-[.64]">Page not found. Probably the link enetred is
                    not
                    <br>
                    valid,
                    kindly check
                    the URL and try
                    again
                </p>
            </div>
        </div>
    </div>
</template>