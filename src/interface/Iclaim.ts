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
