<template>
  <div>
     <!-- Loading State -->
      <div v-if="loading" class="loading">
      <p>Loading ...</p>
      </div>
      <!-- Error State -->
      <div v-else-if="error" class="error">
        <p>Error loading : {{ error }}</p>
        <button @click="fetchData(currentPage, 50)">Retry</button>
      </div>
     
      <!-- Document Table -->
      <div v-else>
      <table class="table table-compact">
        <thead>
          <tr>
         
            <th>Tanggal klaim</th>
            <th>Nomor klaim</th>
            <th>Pasien</th>
            <th>Jenis Layanan</th>
            <th>Status</th>
            
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in claims" :key="row.id" class="document-row">
             <td>{{ row.claim_date }}</td>
              <td>{{ row.claim_number }}
                <p> {{ row.claim_payor_number }}</p>
              </td>
              <td>
                {{ row.patient_name }}
              </td>
              <td>
                  {{ row.claim_service_type }} 
              </td>
              <td>{{ row.claim_status }}</td>
              <td>
                <!-- PERBAIKI: Emit event edit -->
                <button @click="$emit('edit', row)" class="btn btn-sm">
                      <PencilSquareIcon class="w-4 h-4" />
                  </button>
                   <button @click="$emit('delete', row.id)" class="btn btn-sm ">
                      <TrashIcon class="w-4 h-4" />
                  </button>
              </td>
          </tr>
          </tbody>
      </table>
    <!-- Pagination -->
    <div v-if="pagination && claims.length > 0" class="pagination">
      <button 
        @click="goToPage(currentPage - 1)" 
        :disabled="!hasPrevious || loading"
        class="pagination-btn"
      >
        Previous
      </button>
      
      <span class="page-info">
        Page {{ currentPage }} of {{ totalPages }} ({{ totaldata }} total)
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
import { useClaims } from '@/composables/claims';
import { onMounted } from 'vue';
import { PencilSquareIcon, TrashIcon } from "@heroicons/vue/24/outline";

const props = defineProps({
  claims: {
    type: Array,
    required: true
  }, 
  loading : {
    type: Boolean,
    required: true
  }
});

const emit = defineEmits(['edit', 'delete']);


const {
    claims, 
    loading : internalLoading,
    error,
    fetchData,
    totaldata,
    currentPage,
    totalPages,
    hasNext,
    hasPrevious,
    pagination, 
    createData,
    updateData,
    deleteData,
    saving
}= useClaims();

const isLoading =props.loading || internalLoading.value
onMounted(() => {
    fetchData(1, 50);
});

const goToPage = (page: number) => {
  if(page >= 1 || page <= totalPages.value) {
    fetchData(page, 50);
  }
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

.status {
padding: 4px 8px;
border-radius: 12px;
font-size: 12px;
font-weight: 500;
}

.status.active {
background: #e8f5e8;
color: #2e7d32;
}

.status.inactive {
background: #ffebee;
color: #c62828;
}

</style>