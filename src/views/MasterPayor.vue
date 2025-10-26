<!-- views/MasterPayorView.vue -->
<template>
    <AdminLayout>
      <div class="container py-6 mx-auto">
        <!-- Header -->
        <div class="mb-6 shadow-sm card bg-base-100">
          <div class="card-body">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-xl font-bold card-title">Daftar Penjamin Bayar</h2>
               </div>
              <div class="space-x-2 ">
                <button 
                  class="btn btn-success btn-sm"
                  @click="openAddModal"
                  :disabled="loading"
                >
                + Tambah Baru
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
            <MasterPayorTable
              :payors="payors"
              :loading="loading"
              @edit="openEditModal"
              @delete="handleDeletePayor"
            />
          </div>
        </div>
  
         
  
        <!-- Modal Form -->
        <BaseModal
          :isOpen="showModal"
          :title="editMode ? 'Edit Payor' : 'Tambah Payor'"
          :fullscreen="false"
          @close="handleModalClose"
        >
        <div class="row">
          <div class="col-md-12">
            <form @submit.prevent="savePayor" class="space-y-4">
            <input type="hidden" v-model="form.id" />
            
            <!-- Payor Code -->
            <div class="form-group">
              <label class="form-label">
                Kode Payor
              </label>
              <input 
                v-model="form.payor_code" 
                type="text" 
                class="form-control"
                :class="{ 'input-error': errors.payor_code }"
                placeholder="Masukkan kode payor"
                readonly
              />
                 <small v-if="errors.payor_code" class="label-text-alt text-error">{{ errors.payor_code }}</small>
             </div>
  
            <!-- Payor Name -->
            <div class="form-group">
              <label class="form-label">
                Nama Payor * 
              </label>
              <input 
                v-model="form.payor_name" 
                type="text" 
                class="form-control"
                :class="{ 'input-error': errors.payor_name }"
                placeholder="Masukkan nama payor"
                required
              />
             
                <small v-if="errors.payor_name" class="label-text-alt text-error">{{ errors.payor_name }}</small>
           
            </div>
  
            <!-- Payor Type -->
            <div class="form-group" >
              <label class="form-label">
                Tipe Payor *
              </label>
              <select 
              v-model="form.gc_payor_type"
              required
              class="form-control"
                  :class="{ 'input-error': errors.gc_payor_type }"
                 
              >
                <option value="">Pilih...</option>
                <option 
                  v-for="item in typePayerOptions" 
                  :key="item.standardcode_id" 
                  :value="item.standardcode_id"
                >
                  {{ item.standardcode_name }}
                </option>
              </select>
                <small v-if="errors.gc_payor_type" class="label-text-alt text-error">{{ errors.gc_payor_type }}</small>
               
            </div>
  
            <!-- External Code -->
            <div class="form-group">
              <label class="form-label">
                Kode External
              </label>
              <input 
                v-model="form.code_external" 
                type="text" 
                class="form-control"
                placeholder="Masukkan kode external (opsional)"
              />
            </div>
  
            <!-- Status -->
            <div class="form-group">
              <label class="form-label">
                Status
              </label>
              <select v-model="form.is_active"  class="form-control">
                <option :value="1">Aktif</option>
                <option :value="0">Nonaktif</option>
              </select>
            </div>
  
            <!-- Action Buttons -->
            <div class="flex justify-end pt-4 space-x-2">
              <button 
                type="button" 
                @click="closeModal" 
                class="btn btn-ghost"
                :disabled="saving"
              >
                Batal
              </button>
              <button 
                type="submit" 
                class="btn btn-primary"
                :disabled="saving"
              >
                <span v-if="saving" class="mr-2 loading loading-spinner loading-sm"></span>
                {{ saving ? "Menyimpan..." : (editMode ? "Update" : "Simpan") }}
              </button>
            </div>
          </form>
          </div>
        </div>
          
        </BaseModal>
      </div>
    </AdminLayout>
  </template>
  
  <script setup lang="ts">
  import { ref, reactive, onMounted, computed } from 'vue';
  import { useMasterPayor } from "@/composables/masterPayor";
  import type { MasterPayor, MasterPayorRequest } from "@/interface/IMasterPayor";
  import AdminLayout from "@/layouts/AdminLayout.vue";
  import BaseModal from '@/components/ui/BaseModal.vue';
  import MasterPayorTable from '@/components/masterPayor/MasterPayorTable.vue';
  import { PlusIcon, ArrowPathIcon } from "@heroicons/vue/24/outline";
import { useSpecificReference } from '../composables/standardCode';
  
  // Composable
  const { 
    payors, 
    loading, 
    saving,
    error, 
    fetchMasterPayors,
    createData,
    updateData,
    deleteData
  } = useMasterPayor();
  
  // Modal state
  const showModal = ref(false);
  const editMode = ref(false);
  
  // Form state
  const form = reactive<MasterPayorRequest & { id: number }>({
    id: 0,
    payor_code: "",
    payor_name: "",
    gc_payor_type: "",
    code_external: "",
    is_active: 1
  });
  
  // Form errors
  const errors = reactive({
    payor_code: "",
    payor_name: "",
    gc_payor_type: ""
  });
  
  // Clear error
  const clearError = () => {
    error.value = null;
  };
  
  // Handle modal close
  const handleModalClose = () => {
    showModal.value = false;
    resetForm();
    clearError();
  };
  
  // Reset form
  const resetForm = () => {
    Object.assign(form, {
      id: 0,
      payor_code: "",
      payor_name: "",
      gc_payor_type: "",
      code_external: "",
      is_active: 1
    });
    
    Object.keys(errors).forEach(key => {
      errors[key as keyof typeof errors] = "";
    });
  };
  //option select payor type
  const selectedPayerType = ref('')
  const statusReference = useSpecificReference('X006')
  const typePayerOptions = computed(() => statusReference.getOptions())

  // Validate form
  const validateForm = (): boolean => {
    let isValid = true;
 
    if (!form.payor_name.trim()) {
      errors.payor_name = "Nama payor wajib diisi";
      isValid = false;
    } else {
      errors.payor_name = "";
    }
    
    if (!form.gc_payor_type.trim()) {
      errors.gc_payor_type = "Tipe payor wajib diisi";
      isValid = false;
    } else {
      errors.gc_payor_type = "";
    }
    
    return isValid;
  };
  
  // Fetch payors
  const fetchPayors = async () => {
    await fetchMasterPayors(1, 100);
  };
  
  // Open add modal
  const openAddModal = () => {
    editMode.value = false;
    resetForm();
    showModal.value = true;
  };
  
  // Open edit modal
  const openEditModal = (payor: MasterPayor) => {
    editMode.value = true;
    Object.assign(form, {
      id: payor.id,
      payor_code: payor.payor_code,
      payor_name: payor.payor_name,
      gc_payor_type: payor.gc_payor_type,
      code_external: payor.code_external,
      is_active: payor.is_active
    });
    showModal.value = true;
  };
  
  // Close modal
  const closeModal = () => {
    showModal.value = false;
    resetForm();
  };
  
  // Save payor (create or update)
  const savePayor = async () => {
    if (!validateForm()) return;
    
    const formData: MasterPayorRequest = {
      payor_code: form.payor_code,
      payor_name: form.payor_name,
      gc_payor_type: form.gc_payor_type,
      code_external: form.code_external,
      is_active: form.is_active
    };
    
    let result;
    
    if (editMode.value) {
      result = await updateData(form.id, formData);
    } else {
      result = await createData (formData);
    }
    
    if (result?.success) {
      closeModal();
      // Show success message
      alert(`Data payor berhasil ${editMode.value ? 'diupdate' : 'disimpan'}!`);
      await fetchPayors()
    }
  };
  
  // Handle delete payor
  const handleDeletePayor = async (id: number) => {
    if (!confirm("Yakin hapus data payor ini?")) return;
    
    const result = await deleteData(id);
    if (result?.success) {
      alert("Payor berhasil dihapus!");
      await fetchPayors()
    }
  };
  
 
  
  // Load data on mount
  onMounted(async () => {
      fetchPayors()
      await statusReference.load()
  });
  </script>