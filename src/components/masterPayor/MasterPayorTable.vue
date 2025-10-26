<!-- components/masterPayor/MasterPayorTable.vue -->
<template>
      <div>
       <!-- Loading State -->
        <div v-if="loading" class="loading">
        <p>Loading ...</p>
        </div>
        <!-- Error State -->
        <div v-else-if="error" class="error">
          <p>Error loading  : {{ error }}</p>
          <button @click="fetchMasterDocuments(currentPage)">Retry</button>
        </div>
       
        <div v-else>
          <table class="table w-full table-zebra">
            <thead>
              <tr class="bg-gray-50">
                <th class="font-semibold">Kode</th>
                <th class="font-semibold">Nama Penjamin</th>
                <th class="font-semibold">Tipe Penjamin</th>
                <th class="font-semibold">Kode External</th>
                <th class="font-semibold">Status</th>
                <th class="font-semibold">Dibuat</th>
                <th class="font-semibold text-center"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="loading">
                <td colspan="7" class="py-4 text-center">
                  <span class="loading loading-spinner loading-md"></span>
                  <p class="mt-2 text-sm text-gray-500">Memuat data...</p>
                </td>
              </tr>
              
              <tr v-else-if="payors.length === 0">
                <td colspan="7" class="py-4 text-center text-gray-500">
                  Tidak ada data payor
                </td>
              </tr>
              
              <tr 
                v-else 
                v-for="payor in payors" 
                :key="payor.id"
                class="hover:bg-gray-50"
              >
                <td class="font-mono text-sm">{{ payor.payor_code }}</td>
                <td class="font-medium">{{ payor.payor_name }}</td>
                <td>
                  <span class="badge badge-outline">
                    {{ payor.gc_payor_type }}
                  </span>
                </td>
                <td>
                  <span v-if="payor.code_external" class="text-sm">
                    {{ payor.code_external }}
                  </span>
                  <span v-else class="text-sm text-gray-400">-</span>
                </td>
                <td>
                  <span 
                    :class="[
                      'badge',
                      payor.is_active ? 'badge-success' : 'badge-error'
                    ]"
                  >
                    {{ payor.is_active ? 'Aktif' : 'Nonaktif' }}
                  </span>
                </td>
                <td class="text-sm text-gray-500">
                  {{ formatDate(payor.created_at) }}
                </td>
                <td>
                  <div class="flex justify-center space-x-1">
                    <button 
                      @click="$emit('edit', payor)"
                      class="icon-bg-primary"
                      title="Edit"
                    >
                      <PencilSquareIcon class="w-4 h-4" />
                    </button>
                    <button 
                      @click="$emit('delete', payor.id)"
                      class="icon-bg-danger"
                      title="Hapus"
                    >
                    <TrashIcon class="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <!-- Pagination -->
          <div v-if="pagination && payors.length > 0" class="pagination">
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
  
  <script setup lang="ts">
  import { PencilSquareIcon, TrashIcon } from "@heroicons/vue/24/outline";
  import type { MasterPayor } from "@/interface/IMasterPayor";
import { useMasterPayor } from '../../composables/masterPayor';
import { onMounted } from 'vue';
  
 
// Define props
const props = defineProps({
  payors: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
});
  
  const emit = defineEmits(['edit', 'delete']);

   
  // Composable
  const { 
    loading: internalLoading, 

    saving,
    error,
    pagination,
    totalData,
    currentPage,
    totalPages,
    hasNext,
    hasPrevious,
    fetchMasterPayors,
    createData,
    updateData,
    deleteData
  } = useMasterPayor();

  const isLoading = props.loading || internalLoading.value;

onMounted(() => {
    fetchMasterPayors(1);
});
const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    fetchMasterPayors(page);
  }
};
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  </script>