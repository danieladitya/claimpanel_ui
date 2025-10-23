<template>
  <AdminLayout>
  <div class="container p-6 mx-auto">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Cross Check Rules</h1>
        <p class="mt-1 text-gray-600">Manage cross-checking rules for medical codes and documents</p>
      </div>
      <button
        @click="openCreateModal"
        class="flex items-center px-4 py-2 text-white transition-colors bg-blue-500 rounded-lg hover:bg-blue-600"
      >
        <PlusIcon class="w-5 h-5 mr-2" />
        Add New Rule
      </button>
    </div>

    <!-- Error Alert -->
    <div v-if="error" class="p-4 mb-6 border border-red-200 rounded-md bg-red-50">
      <div class="flex items-center">
        <svg class="w-5 h-5 mr-2 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
        </svg>
        <span class="text-red-800">{{ error }}</span>
      </div>
    </div>
<!-- 
     Filter Component  
    <CrossCheckRulesFilter
      :filters="filters"
      @update:filters="updateFilters"
    /> -->

    <!-- Table Component -->
    <CrossCheckRulesTable
      :rules="paginatedRules"
      :loading="loading"
      :empty-state-message="emptyStateMessage"
      @edit="openEditModal"
      @delete="openDeleteModal"
      @view="openViewModal"
    />

    <!-- Pagination -->
    <Pagination
      v-if="filteredRules.length > 0"
      :current-page="currentPage"
      :items-per-page="itemsPerPage"
      :total-items="filteredRules.length"
      :total-pages="totalPages"
      @prev="currentPage--"
      @next="currentPage++"
    />

    <!-- Create/Edit Modal -->
    <CrossCheckRulesForm
      :show="showCreateModal || showEditModal"
      :rule="editingRule"
      :is-editing="showEditModal"
      :submitting="submitting"
      @save="handleSave"
      @close="closeModals"
    />

    <!-- Detail Modal -->
    <CrossCheckRulesDetail
      :show="showViewModal"
      :rule="viewingRule"
      @close="closeModals"
    />

    <!-- Delete Confirmation Modal -->
    <ConfirmationModal
      :show="showDeleteModal"
      title="Delete Cross Check Rule"
      :message="deleteConfirmationMessage"
      @confirm="handleDelete"
      @cancel="closeModals"
    />
  </div>
</AdminLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useCrossCheckRules } from '@/composables/useCrossCheckRules'
 
// Components
import CrossCheckRulesFilter from '@/components/crossCheckRules/CrossCheckRulesFilter.vue'
import CrossCheckRulesTable from '@/components/crossCheckRules/CrossCheckRulesTable.vue'
import CrossCheckRulesForm from '@/components/crossCheckRules/CrossCheckRulesForm.vue'
import CrossCheckRulesDetail from '@/components/crossCheckRules/CrossCheckRulesDetail.vue'
import ConfirmationModal from '@/components/ui/ConfirmationModal.vue'
import Pagination from '@/components/ui/Pagination.vue'
import AdminLayout from '@/layouts/AdminLayout.vue';

// Icons
const PlusIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
    </svg>
  `
}

// Use composable
const {
  // State
  rules,
  loading,
  error,
  filters,
  currentPage,
  itemsPerPage,
  
  // Modal states
  showCreateModal,
  showEditModal,
  showViewModal,
  showDeleteModal,
  editingRule,
  viewingRule,
  deletingRuleId,
  
  // Computed
  filteredRules,
  paginatedRules,
  totalPages,
  
  // Methods
  fetchRules,
  createRule,
  updateRule,
  deleteRule,
  openCreateModal,
  openEditModal,
  openViewModal,
  openDeleteModal,
  closeModals,
  resetFilters
} = useCrossCheckRules()

const submitting = ref(false)

// Computed
const emptyStateMessage = computed(() => {
  if (filters.rule_name || filters.trigger_code_system || filters.active !== '') {
    return 'No rules match your current filters. Try adjusting your search criteria.'
  }
  return 'No cross-check rules have been created yet. Get started by creating your first rule.'
})

const deleteConfirmationMessage = computed(() => {
  const rule = rules.value.find(r => r.id === deletingRuleId.value)
  return rule 
    ? `Are you sure you want to delete the rule "${rule.rule_name}"? This action cannot be undone.`
    : 'Are you sure you want to delete this rule? This action cannot be undone.'
})

// Methods
function updateFilters(newFilters) {
  Object.assign(filters, newFilters)
  currentPage.value = 1
}

async function handleSave(ruleData) {
  submitting.value = true
  try {
    if (showEditModal.value) {
      await updateRule(ruleData)
    } else {
      await createRule(ruleData)
    }
  } catch (err) {
    // Error is handled in the composable
    console.error('Failed to save rule:', err)
  } finally {
    submitting.value = false
  }
}

async function handleDelete() {
  try {
    await deleteRule(deletingRuleId.value)
  } catch (err) {
    // Error is handled in the composable
    console.error('Failed to delete rule:', err)
  }
}

// Lifecycle
onMounted(() => {
  fetchRules()
})
</script>