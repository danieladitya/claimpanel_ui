// composables/useValidationClaim.ts
import { ref } from "vue";
import { getMergeDocument, sentValidation } from "@/services/validationClaim.service";
import { MergeDocument, ValidationClaim } from "@/types/ValidationClaim";

export function useValidationClaim() {
    const validationClaimData = ref<ValidationClaim | null>(null);
    const mergeDocumentData = ref<MergeDocument | null>(null);
    const loading = ref(false);
    const error = ref<string | null>(null);

    async function getValidation(claim_payor_id: string) {
        loading.value = true;
        error.value = null;
        
        try {
            validationClaimData.value = await sentValidation(claim_payor_id);
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Failed to validate claim';
            console.error('Validation error:', err);
        } finally {
            loading.value = false;
        }
    }

    async function processMergeDocument(claim_payor_id: string) {
        loading.value = true;
        error.value = null;
        
        try {
            mergeDocumentData.value = await getMergeDocument(claim_payor_id);
              // Optional: Auto-download merged PDF
              alert(mergeDocumentData.value?.document_id)
              await downloadMergedDocument();
            
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Failed to merge documents';
            console.error('Merge document error:', err);
        } finally {
            loading.value = false;
        }
    }

    async function downloadMergedDocument() {
             try { 
                alert('download')
                const fileUrl = `http://127.0.0.1:8000/api/v1/claim/document/${mergeDocumentData.value?.document_id}`;
                
                // Untuk download
                window.open(fileUrl, '_blank');
                 
            } catch (error) {
              console.error('Download error:', error);
              alert('Gagal mendownload dokumen');
            }
          
           
    }

    function reset() {
        validationClaimData.value = null;
        mergeDocumentData.value = null;
        error.value = null;
        loading.value = false;
    }

    return {
        // Data
        validationClaimData,
        mergeDocumentData,
        loading,
        error,
        
        // Methods
        getValidation,
        processMergeDocument,
        downloadMergedDocument,
        reset
    };
}