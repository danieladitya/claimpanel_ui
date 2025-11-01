<template>
    <AdminLayout>
    <div class="container py-6 mx-auto">
        <div class="container py-6 mx-auto">
        <!-- Header -->
        <div class="mb-6 shadow-sm card bg-base-100">
          <div class="card-body">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-xl font-bold card-title">Daftar Klaim</h2>
               </div>
               <div class="flex space-x-2">
                <button
                  @click="openSyncModal"
                class="btn btn-primary btn-sm flex items-center gap-2">
                 <ArrowPathIcon class="w-4 h-4"  />V-Claim
                </button>
                <button 
                class="btn btn-primary btn-sm flex items-center gap-2"
                  @click="openAddModal"
                  :disabled="loading"
                >
                 <PlusIcon class="w-4 h-4" />Tambah Baru
                </button>
                 
              </div>
            </div>
          </div>
        </div>
  
        <!-- Error Alert -->
        <div v-if="error" class="mb-6 alert alert-error">
          <div>
            <span>{{ error }}</span>
            <button @click="clearError" class="btn btn-ghost btn-sm">Tutup</button>
          </div>
        </div>
  
        <!-- Table -->
        <div class="shadow-sm card bg-base-100">
          <div class="card-body">
            <ClaimTable
              :claims="claims"
              :loading="loading"
              @edit="openEditModal"
              @delete="handleDeleteData"
            />
          </div>
        </div>
        </div>
    </div>
    <BaseModal
  :isOpen="showSyncModal"
  title="v-Claim Sync"
  :fullscreen="true"
  @close="handleModalClose"
>
<ClaimSyncPayor/>
    </BaseModal>
    </AdminLayout>
</template>

<script lang="ts" setup>
import AdminLayout from '@/layouts/AdminLayout.vue';
import { useClaims } from '../composables/claims';
import { reactive, ref } from 'vue';
import  ClaimTable  from "@/components/claim/ClaimTable.vue";
import { ArrowPathIcon, PlusIcon } from "@heroicons/vue/24/outline";
import BaseModal from '@/components/ui/BaseModal.vue';
import ClaimSyncPayor from '@/components/claim/ClaimSyncPayor.vue';
const showSyncModal = ref(false);
const {
    claims, 
    loading,
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

  // Modal state
  const showModal = ref(false);
  const editMode = ref(false);
    
  // Clear error
  const clearError = () => {
    error.value = null;
  };
const openEditModal = (id: number) => {
    // Logic to open edit modal
};
const handleDeleteData = () => {
    // Logic to open add modal
};
const openAddModal = () => {
    // Logic to open add modal
};
const openSyncModal = () => {
    showSyncModal.value = true;
    // Logic to open sync modal
};
const handleModalClose = () => {
    showSyncModal.value = false;
};
</script>
