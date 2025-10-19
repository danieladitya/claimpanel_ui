<template>
    <Modal :show="show" @close="$emit('cancel')">
      <template #title>
        {{ title }}
      </template>
      
      <template #body>
        <div class="text-center">
          <div class="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p class="text-sm text-gray-500">{{ message }}</p>
        </div>
      </template>
  
      <template #footer>
        <button
          @click="$emit('cancel')"
          class="px-4 py-2 text-gray-600 transition-colors border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          @click="$emit('confirm')"
          class="px-4 py-2 text-white transition-colors bg-red-500 rounded-md hover:bg-red-600"
        >
          Confirm Delete
        </button>
      </template>
    </Modal>
  </template>
  
  <script setup>
  import Modal from './Modal.vue'
  
  defineProps({
    show: Boolean,
    title: {
      type: String,
      default: 'Confirm Deletion'
    },
    message: {
      type: String,
      default: 'Are you sure you want to delete this item? This action cannot be undone.'
    }
  })
  
  defineEmits(['confirm', 'cancel'])
  </script>