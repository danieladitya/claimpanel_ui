<template>
    <span 
      :class="badgeClasses" 
      class="inline-flex px-2 text-xs font-semibold leading-5 rounded-full"
    >
      {{ label }}
    </span>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  
  const props = defineProps({
    type: {
      type: String,
      default: 'default'
    },
    label: {
      type: String,
      required: true
    }
  })
  
  const badgeClasses = computed(() => {
    const baseClasses = 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full'
    
    const typeClasses = {
      default: 'bg-gray-100 text-gray-800',
      success: 'bg-green-100 text-green-800',
      warning: 'bg-yellow-100 text-yellow-800',
      error: 'bg-red-100 text-red-800',
      info: 'bg-blue-100 text-blue-800'
    }
  
    return typeClasses[props.type] || typeClasses.default
  })
  </script>