<template>
    <AdminLayout>
      <div class="container py-6 mx-auto">
        <!-- Header -->
        <div class="mb-4 card">
          <div class="flex items-center justify-between card-body">
            <h1 class="card-title">Daftar Tipe Dokumen</h1>
            <div class="space-x-2">
              <button class="btn btn-success" @click="openAddModal">
                + Tambah Baru
              </button>
              <button class="btn btn-primary" @click="fetchDocuments" :disabled="loading">
                <span v-if="loading" class="mr-2 loader"></span>
                {{ loading ? "Loading..." : "Refresh" }}
              </button>
            </div>
          </div>
        </div>
  
        <!-- Table -->
        <div class="card">
          <div class="overflow-x-auto card-body">
            <table class="table text-sm text-gray-600 table-striped table-hover">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tipe Dokumen</th>
                  <th>Kata Kunci</th>
                  <th>Status</th>
                  <th>Dibuat</th>
                  <th>Diperbarui</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="doc in documents" :key="doc.id">
                  <td>{{ doc.id }}</td>
                  <td>{{ doc.document_type }}</td>
                  <td>{{ doc.keyword_text }}</td>
                  <td>
                    <span
                      :class="[
                        'badge',
                        doc.is_active === 1 ? 'badge-success' : 'badge-secondary'
                      ]"
                    >
                      {{ doc.is_active === 1 ? 'Aktif' : 'Nonaktif' }}
                    </span>
                  </td>
                  <td>{{ formatDate(doc.created_at) }}</td>
                  <td>{{ formatDate(doc.updated_at) }}</td>
                  <td class="flex space-x-2">
                    <button @click="openEditModal(doc)" class="p-1 rounded hover:bg-gray-100">
                      <PencilSquareIcon class="w-5 h-5 text-blue-500" />
                    </button>
                    <button @click="deleteDocument(doc.id)" class="p-1 rounded hover:bg-gray-100">
                      <TrashIcon class="w-5 h-5 text-red-500" />
                    </button>
                  </td>
                </tr>
                <tr v-if="!loading && documents.length === 0">
                  <td colspan="7" class="py-4 text-center text-gray-500">
                    Tidak ada data
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
  
        <!-- Modal Form -->
        <BaseModal
  :isOpen="showModal"
  title="Tipe Dokumen"
  :fullscreen="false"
  @close="handleModalClose"
>
<div class="row">
    <div class="col-md-6">
        
              <form @submit.prevent="saveDocument">
                <input type="hidden" v-model="form.id" />
                <div class="mb-3">
                  <label class="form-title">Tipe Dokumen</label>
                  <input v-model="form.document_type" type="text" class="form-control" required />
                </div>
                <div class="mb-3">
                  <label class="form-title">Kata Kunci</label>
                  <input v-model="form.keyword_text" type="text" class="form-control" required />
                </div>
                <div class="mb-3">
                  <label class="form-title">Status</label>
                  <select v-model="form.is_active" class="form-control">
                    <option :value="1">Aktif</option>
                    <option :value="0">Nonaktif</option>
                  </select>
                </div>
                <div class="flex justify-end space-x-2">
                  <button type="button" @click="closeModal" class="btn btn-secondary">Batal</button>
                  <button type="submit" class="btn btn-primary">
                    {{ editMode ? "Update" : "Simpan" }}
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
  import { ref, onMounted } from "vue";
  import api from "@/services/api";
  import AdminLayout from "@/layouts/AdminLayout.vue";
  import { PencilSquareIcon, TrashIcon } from "@heroicons/vue/24/outline";
  import Ikeyword from "@/interface/Ikeyword";
import BaseModal from '@/components/ui/BaseModal.vue';
  
  // state
  const documents = ref<Ikeyword[]>([]);
  const loading = ref(false);
  
  // modal state
  const showModal = ref(false);
  
    // Tutup modal
    function handleModalClose() {
        showModal.value = false
        fetchDocuments()
    }

  const editMode = ref(false);
  const form = ref<Ikeyword>({
    id: 0,
    document_type: "",
    keyword_text: "",
    is_active: 1,
    created_at: "",
    updated_at: ""
  });
  
  // fetch data
  async function fetchDocuments() {
    loading.value = true;
    try {
      const resp = await api.get("/keywords");
      if (resp.data.success) {
        documents.value = resp.data.data;
      }
    } catch (err) {
      console.error("Error fetching documents:", err);
    } finally {
      loading.value = false;
    }
  }
  
  // buka modal tambah
  function openAddModal() {
    editMode.value = false;
    form.value = {
      id: 0,
      document_type: "",
      keyword_text: "",
      is_active: 1,
      created_at: "",
      updated_at: ""
    };
    showModal.value = true;
  }
  
  // buka modal edit
  function openEditModal(doc: Ikeyword) {
    editMode.value = true;
    form.value = { ...doc };
    showModal.value = true;
  }
  
  // tutup modal
  function closeModal() {
    showModal.value = false;
  }
  
  // simpan (tambah / edit)
  async function saveDocument() {
    try {
      if (editMode.value) {
        await api.post(`/keywords/update`, form.value);
      } else {
        await api.post("/keywords", form.value);
      }
      fetchDocuments();
      closeModal();
    } catch (err) {
      console.error("Error saving document:", err);
    }
  }
  
  // hapus data
  async function deleteDocument(id: number) {
    if (!confirm("Yakin hapus data ini?")) return;
    try {
      await api.post(`/keywords/delete`, form.value);
      fetchDocuments();
    } catch (err) {
      console.error("Error deleting document:", err);
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
  
  // load pertama kali
  onMounted(fetchDocuments);
  </script>
  