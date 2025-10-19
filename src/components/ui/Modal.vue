<template>
    <div v-if="show" class="fixed inset-0 z-50 w-full h-full overflow-y-auto bg-gray-600 bg-opacity-50">
      <div class="relative w-full max-w-4xl p-5 mx-auto bg-white border rounded-md shadow-lg top-20">
        <!-- Header -->
        <div class="flex items-center justify-between pb-3">
          <h3 class="text-xl font-semibold text-gray-900">
            <slot name="title"></slot>
          </h3>
          <button 
            @click="$emit('close')" 
            class="text-gray-400 transition-colors hover:text-gray-600"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
  
        <!-- Body -->
        <div class="mt-4 overflow-y-auto max-h-96">
          <slot name="body"></slot>
        </div>
  
        <!-- Footer -->
        <div v-if="$slots.footer" class="flex justify-end pt-4 mt-4 space-x-3 border-t">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  defineProps({
    show: Boolean
  })
  
  defineEmits(['close'])
  </script>