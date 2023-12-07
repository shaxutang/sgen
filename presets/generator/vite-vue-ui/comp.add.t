---
to: src/components/<%= name %>/<%= name %>.vue
---
<template>
  <div class="<%= componentPrefix %>-<%= name %>"><slot/></div>
</template>

<script setup lang="ts">
import { <%= s.changeCase.pascalCase(name) %>Props } from './type';

defineOptions({
  name: "<%= s.changeCase.pascalCase(componentPrefix) %><%= s.changeCase.pascalCase(name) %>",
});

defineProps<<%= s.changeCase.pascalCase(name) %>Props>()
</script>
