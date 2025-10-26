import { Pagination } from "./IPagination";

// interface/IMasterPayor.ts
export interface MasterPayor {
    id: number;
    payor_code: string;
    payor_name: string;
    gc_payor_type: string;
    code_external: string;
    is_active: number;
    is_deleted: number;
    created_by: number;
    created_at: string;
    updated_by: number | null;
    updated_at: string | null;
  }
  
  export interface MasterPayorRequest {
    payor_code: string;
    payor_name: string;
    gc_payor_type: string;
    code_external?: string;
    is_active: number;
  }
  
  export interface MasterPayorListResponse {
    success: boolean;
    message: string;
    data: {
      payors: MasterPayor[];
      pagination: Pagination;
    };
  }
  
  export interface MasterPayorResponse {
    success: boolean;
    message: string;
    data: {
      payor: MasterPayor;
    };
  }