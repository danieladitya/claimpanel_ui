// src/composables/useDocumentFilter.ts
import { computed, ref, type Ref } from "vue";
import type { MasterDocumentUI } from "@/interface/MasterDocumentUI";

export function useDocumentFilter(documents: Ref<MasterDocumentUI[]>) {
  const search = ref("");
  const category = ref<"Semua" | "Medis" | "Administrasi" | "Keuangan">("Semua");
  const status = ref<"Semua" | "Wajib" | "Opsional">("Semua");

  const filtered = computed(() => {
    return documents.value.filter((doc) => {
      const matchSearch = doc.document_name
        .toLowerCase()
        .includes(search.value.toLowerCase());

      const matchCategory =
        category.value === "Semua" || doc.category === category.value;

      const matchStatus =
        status.value === "Semua" ||
        (status.value === "Wajib" && doc.mandatory) ||
        (status.value === "Opsional" && !doc.mandatory);

      return matchSearch && matchCategory && matchStatus;
    });
  });

  return { search, category, status, filtered };
}
