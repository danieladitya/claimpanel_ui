<script setup lang="ts">
defineProps<{
  status: string
}>()

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
}
</script>

<template>
  <span
    class="px-2 py-1 text-xs font-medium rounded-full"
    :class="statusColors[status] || 'bg-gray-100 text-gray-800'"
  >
    {{ status }}
  </span>
</template>
