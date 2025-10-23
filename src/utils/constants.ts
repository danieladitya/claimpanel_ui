export interface SeverityOption {
  value: string;
  label: string;
  color: string;
}

export interface Option {
  value: string;
  label: string;
}

export interface Filters {
  rule_name: string;
  trigger_code_system: string;
  active: string;
}

 

// Document types based on your table
export interface DocumentType {
  id: number;
  document_type: string;
  keyword_text?: string;
  is_active: number;
  created_at?: string;
  updated_at?: string;
}

export const SEVERITY_OPTIONS: SeverityOption[] = [
  { value: 'error', label: 'Error', color: 'red' },
  { value: 'warning', label: 'Warning', color: 'yellow' },
  { value: 'info', label: 'Info', color: 'blue' }
]

export const RULE_TYPE_OPTIONS: Option[] = [
  { value: 'code', label: 'Pemeriksaan Kode Medis' },
  { value: 'document', label: 'Kelengkapan Dokumen' }
]

export const REQUIRED_MODE_OPTIONS: Option[] = [
  { value: 'all', label: 'Semua harus ada' },
  { value: 'any', label: 'Minimal satu harus ada' },
  { value: 'exact', label: 'Harus tepat' }
]

export const CODE_SYSTEM_OPTIONS: Option[] = [
  { value: 'ICD-10', label: 'ICD-10' },
  { value: 'ICD-9', label: 'ICD-9' },
  { value: 'CPT', label: 'CPT' },
  { value: 'ATC', label: 'ATC' },
  { value: 'LOINC', label: 'LOINC' }
]

export const DOCUMENT_SYSTEM_OPTIONS: Option[] = [
  { value: 'MEDICAL_RECORD', label: 'Rekam Medis' },
  { value: 'LAB_RESULT', label: 'Hasil Laboratorium' },
  { value: 'RADIOLOGY', label: 'Hasil Radiologi' },
  { value: 'PRESCRIPTION', label: 'Resep Obat' },
  { value: 'REFERRAL', label: 'Surat Rujukan' },
  { value: 'CONSENT', label: 'Surat Persetujuan' }
]

// Common document types based on your table
export const DOCUMENT_TYPE_OPTIONS: Option[] = [
  { value: 'medical_record', label: 'Rekam Medis' },
  { value: 'lab_result', label: 'Hasil Lab' },
  { value: 'radiology_report', label: 'Laporan Radiologi' },
  { value: 'prescription', label: 'Resep' },
  { value: 'referral_letter', label: 'Surat Rujukan' },
  { value: 'consent_form', label: 'Form Persetujuan' },
  { value: 'discharge_summary', label: 'Ringkasan Pulang' },
  { value: 'operation_report', label: 'Laporan Operasi' },
  { value: 'progress_note', label: 'Catatan Perkembangan' },
  { value: 'consultation_note', label: 'Catatan Konsultasi' }
]

export const STATUS_OPTIONS: Option[] = [
  { value: 'true', label: 'Active' },
  { value: 'false', label: 'Inactive' },
  { value: '', label: 'All Status' }
]

export const INITIAL_FILTERS: Filters = {
  rule_name: '',
  trigger_code_system: '',
  active: ''
}

export const INITIAL_RULE: CrossCheckRule = {
  id: null,
  rule_name: '',
  rule_description: '',
  trigger_code_id: '',
  trigger_code_system: 'ICD-10',
  required_code_system: '',
  required_mode: 'all',
  required_codes: [],
  required_n: 1,
  condition_json: null,
  severity: 'error',
  message: '',
  active: true,
  version_no: 1,
  gcrule_type: 'code',
  created_by: null,
  created_date: null,
  updated_by: null,
  updated_date: null
}

export const EXAMPLE_RULES = [
  {
    name: "Pemeriksaan Obat Diabetes",
    trigger: { code: "E11", system: "ICD-10" },
    required: { codes: ["A10BA", "A10BB"], system: "ATC", mode: "any" },
    message: "Diagnosis diabetes memerlukan obat diabetes yang sesuai"
  },
  {
    name: "Kelengkapan Dokumen Hipertensi", 
    trigger: { code: "I10", system: "ICD-10" },
    required: { codes: ["medical_record", "lab_result"], system: "DOC", mode: "all" },
    message: "Diagnosis hipertensi memerlukan rekam medis dan hasil laboratorium"
  }
]