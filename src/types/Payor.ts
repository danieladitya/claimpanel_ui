import { DocumentRule } from "./Document";

export interface Payor {
    id: number;
    payor_code: string;
    payor_name: string;
    gc_payor_type: string;
    payor_type : string;
    code_external: string;
    is_active: number;
  }
  
  export interface PayorDetail extends Payor {
    document_rules: DocumentRule[];
  }
  