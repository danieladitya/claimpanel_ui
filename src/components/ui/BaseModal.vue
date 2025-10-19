<template>
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div
        :class="[
          'bg-white shadow-lg relative overflow-y-auto',
          fullscreen
            ? 'w-full h-full rounded-none'
            : 'w-full max-w-4xl rounded-lg p-6'
        ]"
      >
        <!-- Tombol close -->
        <button
          @click="$emit('close')"
          class="absolute text-2xl text-gray-400 top-3 right-3 hover:text-gray-600"
        >
          ✕
        </button>
  
        <!-- Header -->
        <div v-if="title" class="px-4 pt-4 pb-2 mb-4 border-b">
          <h3 class="text-lg font-bold">{{ title }}</h3>
        </div>
  
        <!-- Slot isi modal -->
        <div class="p-4">
          <slot />
        </div>
  
        <!-- Slot footer -->
        <div
          v-if="$slots.footer"
          class="flex justify-end px-4 pt-2 pb-4 mt-4 space-x-2 border-t"
        >
          <slot name="footer" />
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  defineProps<{
    isOpen: boolean
    title?: string
    fullscreen?: boolean
  }>()
  
  defineEmits<{ (e: 'close'): void }>()
  </script>
  