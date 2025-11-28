<!-- src/components/document/DocumentListItem.vue -->
<template>
  <div class="border rounded-lg p-4 hover:bg-gray-50 transition-all">
    <div class="flex justify-between items-start">
      <div class="flex items-start">
        <input
          type="checkbox"
          class="mt-1 mr-3 h-5 w-5"
          :checked="document.mandatory"
          @change="onCheckboxChange"
        />
        <div>
          <h3 class="font-medium text-gray-800">
            {{ document.document_name }}
          </h3>
          <p class="text-sm text-gray-600 mt-1">
            {{ document.description }}
          </p>
          <div class="flex flex-wrap gap-2 mt-2">
            <span
              class="text-xs px-2 py-1 rounded"
              :class="categoryBadgeClass"
            >
              {{ document.category }}
            </span>
            <span
              class="text-xs px-2 py-1 rounded"
              :class="statusBadgeClass"
            >
              {{ document.mandatory ? 'Wajib' : 'Opsional' }}
            </span>
          </div>
        </div>
      </div>
      <div class="flex space-x-2">
        <button class="text-blue-500 hover:text-blue-700" @click="$emit('edit')">
          <i class="fas fa-edit"></i>
        </button>
        <button class="text-red-500 hover:text-red-700" @click="$emit('delete')">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { MasterDocumentUI } from "@/interface/MasterDocumentUI";

const props = defineProps<{
  document: MasterDocumentUI;
}>();

const emit = defineEmits<{
  (e: "toggle", checked: boolean): void;
  (e: "edit"): void;
  (e: "delete"): void;
}>();

const categoryBadgeClass = computed(() => {
  switch (props.document.category) {
    case "Medis":
      return "bg-blue-100 text-blue-800";
    case "Administrasi":
      return "bg-purple-100 text-purple-800";
    case "Keuangan":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
});

const statusBadgeClass = computed(() =>
  props.document.mandatory
    ? "bg-red-100 text-red-800"
    : "bg-yellow-100 text-yellow-800"
);

function onCheckboxChange(event: Event) {
  const target = event.target as HTMLInputElement;
  emit("toggle", target.checked);
}
</script>
