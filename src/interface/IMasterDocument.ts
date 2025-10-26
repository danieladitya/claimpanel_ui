import { IBaseListResponse, IBaseResponse } from "./IBaseResponse";
import { Pagination } from "./IPagination";

export interface MasterDocument {
    id: number;
    document_code: string;
    document_name: string;
    document_keyword: string;
    is_active: number;
    is_deleted: number;
    created_at: string;
    created_by: number;
    updated_at?: string | null;
    updated_by?: number | null;
  }
  
export interface MasterDocumentListResponse {
    success: boolean;
    message: string;
    data: {
      document: MasterDocument[];
      pagination: Pagination;
    };
}

export interface MasterDocumentResponse {
  success: boolean;
  message: string;
  data:  MasterDocument;
}

export interface MasterDocumentRequest{
    id : number;
    document_code: string;
    document_name: string;
    document_keyword: string;
    is_active: number;
}