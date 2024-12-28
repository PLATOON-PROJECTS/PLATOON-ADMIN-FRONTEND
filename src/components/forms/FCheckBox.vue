
<script lang="ts" setup>

import {withDefaults} from "vue"
const props=withDefaults(defineProps<{value?:boolean}>(),{value:false})


</script>

<template>
  <input
    type="checkbox"
    :checked="props.value"
    class="checkbox checkbox-sm checkbox-primary rounded-full"
  />
</template>
