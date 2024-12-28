<script setup lang="ts">
import ButtonLightBlue from "../../../../components/buttons/ButtonLightBlue.vue";
import ButtonDanger from "../../../../components/buttons/ButtonDanger.vue";
</script>

<template>
  <div class="lg:w-[35%] space-y-12 pt-6">
    <div class="space-y-6">
      <div class="space-y-1">
        <p class="text-base font-medium">Disable Remittance</p>
        <p class="text-sm text-gray-rgba-3">
          A short note on what disabling remittance means for their employees
          and how it will affect salary payment. Max of three lines
        </p>
      </div>
      <div class="flex">
        <ButtonLightBlue textColor="text-red">
          <template v-slot:placeholder>Disable Remittance</template>
        </ButtonLightBlue>
      </div>
    </div>
    <!--  -->
    <div class="space-y-6">
      <div class="space-y-1">
        <p class="text-base font-medium">Disable Pension</p>
        <p class="text-sm text-gray-rgba-3">
          A short note on what disabling pensions means for their employees and
          how it will affect salary payment. Max of three lines
        </p>
      </div>
      <div class="flex">
        <ButtonDanger>
          <template v-slot:placeholder>Disable Remittance</template>
        </ButtonDanger>
      </div>
    </div>
  </div>
</template>
