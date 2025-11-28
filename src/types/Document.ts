export interface DocumentRule {
    id: number;
    document_id: number;
    payor_id : number;
    document_name: string;
    document_category: string;
    document_type : string;
    claim_service_type: string;
    is_active: number;
    checked: boolean;
    description?: string;
  }
  