<template>
  <div>
    <!-- Loading State -->
    <div v-if="loading" class="loading">
      <p>Loading ...</p>
    </div>
    
    <!-- Error State -->
    <div v-else-if="error" class="error">
      <p>Error loading : {{ error }}</p>
      <button @click="fetchRules(currentPage, 50)">Retry</button>
    </div>
   
    <!-- Empty State -->
    <div v-else-if="rules.length === 0" class="empty-state">
      <p>{{ emptyStateMessage }}</p>
    </div>
   
    <!-- Document Table -->
    <div v-else>
      <table class="table table-compact">
        <thead>
          <tr>
            <th>No</th>
            <th>Nama Rule</th>
            <th>Trigger</th>
            <th>Kode Wajib</th>
            <th>Jumlah Required</th>
            <th>Severity</th>
            <th>Aktif</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in rules" :key="row.id">
            <td>{{ (currentPage - 1) * pageSize + index + 1 }}</td>
            <td>
              <div class="font-medium">{{ row.rule_name }}</div>
              <div class="text-sm text-gray-500">{{ row.rule_description }}</div>
              <div class="text-xs text-gray-400">ID: {{ row.rule_no }}</div>
            </td>
            <td>
              <div class="font-mono">{{ row.trigger_code_id }}</div>
              <div class="text-xs text-gray-500">{{ row.triger_gccode_system }}</div>
            </td>
            <td>
              <div v-if="row.required_codes && row.required_codes.length > 0">
                <span 
                  v-for="code in row.required_codes" 
                  :key="code"
                  class="code-badge"
                >
                  {{ code }}
                </span>
              </div>
              <div v-else class="text-sm text-gray-400">-</div>
            </td>
            <td>
              {{ row.required_n || 0 }}
            </td>
            <td>
              <span class="severity-badge">
                {{ row.gc_severity || '-' }}
              </span>
            </td>
            <td>
              <span :class="['status', row.is_active ? 'active' : 'inactive']">
                {{ row.is_active ? 'Active' : 'Inactive' }}
              </span>
            </td>
            <td>
              <div class="flex space-x-1">
                <button 
                  @click="$emit('edit', row)" 
                  class="btn btn-sm btn-edit"
                  title="Edit Rule"
                >
                  <PencilSquareIcon class="w-4 h-4" />
                </button>
                <button 
                  @click="$emit('delete', row.id)" 
                  class="btn btn-sm btn-delete"
                  title="Delete Rule"
                >
                  <TrashIcon class="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      
      <!-- Pagination -->
      <div v-if="pagination && rules.length > 0" class="pagination">
        <button 
          @click="goToPage(currentPage - 1)" 
          :disabled="!hasPrevious || loading"
          class="pagination-btn"
        >
          Previous
        </button>
        
        <span class="page-info">
          Page {{ currentPage }} of {{ totalPages }} ({{ totalRules }} total rules)
        </span>
        
        <button 
          @click="goToPage(currentPage + 1)" 
          :disabled="!hasNext || loading"
          class="pagination-btn"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type PropType, onMounted, computed } from 'vue';
import { useCrossCheckRules } from '@/composables/useCrossCheckRules'
import { ICrossCheckRules } from '@/interface/ICrossCheckRules';
import { TrashIcon, PencilSquareIcon } from '@heroicons/vue/24/outline';

// Props
defineProps({
  rules: {
    type: Array as PropType<ICrossCheckRules[]>,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  emptyStateMessage: {
    type: String,
    default: 'Tidak ada rules yang ditemukan.'
  }
})

// Emits
const emit = defineEmits(['edit', 'delete']);

// Composables
const {
  fetchRules, 
  pagination,
  rules,
  loading: internalLoading, 
  error, 
  currentPage, 
  totalRules, 
  totalPages,
  hasNext, 
  hasPrevious,
} = useCrossCheckRules()

// Computed
const pageSize = computed(() => {
  return pagination.value?.per_page || 50
})

// Methods
const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    fetchRules(page, pageSize.value);
  }
};

// Lifecycle
onMounted(() => {
  fetchRules(1, 50);
});
</script>

<style scoped>
.loading, .error, .empty-state {
  @apply p-8 text-center text-gray-500;
}

.table {
  @apply w-full border-collapse;
}

.table th {
  @apply bg-gray-50 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b;
}

.table td {
  @apply px-4 py-3 text-sm border-b;
}

.status {
  @apply inline-flex px-2 py-1 text-xs font-medium rounded-full;
}

.status.active {
  @apply bg-green-100 text-green-800;
}

.status.inactive {
  @apply bg-red-100 text-red-800;
}

.code-badge {
  @apply inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-1 mb-1;
}

.severity-badge {
  @apply inline-flex px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded;
}

.btn {
  @apply inline-flex items-center justify-center rounded-md border border-transparent transition-colors;
}

.btn-sm {
  @apply px-2 py-1 text-sm;
}

.btn-edit {
  @apply bg-blue-100 text-blue-700 hover:bg-blue-200;
}

.btn-delete {
  @apply bg-red-100 text-red-700 hover:bg-red-200;
}

.pagination {
  @apply flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200;
}

.pagination-btn {
  @apply px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed;
}

.page-info {
  @apply text-sm text-gray-700;
}
</style>