<!-- components/claim/ClaimCard.vue -->
<template>
    <div class="bg-white border border-gray-200 rounded-lg shadow-sm">
      <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <h2 class="text-lg font-semibold text-gray-900">{{ title }}</h2>
        <slot name="action" />
      </div>
      <div class="p-6">
        <slot />
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  defineProps<{ title: string }>()
  </script>
  