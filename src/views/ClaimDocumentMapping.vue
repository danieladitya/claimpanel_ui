<!-- src/views/ClaimDocumentMapping.vue -->
<template>
  <AdminLayout>
    <div class="container p-6 mx-auto">
      <div class="flex flex-col gap-6 lg:flex-row">
        <PayorList
          :payors="payors"
          :selectedPayorId="selectedPayor?.id ?? null"
          @select="onSelectPayor"
        />
  
        <div class="w-full p-6 bg-white rounded-lg shadow lg:w-2/3" v-if="selectedPayor">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h2 class="text-xl font-bold text-gray-800">
                {{ selectedPayor.payor_name }}
              </h2>
              <p class="text-gray-600">Kelola mapping dokumen untuk payor ini</p>
            </div>
          </div>
  
          <DocumentFilterBar
            v-model:search="search"
            v-model:category="category"
            v-model:status="status"
          />
  
          <DocumentList
            :documents="filteredDocuments"
            @toggle="onToggleDocument"
          />
        </div>
      </div>
    </div>
  </AdminLayout>
  </template>
  
  <script setup lang="ts">
  import { ref } from "vue";
   import PayorList from "@/components/payor/PayorList.vue";
  import DocumentList from "@/components/payor/DocumentList.vue";
  import DocumentFilterBar from "@/components/payor/DocumentFilterBar.vue";
  import { useDocumentFilter } from "@/composables/useDocumentFilter";
  import type { MasterPayor } from "@/interface/IMasterPayor";
  import type { MasterDocument } from "@/interface/IMasterDocument";
import AdminLayout from '@/layouts/AdminLayout.vue';
  
  const payors = ref<MasterPayor[]>([
    {
      id: 1,
      payor_code: "BPJS",
      payor_name: "BPJS Kesehatan",
      gc_payor_type: "Pemerintah",
      code_external: "BPJS",
      is_active: 1,
      is_deleted: 0,
      created_by: 1,
      created_at: "2024-01-01",
      updated_by: null,
      updated_at: null,
      document_count: 5,
    },
    {
      id: 2,
      payor_code: "ASTRA",
      payor_name: "Astra Life",
      gc_payor_type: "Swasta",
      code_external: "ASTRA",
      is_active: 1,
      is_deleted: 0,
      created_by: 1,
      created_at: "2024-01-01",
      updated_by: null,
      updated_at: null,
      document_count: 3,
    },
  ]);
  
  const dummyDocumentsByPayor: Record<number, MasterDocument[]> = {
    1: [
      {
        id: 1,
        document_code: "FRM_BPJS",
        document_name: "Formulir Klaim BPJS",
        document_keyword: "form klaim",
        category: "Medis",
        mandatory: true,
        description: "Formulir resmi klaim BPJS",
        is_active: 1,
        is_deleted: 0,
        created_at: "2024-01-01",
        created_by: 1,
        updated_at: null,
        updated_by: null,
      },
      {
        id: 2,
        document_code: "KARTU_BPJS",
        document_name: "Kartu Peserta BPJS",
        document_keyword: "kartu peserta",
        category: "Administrasi",
        mandatory: true,
        description: "Fotokopi kartu peserta BPJS",
        is_active: 1,
        is_deleted: 0,
        created_at: "2024-01-01",
        created_by: 1,
        updated_at: null,
        updated_by: null,
      },
    ],
    2: [
      {
        id: 3,
        document_code: "FRM_AST",
        document_name: "Formulir Klaim Astra",
        document_keyword: "form klaim astra",
        category: "Administrasi",
        mandatory: true,
        description: "Formulir klaim untuk Astra Life",
        is_active: 1,
        is_deleted: 0,
        created_at: "2024-01-01",
        created_by: 1,
        updated_at: null,
        updated_by: null,
      },
    ],
  };
  
  const selectedPayor = ref<MasterPayorUI | null>(null);
  const documents = ref<MasterDocumentUI[]>([]);
  
  const { search, category, status, filtered } = useDocumentFilter(documents);
  const filteredDocuments = filtered;
  
  function onSelectPayor(payor: MasterPayorUI) {
    selectedPayor.value = payor;
    documents.value = dummyDocumentsByPayor[payor.id] ?? [];
  }
  
  function onToggleDocument(payload: { document: MasterDocumentUI; checked: boolean }) {
    payload.document.mandatory = payload.checked;
  }
  </script>
  