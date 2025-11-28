<!-- src/components/payor/PayorList.vue -->
<template>
    <div class="w-full lg:w-1/3 bg-white rounded-lg shadow p-4">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold text-gray-700">Daftar Payor</h2>
      </div>
  
      <div class="relative mb-4">
        <input
          v-model="search"
          type="text"
          placeholder="Cari payor..."
          class="w-full pl-10 pr-4 py-2 border rounded-lg"
        />
        <i class="fas fa-search absolute left-3 top-3 text-gray-400"></i>
      </div>
  
      <div class="space-y-2 max-h-[calc(100vh-250px)] overflow-y-auto">
        <PayorListItem
          v-for="p in filteredPayors"
          :key="p.id"
          :payor="p"
          :selected="p.id === selectedPayorId"
          @click="() => $emit('select', p)"
        />
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed, ref } from "vue";
  import PayorListItem from "./PayorListItem.vue";
  import type { MasterPayorUI } from "@/interface/MasterPayorUI";
  
  const props = defineProps<{
    payors?: MasterPayorUI[];
    selectedPayorId?: number | null;
  }>();
  
  const search = ref("");
  
  // dummy jika props.payors tidak diisi
  const dummyPayors: MasterPayorUI[] = [
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
      document_count: 12,
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
      document_count: 8,
    },
  ];
  
  const listPayors = computed(() => props.payors ?? dummyPayors);
  
  const filteredPayors = computed(() =>
    listPayors.value.filter((p) =>
      p.payor_name.toLowerCase().includes(search.value.toLowerCase())
    )
  );
  </script>
  