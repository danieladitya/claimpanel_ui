<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'

const claims = ref<any[]>([])
const isLoading = ref(false)

const emit = defineEmits<{
  (e: 'openDetail', id: string): void
}>()

async function fetchClaims() {
  isLoading.value = true
  try {
    const { data } = await axios.get('http://127.0.0.1:8000/api/v1/claims')
    claims.value = data
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchClaims)

// 🔢 summary cards
const total = computed(() => claims.value.length)
const approved = computed(() => claims.value.filter(c => c.claim_status === 'approved').length)
const pending = computed(() => claims.value.filter(c => c.claim_status === 'pending' || c.claim_status === 'draft').length)
const rejected = computed(() => claims.value.filter(c => c.claim_status === 'rejected').length)
</script>

<template>
  <AdminLayout>
  <div>
    <h1 class="mb-4 text-xl font-bold">📊 Dashboard Klaim</h1>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2 md:grid-cols-4">
      <div class="p-4 text-center bg-white rounded-lg shadow">
        <p class="text-sm text-gray-500">Total Klaim</p>
        <p class="text-2xl font-bold text-blue-600">{{ total }}</p>
      </div>
      <div class="p-4 text-center bg-white rounded-lg shadow">
        <p class="text-sm text-gray-500">Approved</p>
        <p class="text-2xl font-bold text-green-600">{{ approved }}</p>
      </div>
      <div class="p-4 text-center bg-white rounded-lg shadow">
        <p class="text-sm text-gray-500">Pending</p>
        <p class="text-2xl font-bold text-yellow-600">{{ pending }}</p>
      </div>
      <div class="p-4 text-center bg-white rounded-lg shadow">
        <p class="text-sm text-gray-500">Rejected</p>
        <p class="text-2xl font-bold text-red-600">{{ rejected }}</p>
      </div>
    </div>

    <!-- Table Klaim -->
    <div class="overflow-hidden bg-white rounded-lg shadow">
      <table class="w-full text-sm">
        <thead class="bg-gray-50">
          <tr>
            <th class="p-3 text-left">No</th>
            <th class="p-3 text-left">SEP No</th>
            <th class="p-3 text-left">Pasien</th>
            <th class="p-3 text-left">Tgl SEP</th>
            <th class="p-3 text-left">Status</th>
            <th class="p-3 text-left">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="c in claims" :key="c.id" class="border-b hover:bg-gray-50">
            <td class="p-3">{{ c.claim_number }}</td>
            <td class="p-3">{{ c.sep_number }}</td>
            <td class="p-3">{{ c.sep_info?.data?.response?.peserta?.nama }}</td>
            <td class="p-3">{{ c.sep_info?.data?.response?.tglSep }}</td>
            <td class="p-3">
              <span
                :class="{
                  'text-green-600': c.claim_status==='approved',
                  'text-yellow-600': c.claim_status==='pending' || c.claim_status==='draft',
                  'text-red-600': c.claim_status==='rejected'
                }"
              >
                {{ c.claim_status }}
              </span>
            </td>
            <td class="p-3">
              <button @click="$emit('openDetail', c.id)" class="text-blue-600 hover:underline">
                Detail
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</AdminLayout>
</template>
