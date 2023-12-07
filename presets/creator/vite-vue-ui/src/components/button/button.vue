<template>
  <button class="v-button">Button</button>
</template>

<script setup lang="ts">
import { ButtonProps } from './type';

defineOptions({
  name: "VButton",
});

defineProps<ButtonProps>()
</script>
