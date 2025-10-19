<template>
    <Modal :show="show" @close="$emit('close')">
      <template #title>
        Rule Details
      </template>
  
      <template #body>
        <div v-if="rule" class="space-y-6">
          <!-- Basic Information -->
          <div>
            <h4 class="mb-3 text-lg font-medium text-gray-900">Basic Information</h4>
            <div class="grid grid-cols-1 gap-4 p-4 rounded-lg md:grid-cols-2 bg-gray-50">
              <div>
                <label class="text-sm font-medium text-gray-500">Rule Name</label>
                <p class="mt-1 text-sm text-gray-900">{{ rule.rule_name }}</p>
              </div>
              <div>
                <label class="text-sm font-medium text-gray-500">Rule Type</label>
                <p class="mt-1 text-sm text-gray-900">{{ rule.gcrule_type }}</p>
              </div>
              <div class="col-span-2">
                <label class="text-sm font-medium text-gray-500">Description</label>
                <p class="mt-1 text-sm text-gray-900">{{ rule.rule_description || 'No description' }}</p>
              </div>
            </div>
          </div>
  
          <!-- Trigger Information -->
          <div>
            <h4 class="mb-3 text-lg font-medium text-gray-900">Trigger Information</h4>
            <div class="grid grid-cols-1 gap-4 p-4 rounded-lg md:grid-cols-2 bg-gray-50">
              <div>
                <label class="text-sm font-medium text-gray-500">Trigger Code ID</label>
                <p class="mt-1 text-sm text-gray-900">{{ rule.trigger_code_id }}</p>
              </div>
              <div>
                <label class="text-sm font-medium text-gray-500">Trigger Code System</label>
                <p class="mt-1 text-sm text-gray-900">{{ rule.trigger_code_system }}</p>
              </div>
            </div>
          </div>
  
          <!-- Required Information -->
          <div>
            <h4 class="mb-3 text-lg font-medium text-gray-900">Required Information</h4>
            <div class="grid grid-cols-1 gap-4 p-4 rounded-lg md:grid-cols-3 bg-gray-50">
              <div>
                <label class="text-sm font-medium text-gray-500">Required Code System</label>
                <p class="mt-1 text-sm text-gray-900">{{ rule.required_code_system }}</p>
              </div>
              <div>
                <label class="text-sm font-medium text-gray-500">Required Mode</label>
                <p class="mt-1 text-sm text-gray-900">{{ rule.required_mode }}</p>
              </div>
              <div>
                <label class="text-sm font-medium text-gray-500">Required N</label>
                <p class="mt-1 text-sm text-gray-900">{{ rule.required_n || '1' }}</p>
              </div>
              <div class="col-span-3">
                <label class="text-sm font-medium text-gray-500">Required Codes</label>
                <pre class="p-3 mt-1 overflow-x-auto text-sm text-gray-900 bg-white border rounded">{{ JSON.stringify(rule.required_codes, null, 2) }}</pre>
              </div>
            </div>
          </div>
  
          <!-- Rule Configuration -->
          <div>
            <h4 class="mb-3 text-lg font-medium text-gray-900">Rule Configuration</h4>
            <div class="grid grid-cols-1 gap-4 p-4 rounded-lg md:grid-cols-2 bg-gray-50">
              <div>
                <label class="text-sm font-medium text-gray-500">Severity</label>
                <div class="mt-1">
                  <Badge :type="rule.severity" :label="rule.severity" />
                </div>
              </div>
              <div>
                <label class="text-sm font-medium text-gray-500">Status</label>
                <div class="mt-1">
                  <Badge :type="rule.active ? 'success' : 'error'" :label="rule.active ? 'Active' : 'Inactive'" />
                </div>
              </div>
              <div class="col-span-2">
                <label class="text-sm font-medium text-gray-500">Error Message</label>
                <p class="p-3 mt-1 text-sm text-gray-900 bg-white border rounded">{{ rule.message }}</p>
              </div>
              <div v-if="rule.condition_json" class="col-span-2">
                <label class="text-sm font-medium text-gray-500">Condition JSON</label>
                <pre class="p-3 mt-1 overflow-x-auto text-sm text-gray-900 bg-white border rounded">{{ JSON.stringify(rule.condition_json, null, 2) }}</pre>
              </div>
            </div>
          </div>
  
          <!-- Metadata -->
          <div>
            <h4 class="mb-3 text-lg font-medium text-gray-900">Metadata</h4>
            <div class="grid grid-cols-1 gap-4 p-4 rounded-lg md:grid-cols-2 bg-gray-50">
              <div>
                <label class="text-sm font-medium text-gray-500">Version</label>
                <p class="mt-1 text-sm text-gray-900">{{ rule.version_no }}</p>
              </div>
              <div>
                <label class="text-sm font-medium text-gray-500">Created Date</label>
                <p class="mt-1 text-sm text-gray-900">{{ formatDate(rule.created_date) }}</p>
              </div>
              <div>
                <label class="text-sm font-medium text-gray-500">Updated Date</label>
                <p class="mt-1 text-sm text-gray-900">{{ formatDate(rule.updated_date) }}</p>
              </div>
            </div>
          </div>
        </div>
      </template>
  
      <template #footer>
        <button
          @click="$emit('close')"
          class="px-4 py-2 text-white transition-colors bg-blue-500 rounded-md hover:bg-blue-600"
        >
          Close
        </button>
      </template>
    </Modal>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  import Modal from '@/components/ui/Modal.vue'
  import Badge from '@/components/ui/Badge.vue'
  
  const props = defineProps({
    show: Boolean,
    rule: Object
  })
  
  const emit = defineEmits(['close'])
  
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleString()
  }
  </script>