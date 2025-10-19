<script setup lang="ts">
import ClaimStatusBadge from '@/components/claim/ClaimStatusBadge.vue'
import IClaim from '@/interface/Iclaim';
import { formatDateForTable } from '../../utils/dataHelper';

defineProps<{
    claims : IClaim[]
}>()
</script>

<template>  <div class="overflow-x-auto bg-white border rounded-lg shadow-sm">
  <table class="table text-sm text-gray-600 table-striped">
    <thead class="text-xs text-gray-500 uppercase bg-gray-50">
      <tr>
        <th class="px-6 py-3">No.Klaim</th>
        <th class="px-6 py-3">SEP dan No. Kartu</th>
        <th class="px-6 py-3">Pasien</th>
        <th class="px-6 py-3">Tanggal SEP</th>
        <th class="px-6 py-3">Status File</th>
        <th class="px-6 py-3">Status Klaim</th>
        <th class="px-6 py-3 text-right">Aksi</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="claim in claims"
        :key="claim.id"
        class="border-t hover:bg-gray-50"
      >
        <td class="px-6 py-3 font-medium text-gray-900">
          {{ claim.claim_number }}
        </td>
        <td class="px-6 py-3 font-mono text-xs text-gray-500">
         <p>{{ claim.sep_number }}</p> 
          {{ claim?.sep_info?.data?.response?.peserta?.noKartu}}
             
        </td>
        <td class="px-6 py-3">
          <div>
            <div class="font-medium text-gray-900">
              {{ claim?.sep_info?.data?.response?.peserta?.nama }}

              <!-- {{ getPatientName(claim.sep_info) }} -->
            </div>
            <div class="text-xs text-gray-500">
              <p class="font-mono text-xs text-gray-500">{{ claim?.sep_info?.data?.response?.peserta?.noMr}} </p>
               
            </div>
          </div>
        </td>
        <td class="px-6 py-3">
          {{ claim?.sep_info?.data?.response?.tglSep }}
          <!-- {{ formatDate(claim.created_at) }} -->
        </td>
        <td class="px-6 py-3">
          <span 
            class="px-2 py-1 text-xs rounded-full"
            :class="{
              'bg-green-100 text-green-800': claim.claim_file_status === 'uploaded',
              'bg-yellow-100 text-yellow-800': claim.claim_file_status === 'pending',
              'bg-red-100 text-red-800': claim.claim_file_status === 'rejected',
              'bg-gray-100 text-gray-800': !claim.claim_file_status
            }"
          >
            {{ claim.claim_file_status || 'Belum upload' }}
          </span>
        </td>
        <td class="px-6 py-3">
          <ClaimStatusBadge :status="claim.claim_status" />
        </td>
        <td class="px-6 py-3 space-x-2 text-right">
          <router-link class="px-3 py-1 text-xs text-gray-600 rounded bg-gray-50 hover:bg-gray-100"  :to="`/admin/claims/${claim.id}`">Detail</router-link>
            
<!--           
          <button 
            class="px-3 py-1 text-xs text-gray-600 rounded bg-gray-50 hover:bg-gray-100"
            @click="$emit('edit-claim', claim)"
          >
            Edit
          </button> -->
        </td>
      </tr>
    </tbody>
  </table>
</div>
</template>
