<!-- src/components/document/DocumentList.vue -->
<template>
  <div class="space-y-4 max-h-[calc(100vh-350px)] overflow-y-auto">
    <DocumentListItem
      v-for="doc in listDocuments"
      :key="doc.id"
      :document="doc"
      @toggle="checked => $emit('toggle', { document: doc, checked })"
      @edit="$emit('edit', doc)"
      @delete="$emit('delete', doc)"
    />

    <p v-if="!listDocuments.length" class="text-sm text-gray-500 italic">
      Tidak ada dokumen yang ditampilkan.
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import DocumentListItem from "./DocumentListItem.vue";
import type { MasterDocument } from "@/interface/IMasterDocument";

const props = defineProps<{
  documents?: MasterDocument[];
}>();

const dummyDocs: MasterDocument[] = [
  {
    id: 1,
    document_code: "FRM_BPJS",
    document_name: "Formulir Klaim BPJS",
    document_keyword: "form klaim",
    category: "Medis",
    mandatory: true,
    description: "Formulir resmi klaim BPJS Kesehatan",
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
  {
    id: 3,
    document_code: "RESEP_OBAT",
    document_name: "Resep Obat",
    document_keyword: "resep",
    category: "Medis",
    mandatory: false,
    description: "Resep obat dari dokter",
    is_active: 1,
    is_deleted: 0,
    created_at: "2024-01-01",
    created_by: 1,
    updated_at: null,
    updated_by: null,
  },
];

const listDocuments = computed(() => props.documents ?? dummyDocs);
</script>
