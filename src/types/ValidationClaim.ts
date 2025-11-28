 
  export interface ValidationClaim {
    document_validation: DocumentValidation[]
    missing_count: number
    flag_document_success: number
    rule_validation: any[]
    flag_rule_success: number
    flag_claim_success: number
    actions_needed: string[]
  }
  
  export interface DocumentValidation {
    document_id: number
    document_name: string
    status: string
    flag: number
  }
  
  export interface MergeDocument{
    merged_file_path: string 
    document_id: string
    claim_payor_number: string
    folder_structure: number
  }