<!-- src/components/document/DocumentFilterBar.vue -->
<template>
  <div class="flex flex-col md:flex-row justify-between mb-6 gap-4">
    <div class="relative w-full md:w-64">
      <input
        :value="search"
        @input="e => $emit('update:search', (e.target as HTMLInputElement).value)"
        type="text"
        placeholder="Cari dokumen..."
        class="w-full pl-10 pr-4 py-2 border rounded-lg"
      />
      <i class="fas fa-search absolute left-3 top-3 text-gray-400"></i>
    </div>

    <div class="flex flex-wrap gap-2">
      <select
        :value="category"
        @change="e => $emit('update:category', (e.target as HTMLSelectElement).value)"
        class="border rounded-lg px-3 py-2"
      >
        <option value="Semua">Semua Kategori</option>
        <option value="Medis">Medis</option>
        <option value="Administrasi">Administrasi</option>
        <option value="Keuangan">Keuangan</option>
      </select>

      <select
        :value="status"
        @change="e => $emit('update:status', (e.target as HTMLSelectElement).value)"
        class="border rounded-lg px-3 py-2"
      >
        <option value="Semua">Status: Semua</option>
        <option value="Wajib">Status: Wajib</option>
        <option value="Opsional">Status: Opsional</option>
      </select>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  search: string;
  category: string;
  status: string;
}>();

defineEmits(["update:search", "update:category", "update:status"]);
</script>
