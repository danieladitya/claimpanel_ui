<!-- src/components/payor/PayorListItem.vue -->
<template>
  <div
    class="p-3 rounded cursor-pointer border-l-4 transition-all"
    :class="selected ? 'bg-blue-50 border-blue-500' : 'hover:bg-gray-100 border-transparent'"
  >
    <div class="flex justify-between items-center">
      <h3 class="font-medium text-gray-800">
        {{ payor.payor_name }}
      </h3>
      <span class="text-xs px-2 py-1 rounded bg-gray-100 text-gray-800">
        {{ payor.document_count ?? 0 }} dokumen
      </span>
    </div>
    <p class="text-sm text-gray-600 mt-1">
      Kategori: {{ payor.gc_payor_type }}
    </p>
  </div>
</template>

<script setup lang="ts">
import type { MasterPayorUI } from "@/interface/MasterPayorUI";

defineProps<{
  payor: MasterPayorUI;
  selected: boolean;
}>();
</script>
