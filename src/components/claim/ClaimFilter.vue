<script setup lang="ts">
import { ref } from 'vue'

const search = ref('')
const status = ref('')

defineEmits<{
  (e: 'update:filter', payload: { search: string; status: string }): void
}>()

function applyFilter() {
  emit('update:filter', { search: search.value, status: status.value })
}
</script>

<template>
  <div class="flex flex-wrap items-end gap-4 p-4 bg-white border rounded-lg shadow-sm">
    <div class="flex-1">
      <label class="block text-sm font-medium text-gray-700">Cari Klaim</label>
      <input
        v-model="search"
        type="text"
        placeholder="Nama pasien / nomor klaim..."
        class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      />
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700">Status</label>
      <select
        v-model="status"
        class="mt-1 block w-40 rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      >
        <option value="">Semua</option>
        <option value="pending">Pending</option>
        <option value="approved">Disetujui</option>
        <option value="rejected">Ditolak</option>
      </select>
    </div>

    <div>
      <button
        @click="applyFilter"
        class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
      >
        Terapkan
      </button>
    </div>
  </div>
</template>
 