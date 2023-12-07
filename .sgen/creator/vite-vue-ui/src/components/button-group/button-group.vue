<template>
  <div class="v-button-group">
    <VButton />
    <VButton />
    <VButton />
  </div>
</template>

<script setup lang="ts">
import VButton from "../button/button.vue";
import { ButtonGroupProps } from "./type";

defineOptions({
  name: "VButtonGroup",
});

defineProps<ButtonGroupProps>()
</script>