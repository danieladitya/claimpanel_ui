<template>
  <div class="p-4 mb-6 bg-white rounded-lg shadow-md">
    <div class="grid grid-cols-1 gap-4 md:grid-cols-4">
      <div>
        <label class="block mb-1 text-sm font-medium text-gray-700">Rule Name</label>
        <input
          v-model="localFilters.rule_name"
          type="text"
          class="w-full px-3 py-2 transition-colors border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Search rule name..."
        />
      </div>
      <div>
        <label class="block mb-1 text-sm font-medium text-gray-700">Trigger Code System</label>
        <select
          v-model="localFilters.trigger_code_system"
          class="w-full px-3 py-2 transition-colors border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Systems</option>
          <option v-for="system in CODE_SYSTEM_OPTIONS" :key="system.value" :value="system.value">
            {{ system.label }}
          </option>
        </select>
      </div>
      <div>
        <label class="block mb-1 text-sm font-medium text-gray-700">Status</label>
        <select
          v-model="localFilters.active"
          class="w-full px-3 py-2 transition-colors border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option v-for="status in STATUS_OPTIONS" :key="status.value" :value="status.value">
            {{ status.label }}
          </option>
        </select>
      </div>
      <div class="flex items-end space-x-2">
        <button
          @click="applyFilters"
          class="w-full px-4 py-2 text-white transition-colors bg-blue-500 rounded-md hover:bg-blue-600"
        >
          Apply Filters
        </button>
        <button
          @click="resetFilters"
          class="w-full px-4 py-2 text-white transition-colors bg-gray-500 rounded-md hover:bg-gray-600"
        >
          Reset
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, type PropType } from 'vue'
import { CODE_SYSTEM_OPTIONS, STATUS_OPTIONS, INITIAL_FILTERS, type Filters } from '@/utils/constants'

const props = defineProps({
  filters: {
    type: Object as PropType<Filters>,
    required: true
  }
})

const emit = defineEmits<{
  'update:filters': [Filters]
}>()

const localFilters = ref<Filters>({ ...props.filters })

watch(() => props.filters, (newFilters) => {
  localFilters.value = { ...newFilters }
}, { deep: true })

function applyFilters() {
  emit('update:filters', { ...localFilters.value })
}

function resetFilters() {
  localFilters.value = { ...INITIAL_FILTERS }
  emit('update:filters', { ...localFilters.value })
}
</script>