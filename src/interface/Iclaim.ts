import { Pagination } from "./IPagination";

export default interface IClaim {
    id: string;
    claim_number: string;
    patient_id: number;
    sep_number: string;
    sep_info: {
      dob?: string;
      doctor?: string;
      gender?: string;
      peserta?: string;
      date_sep?: string;
      fullname?: string;
      jns_rawat?: string;
      medical_no?: string;
      card_number?: string;
      phone_number?: string;
      poli_perujuk?: string;
      diagnosa_awal?: string;
      fasek_perujuk?: string;
      jns_kunjungan?: string;
    }
    sep_claim_monitoring: any;
    claim_status: string;
    validation_file_result: any;
    claim_file_status: string;
    created_by: number;
    created_at: string;
    update_by: number | null;
    update_date: string;
}


export interface IClaimData {
  id:                   string;
  claim_date:           Date;
  claim_number:         string;
  is_cob:               number;
  patient_id:           number;
  medical_no:           string;
  patient_name:         string;
  gcgender:             string;
  gender:               string;
  gcclaim_service_type: string;
  claim_service_type:   string;
  gcclaim_status:       string;
  claim_status:         string;
  created_at:           Date;
  created_by:           number;
  update_by:            null;
  update_date:          null;
  payor_id:             number;
  coverage_amount:      number;
  claim_payor_number:   string;
  claim_member_no:      string;
}

export interface IClaimListResponse {
  success: boolean;
  message: string;
  data: {
    claim: IClaimData[];
    pagination: Pagination
  };
}
export interface IClaimResponse {
  success: boolean;
  message: string;
  data: IClaim;
}
export interface IClaimRequest {
  patient_id:           number;
  gcclaim_service_type: string;
  is_cob:               number;
  claim_payors:         ClaimPayor[];
}

export interface ClaimPayor {
  payor_id:           number;
  is_primary:         boolean;
  claim_payor_number: string;
  claim_member_no:    string;
  inacbg_code:        string;
  inacbg_text:        string;
  grouper_amount:     number;
  application_fee:    number;
  coverage_amount:    number;
}



export  interface BPJSSepClaimRequest {
  tglsep : string , 
  jnspelayanan : string ,
  payor_id : number 
}

export interface BPJSSaveSEPClaimRequest {
  payor_id : number,
  claim_payor_no : string
}

export interface IBPJSSEPClaim {
  sep: SEP[]
}
export interface SEP {
  noSep: string
  tglSep: string
  tglPlgSep: any
  jnsPelayanan: string
  kelasRawat: string
  noKartu: string
  nama: string
  poli: string
  diagnosa: string
  noRujukan: any
}
