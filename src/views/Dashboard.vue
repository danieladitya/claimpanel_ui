<script setup lang="ts">
import { ref } from 'vue'
import ClaimDashboard from '@/components/claim/ClaimDashboard.vue'
import ClaimDetail from '@/components/claim/ClaimDetail.vue'
import AdminLayout from '@/layouts/AdminLayout.vue';

const currentView = ref<'dashboard' | 'detail'>('dashboard')
const selectedClaimId = ref<string | null>(null)

function handleOpenDetail(id: string) {
  selectedClaimId.value = id
  currentView.value = 'detail'
}
</script>

<template>
  <AdminLayout>
    <ClaimDashboard v-if="currentView==='dashboard'" 
                    @openDetail="handleOpenDetail" />
    <ClaimDetail v-if="currentView==='detail'" 
                 :claimId="selectedClaimId" 
                 @back="currentView='dashboard'" />
  </AdminLayout>
</template>
