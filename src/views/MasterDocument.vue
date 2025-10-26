<template>
    <AdminLayout>
      <div class="container py-6 mx-auto">
        <!-- Header -->
        <div class="mb-4 card">
          <div class="flex items-center justify-between card-body">
            <h1 class="card-title">Daftar Dokumen Klaim</h1>
            <div class="space-x-2">
              <button class="btn btn-success" @click="openAddModal" :disabled="loading">
                + Tambah Baru
              </button>
              <!-- <button class="btn btn-primary" @click="fetchDocuments" :disabled="loading">
                <span v-if="loading" class="mr-2 loader"></span>
                {{ loading ? "Loading..." : "Refresh" }}
              </button> -->
            </div>
          </div>
        </div>
        <!-- Error Alert -->
        <div v-if="error" class="mb-4 card card-error">
          <div class="card-body">
            <p>{{ error }}</p>
            <button @click="clearError" class="btn btn-ghost btn-sm">Tutup</button>
          </div>
        </div>
        <!-- Table -->
        <div class="card">
          <div class="overflow-x-auto card-body">
            <MasterDocumentTable
              :documents="documents" 
              :loading="loading"
              @edit="openEditModal"
              @delete="handleDeleteDocument"
            />
          </div>
        </div>
  
        <!-- Modal Form -->
        <BaseModal
  :isOpen="showModal"
  title="Dokumen"
  :fullscreen="false"
  @close="handleModalClose"
>
<div class="row">
    <div class="col-md-6">
        
      <form @submit.prevent="saveDocument">
                <input type="hidden" v-model="form.id" />
                
                <!-- Document Name -->
                <div class="mb-4">
                  <label class="form-label">Nama Dokumen *</label>
                  <input 
                    v-model="form.document_name" 
                    type="text" 
                    class="form-control" 
                    :class="{ 'border-red-500': errors.document_name }"
                    placeholder="Masukkan nama dokumen"
                    required 
                  />
                  <p v-if="errors.document_name" class="mt-1 text-sm text-red-500">
                    {{ errors.document_name }}
                  </p>
                </div>

                <!-- Document Keyword -->
                <div class="mb-4">
                  <label class="form-label">Kata Kunci *</label>
                  <input 
                    v-model="form.document_keyword" 
                    type="text" 
                    class="form-control" 
                    :class="{ 'border-red-500': errors.document_keyword }"
                    placeholder="Masukkan kata kunci dokumen"
                    required 
                  />
                  <p v-if="errors.document_keyword" class="mt-1 text-sm text-red-500">
                    {{ errors.document_keyword }}
                  </p>
                </div>

                <!-- Status -->
                <div class="mb-6">
                  <label class="form-label">Status</label>
                  <select v-model="form.is_active" class="form-control">
                    <option :value="1">Aktif</option>
                    <option :value="0">Nonaktif</option>
                  </select>
                </div>

                <!-- Action Buttons -->
                <div class="flex justify-end space-x-2">
                  <button 
                    type="button" 
                    @click="closeModal" 
                    class="btn btn-secondary"
                    :disabled="saving"
                  >
                    Batal
                  </button>
                  <button 
                    type="submit" 
                    class="btn btn-primary"
                    :disabled="saving"
                  >
                    <span v-if="saving" class="mr-2 loader"></span>
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
  import { ref, onMounted, reactive } from "vue";
  import api from "@/services/api";
  import AdminLayout from "@/layouts/AdminLayout.vue";
  import { PencilSquareIcon, TrashIcon } from "@heroicons/vue/24/outline";
 import BaseModal from '@/components/ui/BaseModal.vue';
import MasterDocumentTable from '@/components/masterDocument/masterDocumentTable.vue';
import { useMasterDocument } from '@/composables/masterDocument';
import { MasterDocumentRequest, MasterDocument } from '../interface/IMasterDocument';

// Di komponen utama
const { 
  loading, 
  saving,
  error,
  pagination,
  totalDocuments,
  currentPage,
  totalPages,
  hasNext,
  hasPrevious,
  documents, // INI YANG DIPAKAI UNTUK TABLE
  fetchMasterDocuments,
  createData,
  updateData,
  deleteData
} = useMasterDocument();  

  // state
      
  // modal state
  const showModal = ref(false);
  // Juga perbaiki fungsi fetchDocuments di button:
async function fetchDocuments() {
  await fetchMasterDocuments(currentPage.value, 10);
}

onMounted(async () => {
  fetchDocuments();
});
    // Tutup modal
    function handleModalClose() {
    showModal.value = false;
    resetForm();
    clearError();
  }
    // Clear error
    const clearError = () => {
    error.value = null;
  };
  
    // Reset form
    function resetForm() {
    Object.assign(form, {
      id: 0,
      document_code: "",
      document_name: "",
      document_keyword: "",
      is_active: 1
    });
    
    errors.document_name = "";
    errors.document_keyword = "";
  }
  const editMode = ref(false);
  const form = ref<MasterDocumentRequest>({
    id: 0,
    document_code: "",
    document_name: "",
    document_keyword: "",
    is_active: 1
  });
  
 
  // buka modal tambah
  function openAddModal() {
     editMode.value = false;
    form.value = {
      id: 0,
      document_code: "",
      document_name: "",
      document_keyword: "",
      is_active: 1
    };
    showModal.value = true;
  }
  
  // buka modal edit
  function openEditModal(doc: MasterDocumentRequest) {
    editMode.value = true;
    form.value = { ...doc };
    showModal.value = true;
  }
  
  // tutup modal
  function closeModal() {
    showModal.value = false;
  }
  
  // Form errors
  const errors = reactive({
    document_name: "",
    document_keyword: ""
  });
  //validasi form
  function validateForm(): boolean {
    let isValid = true;
    
    if (!form.value.document_name.trim()) {
      errors.document_name = "Nama dokumen wajib diisi";
      isValid = false;
    } else {
      errors.document_name = "";
    }
    
    if (!form.value.document_keyword.trim()) {
      errors.document_keyword = "Kata kunci wajib diisi";
      isValid = false;
    } else {
      errors.document_keyword = "";
    }
    
    return isValid;
  }
  
  // simpan (tambah / edit)
  async function saveDocument() {
    if(!validateForm()) return;
    const formData : MasterDocumentRequest = {
      id: form.value.id,
      document_code: form.value.document_code,
      document_name: form.value.document_name,
      document_keyword: form.value.document_keyword,
      is_active: form.value.is_active
    };

    let result
    if(editMode.value) {
      // update
      result = await updateData(formData.id ,formData)
    } else {
      // create
      result = await createData(formData);
    }
    if(result?.success) {
      closeModal();
      alert(`Data dokumen berhasil ${editMode.value ? 'diupdate' : 'disimpan'}.`);
      await fetchMasterDocuments(currentPage.value, 10);
    }

  }
  
 
  async function handleDeleteDocument(id: number) {
  if (!confirm("Yakin hapus data ini?")) return;
  
  // PERBAIKI: Gunakan deleteData dari composable, bukan deleteDocument
  const result = await deleteData(id);
  if (result.success) {
    await fetchMasterDocuments(currentPage.value, 10);
  }
}
  // format tanggal
  function formatDate(dateString: string) {
    const d = new Date(dateString);
    return d.toLocaleString("id-ID", {
      dateStyle: "short",
      timeStyle: "short"
    });
  }
   
     </script>
  