import { ComputedRef, Ref } from "vue"

export interface ClaimDocumentsResponse {
  success : string, 
  message : string, 
  data : ClaimDocumentsData, 
}
  
  // Claim Document Types
  export interface ClaimDocument {
    id: string
    document_code: string | null
    document_name: string | null
    document_type: string | null
    filename: string
    file_path: string
    claim_number: string
    claim_date: string
    payor_code: string
    payor_name: string
    payor_type: string
    claim_member_no: string
    claim_payor_number: string
    created_date: string
  }
  
  export interface ClaimDocumentsData {
    claim_documents: ClaimDocument[]
  }
  
  // Payor Types
  export interface Payor {
    id: number
    payor_code: string
    payor_name: string
    gc_payor_type: string
    payor_type: string
    code_external: string
    is_active: number
  }
  
  export interface PayorsResponse {
    payors: Payor[]
    pagination: {
      page: number
      per_page: number
      total_count: number
      total_pages: number
      has_previous: boolean
      has_next: boolean
    }
  }
  
  // Filter Types
  export interface ClaimDocumentFilters {
    month: string
    payorCode: string
  }
  
  // Composable Return Types
  export interface UseClaimDocumentReturn {
    claimDocuments: Ref<ClaimDocument[]>
    loading: Ref<boolean>
    error: Ref<string | null>
    fetchClaimDocuments: (filters: ClaimDocumentFilters) => Promise<void>
    reset: () => void
  }
  
  export interface UsePayorReturn {
    payors: Ref<Payor[]>
    loading: Ref<boolean>
    error: Ref<string | null>
    fetchPayors: () => Promise<void>
    activePayors: ComputedRef<Payor[]>
  }