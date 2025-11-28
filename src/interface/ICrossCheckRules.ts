import { IBaseListResponse, IBaseResponse } from "./IBaseResponse"
import { Pagination } from "./IPagination";


interface ICrossCheckRules {
  id?: string;
  rule_no?: string;
  rule_name?: string;
  rule_description?: string;
  gc_required_type?: string;
  trigger_code_id?: string;
  triger_gccode_system?: string;
  required_code_system?: string;
  gc_required_mode?: string;
  required_n: number;
  required_codes?: string[];
  message?: string;
  gc_severity?: string;
  condition_json?: any;
  active?: boolean;
  created_by?: number;
  updated_by?: number;
}

// export interface ICrossCheckRules {
//     id: string
//     rule_no: string
//     required_mode: string
//     created_by: number
//     required_codes: string[]
//     created_date: string
//     rule_name: string
//     required_n: number
//     updated_by: any
//     rule_description: string
//     condition_json: IConditionJson
//     triger_gccode_system: string
//     gc_severity: string
//     code_system: string
//     severity: string
//     trigger_code_id: string
//     message: string
//     gc_required_mode: string
//     gc_required_type : string
//     required_type : string
//     is_active: boolean
//   }
 
  export interface IConditionJson {}
  
 
export interface CrossCheckRulesListResponse {
  success: boolean;
  message: string;
  data: {
    rules: ICrossCheckRules[];
    pagination: Pagination;
  };
} 
// Specific response interfaces
// export interface ICrossCheckRulesListResponse 
// extends IBaseListResponse<ICrossCheckRules> {}

export interface ICrossCheckRulesResponse 
extends IBaseResponse<ICrossCheckRules> {}

// For API parameters
export interface ICrossCheckRulesFilter {
page?: number;
limit?: number;
search?: string;
isActive?: boolean;
severity?: string;
}

// src/interface/CrossCheckRule.ts
export interface CrossCheckRuleRequest {
  id?: string;
  rule_name?: string;
  rule_description?: string;
  gc_rule_type : string;
  gc_required_type?: string;
  trigger_code_id?: string;
  triger_gccode_system?: string;
  required_code_system?: string;
  gc_required_mode?: string;
  required_n?: number;
  required_codes?: string[];
  message?: string;
  gc_severity?: string;
  condition_json?: any;
  active?: boolean;
  created_date?: string;
  update_date?: string;
}

export interface ConditionJson {}
