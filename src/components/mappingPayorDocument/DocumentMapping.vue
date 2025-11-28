<script setup lang="ts">
import type { PayorDetail } from "@/types/Payor";
import DocumentMappingConfirmDeleted from "@/components/mappingPayorDocument/DocumentMappingConfirmDeleted.vue";
import { PencilSquareIcon, TrashIcon, PlusIcon } from "@heroicons/vue/24/outline";
import DocumentFormModal from "./DocumentFormModal.vue";
import { ref } from 'vue';
import { deleteDocumentRule } from "@/services/document-rule.service";

 const showModal = ref(false);
const editData = ref(null);

function openCreate() {
  editData.value = null;
  showModal.value = true;
}

function openEdit(item: any) {
  editData.value = item; 
  showModal.value = true;
}
const emits = defineEmits(["saved"]);

const showDeleteModal = ref(false);
const deleteId = ref<number | null>(null);
function askDelete(id: number) {
  
  deleteId.value = id;
  showDeleteModal.value = true;
}
async function confirmDelete() {
  if (!deleteId.value) return;

    await deleteDocumentRule
    (deleteId.value);
  showDeleteModal.value = false;
  deleteId.value = null;
  emits("saved"); // refresh payor detail
 }
const props = defineProps<{
  payor: PayorDetail | null;
}>();


</script>

<template>
  <div class="w-full p-6 bg-white rounded-lg shadow lg:w-2/3" v-if="payor">
    
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-xl font-bold text-gray-800">{{ payor.payor_name }}</h2>
        <p class="text-gray-600">Kelola mapping dokumen</p>
      </div>
      <div>
      <button @click="openCreate"
        class="flex items-center px-4 py-2 text-white bg-blue-500 rounded">
  <PlusIcon class="w-4 h-4"/>  Dokumen
</button>
    </div>

    </div>

    <!-- Document List -->
    <div class="space-y-4 max-h-[calc(100vh-350px)] overflow-y-auto">
      <table class="table table-compact">
        <thead>
          <tr>
            <th>Dokumen</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr   v-for="doc in payor.document_rules" :key="doc.document_id">
            <td><h3 class="font-medium text-gray-800">{{ doc.document_name }}</h3>
              <div class="flex gap-2 mt-2">
                <span class="text-yellow-800 bg-yellow-100">
                  {{ doc.document_type }}
                </span>
                <span class="px-2 py-1 text-xs text-blue-800 bg-blue-100 rounded">
                  {{ doc.claim_service_type }}  
                </span>
               
             <span :class="['status', doc.is_active == 1 ? 'active' : 'inactive']">
                    {{ doc.is_active ? 'Active' : 'Inactive' }}
                   
                    </span>
                    
                 
              </div>
            </td>
            <td>
              <button 
              @click="openEdit(doc)"
                      class="icon-bg-primary"
                      title="Edit"
                    >
                      <PencilSquareIcon class="w-4 h-4" />
                    </button>
                    &nbsp;
                    &nbsp;
                    <button 
              @click="askDelete(doc.id)"
                      class="icon-bg-danger"
                      title="Remove"
                    >
                      <TrashIcon class="w-4 h-4" />
                    </button>
 
            </td>
          </tr>
        </tbody>
      </table>
      
    
<DocumentFormModal
  :visible="showModal"
  :payor-id="payor.id"
  :edit-data="editData"
  @close="showModal = false"
  @saved="$emit('saved')"
  />

  <DocumentMappingConfirmDeleted
  :visible="showDeleteModal"
  message="Yakin ingin menghapus mapping dokumen ini?"
  @close="showDeleteModal = false"
  @confirm="confirmDelete"
/>


    </div>
  

  </div>

  
</template>
