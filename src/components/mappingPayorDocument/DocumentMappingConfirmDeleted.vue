<script setup lang="ts">
const props = defineProps({
  visible: Boolean,
  message: String,
});

const emits = defineEmits(["confirm", "close"]);
</script>

<template>
  <div
    v-if="visible"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
  >
    <div class="w-full max-w-sm p-6 bg-white rounded-lg shadow-md">
      <h2 class="mb-2 text-lg font-semibold">Konfirmasi Hapus</h2>

      <p class="mb-6 text-sm text-gray-700">
        {{ message || "Apakah yakin ingin menghapus item ini?" }}
      </p>

      <div class="flex justify-end space-x-2">
        <button
          class="px-4 py-2 bg-gray-200 rounded"
          @click="$emit('close')"
        >
          Batal
        </button>
        <button
          class="px-4 py-2 text-white bg-red-500 rounded"
          @click="$emit('confirm')"
        >
          Hapus
        </button>
      </div>
    </div>
  </div>
</template>
