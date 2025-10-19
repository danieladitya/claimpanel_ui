<template>
    <div class="bg-white rounded-lg border border-gray-200 p-6">
      <div class="flex items-center">
        <div 
          :class="[
            'p-3 rounded-lg',
            `bg-${color}-50 text-${color}-600`
          ]"
        >
          <component :is="icon" class="h-6 w-6" />
        </div>
        <div class="ml-4">
          <p class="text-sm font-medium text-gray-600">{{ title }}</p>
          <p class="text-2xl font-bold text-gray-900">{{ value }}</p>
        </div>
      </div>
      <div class="mt-4 flex items-center justify-between">
        <span 
          :class="[
            'text-sm font-medium',
            trend > 0 ? 'text-green-600' : 'text-red-600'
          ]"
        >
          {{ trend > 0 ? '↑' : '↓' }} {{ Math.abs(trend) }}%
        </span>
        <span class="text-xs text-gray-500">Since last month</span>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'StatsCard',
    props: {
      title: String,
      value: [String, Number],
      trend: Number,
      color: {
        type: String,
        default: 'blue'
      },
      icon: Object
    }
  }
  </script>