<template>
  <div>
    <!-- Form Request -->
    <div class="form-container mb-4">
      <h3 class="text-lg font-semibold mb-3">Filter Data</h3>
      <form @submit.prevent="handleSubmit" class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="form-group">
          <label for="tglsep" class="block text-sm font-medium mb-1">Tanggal SEP</label>
          <input
            type="date"
            id="tglsep"
            v-model="formData.tglsep"
            class="input input-bordered w-full"
            required
          />
        </div>
        
        <div class="form-group">
          <label for="jnspelayanan" class="block text-sm font-medium mb-1">Jenis Pelayanan</label>
          <select
            id="jnspelayanan"
            v-model="formData.jnspelayanan"
            class="select select-bordered w-full"
            required
          >
            <option value="1">Rawat Inap</option>
            <option value="2">Rawat Jalan</option>
          </select>
        </div>
        
        <div class="form-group">
          <label for="payor_id" class="block text-sm font-medium mb-1">Payor</label>
          <select v-model="formData.payor_id" class="select select-bordered w-full" required>
            <option value="">Pilih Payor</option>
            <option v-for="row in payors" :key="row.id" :value="row.id">
              {{ row.payor_name }}
            </option>
          </select>
        </div>
        
        <div class="form-group md:col-span-3">
          <button 
            type="submit" 
            class="btn btn-primary"
            :disabled="isLoading"
          >
            <span v-if="isLoading" class="loading loading-spinner loading-sm"></span>
            {{ isLoading ? 'Loading...' : 'Filter Data' }}
          </button>
          <button 
            type="button" 
            @click="handleReset"
            class="btn btn-outline ml-2"
          >
            Reset
          </button>
        </div>
      </form>
    </div>

   <!-- Loading State -->
    <div v-if="isLoading" class="loading text-center py-8">
      <p>Loading ...</p>
    </div>
    
    <!-- Error State -->
    <div v-else-if="error" class="error alert alert-error">
      <div>
        <p>Error loading : {{ error }}</p>
        <button @click="handleRetry" class="btn btn-ghost btn-sm">Retry</button>
      </div>
    </div>
   
    <!-- Document Table -->
    <div v-else>
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold"></h3>
        <div class="text-sm text-gray-600">
          Total: {{ payor_claims.length }} data
        </div>
      </div>
      
      <table class="table table-compact w-full">
        <thead>
          <tr>
            <th>No SEP</th>
            <th>Tanggal SEP</th>
            <th>No. Kartu</th>
            <th>Nama</th>
            <th>Poli</th>
            <th>Diagnosa</th>
            <th>Jenis Layanan</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in payor_claims" :key="row.noSep" class="hover:bg-base-200">
            <td class="font-mono">{{ row.noSep }}</td>
            <td>
              {{ formatDate(row.tglSep) }}
              <p class="text-xs text-gray-500">{{ getJenisPelayanan(row.jnsPelayanan) }}</p>
            </td>
            <td>{{ row.noKartu }}</td>
            <td class="font-medium">{{ row.nama }}</td>
            <td>{{ row.poli }}</td>
            <td>{{ row.diagnosa }}</td>
            <td>
              <span class="badge" :class="getBadgeClass(row.jnsPelayanan)">
                {{ getJenisPelayanan(row.jnsPelayanan) }}
              </span>
            </td>
            <td>
              <div class="flex space-x-1">
                <button @click="handleSave(row)" class="btn btn-sm btn-outline">
                  <PlusCircleIcon class="w-4 h-4" />
                </button>
                 
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      
      <!-- Empty State -->
      <div v-if="payor_claims.length === 0 && !isLoading" class="text-center py-8 text-gray-500">
        Tidak ada data yang ditemukan
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useBridgingPayor } from '@/composables/bridgingPayor';
import { ref, onMounted, computed } from 'vue';
import { BPJSSepClaimRequest, BPJSSaveSEPClaimRequest } from '../../interface/IClaim';
import { useMasterPayor } from '../../composables/masterPayor';
import { PlusCircleIcon } from '@heroicons/vue/24/outline';

// Define emits
const emit = defineEmits(['save', 'filter']);
 

// Composables
const {
payors, 
fetchMasterPayors
} = useMasterPayor();

onMounted (() => {
  fetchMasterPayors(1, 100);
});

const {
  payor_claims,
loading: internalLoading,
error,
fecthBridgingPayor,
createPayorClaim
} = useBridgingPayor();

// Form data
const formData = ref<BPJSSepClaimRequest>({
tglsep: new Date().toISOString().split('T')[0], // Default to today
jnspelayanan: '1',
payor_id: 0
});

// Computed
const isLoading = computed(() => internalLoading.value);

// Methods
function validateForm(): boolean {
if (!formData.value.tglsep) {
  alert('Tanggal SEP harus diisi');
  return false;
}
if (!formData.value.payor_id) {
  alert('Payor harus dipilih');
  return false;
}
return true;
}

const handleSubmit = () => {
if (!validateForm()) return;

const param: BPJSSepClaimRequest = {
  tglsep: formData.value.tglsep,
  jnspelayanan: formData.value.jnspelayanan,
  payor_id: formData.value.payor_id
};
  fecthBridgingPayor(param);
};

const handleReset = () => {
formData.value = {
  tglsep: new Date().toISOString().split('T')[0],
  jnspelayanan: '1',
  payor_id: 0
};
emit('filter', formData.value);
};

const handleRetry = () => {
if (validateForm()) {
  handleSubmit();
}
};

const handleSave = (row: any) => {
  emit('save', row);

  const param: BPJSSaveSEPClaimRequest = {
    payor_id : formData.value.payor_id,
    claim_payor_no : row.noSep,
  };
  createPayorClaim(param).then(() => {
    alert('Data klaim berhasil disimpan');
  }).catch((err) => { })

};
 

const formatDate = (dateString: string) => {
if (!dateString) return '-';
return new Date(dateString).toLocaleDateString('id-ID');
};

const getJenisPelayanan = (jenis: string) => {
return jenis === '1' ? 'Rawat Inap' : 'Rawat Jalan';
};

const getBadgeClass = (jenis: string) => {
return jenis === '1' ? 'badge-primary' : 'badge-secondary';
};

// Lifecycle
onMounted(() => {
fetchMasterPayors(1, 200);
});
</script>

<style >
.form-container {
background: #f8f9fa;
padding: 1.5rem;
border-radius: 0.5rem;
border: 1px solid #e9ecef;
}

.loading {
text-align: center;
padding: 2rem;
}

.error {
text-align: center;
padding: 1rem;
}
</style>