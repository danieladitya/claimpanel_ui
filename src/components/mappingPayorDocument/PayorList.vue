<script setup lang="ts">
import { computed } from "vue";
import { Payor } from '../../types/Payor';
 
const props = defineProps<{
  items: Payor[];
  selectedId: number | null;
}>();

const emits = defineEmits(["select"]);
</script>

<template>
  <div class="w-full p-4 bg-white rounded-lg shadow lg:w-1/3">
    
    <h2 class="mb-4 text-lg font-semibold text-gray-700">Daftar Payor</h2>

    <!-- Payor List -->
    <div class="space-y-2 max-h-[calc(100vh-250px)] overflow-y-auto">
      <div
        v-for="p in items"
        :key="p.id"
        @click="$emit('select', p.id)"
        class="p-3 transition-all rounded cursor-pointer bg-sky-50"
        :class="p.id === selectedId
          ? 'bg-blue-50 border-l-4 border-blue-500'
          : 'hover:bg-gray-50'"
      >
        <div class="flex items-center justify-between">
          <h3 class="font-medium text-gray-800">{{ p.payor_name }} </h3>  
            <span :class="['status', p.is_active == 1 ? 'active' : 'inactive']">
                    {{ p.is_active ? 'Active' : 'Inactive' }}
                   
                    </span>
        </div>

        <div class="mt-1 text-sm text-gray-600">
          Tipe: {{ p.payor_type}} 
        </div>
       
                    
      </div>
    </div>
    
  </div>
</template>
