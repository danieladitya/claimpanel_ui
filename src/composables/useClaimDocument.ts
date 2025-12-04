// composables/useClaimDocument.ts
import { ref } from "vue";
import { getClaimDocumentReady } from "@/services/claim_document_service";
import type { ClaimDocument } from "@/types/ClaimDocument";

export function useClaimDocument() {
  const claimDocumentData = ref<ClaimDocument[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function fetchClaimDocument(month: string, payor_code: string) {
    loading.value = true;
    error.value = null;
    claimDocumentData.value = [];

    try {
      const result = await getClaimDocumentReady(month, payor_code);
      claimDocumentData.value = result;
    } catch (err: any) {
      error.value = "Gagal memuat dokumen. Silakan coba lagi.";
      console.error(err);
    } finally {
      loading.value = false;
    }
  }

  function resetDocuments() {
    claimDocumentData.value = [];
    error.value = null;
  }

  return {
    claimDocumentData,
    loading,
    error,
    fetchClaimDocument,
    resetDocuments
  };
}
