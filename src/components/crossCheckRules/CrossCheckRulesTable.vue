<template>
    <div class="overflow-hidden bg-white rounded-lg shadow-md">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Rule Name
              </th>
              <th class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Trigger Code
              </th>
              <th class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Required Mode
              </th>
              <th class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Severity
              </th>
              <th class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Type
              </th>
              <th class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Status
              </th>
              <th class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr 
              v-for="rule in rules" 
              :key="rule.id" 
              class="transition-colors hover:bg-gray-50"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ rule.rule_name }}</div>
                <div class="max-w-xs text-sm text-gray-500 truncate">{{ rule.rule_description }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ rule.trigger_code_id }}</div>
                <div class="text-sm text-gray-500">{{ rule.trigger_code_system }}</div>
              </td>
              <td class="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                {{ rule.required_mode }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <Badge 
                  :type="rule.severity" 
                  :label="rule.severity" 
                />
              </td>
            <!-- Di dalam template, update kolom Type -->
            <td class="px-6 py-4 whitespace-nowrap">
              <span :class="[
                'px-2 py-1 text-xs font-medium rounded-full',
                rule.gcrule_type === 'code' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-green-100 text-green-800'
              ]">
                {{ rule.gcrule_type === 'code' ? 'Kode Medis' : 'Dokumen' }}
              </span>
            </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <Badge 
                  :type="rule.active ? 'success' : 'error'" 
                  :label="rule.active ? 'Active' : 'Inactive'" 
                />
              </td>
              <td class="px-6 py-4 text-sm font-medium whitespace-nowrap">
                <div class="flex space-x-2">
                  <button
                    @click="$emit('edit', rule)"
                    class="text-indigo-600 transition-colors hover:text-indigo-900"
                    title="Edit Rule"
                  >
                    <PencilIcon class="w-5 h-5" />
                  </button>
                  <button
                    @click="$emit('delete', rule.id)"
                    class="text-red-600 transition-colors hover:text-red-900"
                    title="Delete Rule"
                  >
                    <TrashIcon class="w-5 h-5" />
                  </button>
                  <button
                    @click="$emit('view', rule)"
                    class="text-blue-600 transition-colors hover:text-blue-900"
                    title="View Details"
                  >
                    <EyeIcon class="w-5 h-5" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
  
      <!-- Empty State -->
      <div v-if="rules.length === 0 && !loading" class="py-12 text-center">
        <svg class="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M12 16h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No rules found</h3>
        <p class="mt-1 text-sm text-gray-500">
          {{ emptyStateMessage }}
        </p>
      </div>
  
      <!-- Loading State -->
      <div v-if="loading" class="py-8 text-center">
        <div class="inline-flex items-center">
          <svg class="w-5 h-5 mr-3 -ml-1 text-blue-500 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span class="text-gray-600">Loading rules...</span>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { type PropType } from 'vue'
  import Badge from '@/components/ui/Badge.vue'
  import type { CrossCheckRule } from '@/composables/useCrossCheckRules'
  
  // Icons
  const PencilIcon = {
    template: `
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    `
  }
  
  const TrashIcon = {
    template: `
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    `
  }
  
  const EyeIcon = {
    template: `
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    `
  }
  
  defineProps({
    rules: {
      type: Array as PropType<CrossCheckRule[]>,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    },
    emptyStateMessage: {
      type: String,
      default: 'Get started by creating a new rule.'
    }
  })
  
  defineEmits<{
    edit: [rule: CrossCheckRule]
    delete: [id: string]
    view: [rule: CrossCheckRule]
  }>()
  </script>