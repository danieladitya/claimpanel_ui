<template>
    <div>
       <!-- Loading State -->
        <div v-if="loading" class="loading">
        <p>Loading documents...</p>
        </div>
        <!-- Error State -->
        <div v-else-if="error" class="error">
          <p>Error loading documents: {{ error }}</p>
          <button @click="fetchMasterDocuments(currentPage)">Retry</button>
        </div>
       
        <!-- Document Table -->
        <div v-else>
        <table class="table table-compact">
          <thead>
            <tr>
           
              <th>Kode Dokumen</th>
              <th>Nama Dokumen</th>
              <th>Kata Kunci</th>
              <th>Status</th>
               
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="doc in documents" :key="doc.id" class="document-row">
               
                <td>{{ doc.document_code }}</td>
                <td>{{ doc.document_name }}</td>
                <td>{{ doc.document_keyword }}</td>
                <td>
                    <span :class="['status', doc.is_active == 1 ? 'active' : 'inactive']">
                    {{ doc.is_active ? 'Active' : 'Inactive' }}
                   
                    </span>
                </td>
                 
                <td>
                  <!-- PERBAIKI: Emit event edit -->
                  <button @click="$emit('edit', doc)"    class="icon-bg-primary">
                        <PencilSquareIcon class="w-4 h-4" />
                    </button>
                    &nbsp;&nbsp;
                     <button @click="$emit('delete', doc.id)"    class="icon-bg-danger">
                        <TrashIcon class="w-4 h-4" />
                    </button>
                </td>
            </tr>
            </tbody>
        </table>
      <!-- Pagination -->
      <div v-if="pagination && documents.length > 0" class="pagination">
        <button 
          @click="goToPage(currentPage - 1)" 
          :disabled="!hasPrevious || loading"
          class="pagination-btn"
        >
          Previous
        </button>
        
        <span class="page-info">
          Page {{ currentPage }} of {{ totalPages }} ({{ totalDocuments }} total)
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

<script lang="ts" setup>
import { onMounted  } from "vue";
import { useMasterDocument } from '@/composables/masterDocument';
import { TrashIcon, EyeIcon, PencilSquareIcon } from '@heroicons/vue/24/outline';

// Define props
const props = defineProps({
  documents: {
    type: Array,
    required: true,
    default: () => [] // Tambahkan default value
  },
  loading: {
    type: Boolean,
    default: false
  }
});
// Define emits
const emit = defineEmits(['edit', 'delete']);
// Gunakan composable untuk pagination data
const { 
  loading: internalLoading, 
  pagination, 
  error, 
  totalDocuments, 
  currentPage,
  totalPages,
  hasNext, 
  hasPrevious,
  fetchMasterDocuments 
} = useMasterDocument();
// Combined loading state
const isLoading = props.loading || internalLoading.value;
async function fetchDocuments() {
  await fetchMasterDocuments(currentPage.value, 10);
}

onMounted(() => {
    fetchMasterDocuments(1);
});
// Methods
const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    fetchDocuments();
  }
};
 
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('id-ID');
};

const fetchData = () => {
  fetchMasterDocuments(currentPage.value);
};

</script>
<style scoped>
.loading, .error {
  text-align: center;
  padding: 40px;
}

.error {
  color: #d32f2f;
}


 
</style>