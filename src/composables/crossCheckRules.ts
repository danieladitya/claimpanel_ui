import { CrossCheckRuleRequest } from "@/interface/ICrossCheckRules";
import { IStandardcode } from "@/interface/IStandardcode";
import api from "@/services/api";
import { computed, ref } from "vue";

export function useCrossCheckRules(){
     
  
  interface DocumentOption {
    value: string;
    label: string;
  }
  
  interface StatusOption {
    value: string;
    label: string;
  }
  
  // Constants
  const STATUS_OPTIONS: StatusOption[] = [
    { value: 'true', label: 'Aktif' },
    { value: 'false', label: 'Non-Aktif' }
  ];
  
  const INITIAL_RULE: CrossCheckRuleRequest = {
    rule_name: '',
    rule_description: '',
    gc_required_type: '',
    trigger_code_id: '',
    triger_gccode_system: '',
    required_code_system: '',
    gc_required_mode: '',
    required_n: 1,
    required_codes: [],
    message: '',
    gc_severity: '',
    condition_json: {},
    active: true,
  };
  
  
  // Reference data
  const RULE_TYPE_OPTIONS = ref<IStandardcode[]>([]);
  const SEVERITY_OPTIONS = ref<IStandardcode[]>([]);
  const CODE_SYSTEM_OPTIONS = ref<IStandardcode[]>([]);
  const REQUIRED_MODE_OPTIONS = ref<IStandardcode[]>([]);
  const DOCUMENT_TYPE_OPTIONS = ref<IStandardcode[]>([]);
  
  // Universal document options
  const UNIVERSAL_DOCUMENT_OPTIONS = ref<DocumentOption[]>([
    { value: 'SEP', label: 'Surat Eligibilitas Pasien (SEP)' },
    { value: 'IDENTITY_CARD', label: 'Kartu Identitas Pasien' },
    { value: 'INSURANCE_CARD', label: 'Kartu Asuransi' },
    { value: 'REFERRAL_LETTER', label: 'Surat Rujukan' },
    { value: 'CONSENT_FORM', label: 'Form Persetujuan Tindakan' },
    { value: 'ADMISSION_FORM', label: 'Form Pendaftaran' },
    { value: 'MEDICAL_RECORD', label: 'Rekam Medis' },
    { value: 'LAB_RESULT', label: 'Hasil Laboratorium' },
    { value: 'RADIOLOGY_REPORT', label: 'Laporan Radiologi' }
  ]);
  
  // State untuk ICD Search
  const icdSuggestions = ref<any[]>([]);
  const showICDSuggestions = ref(false);
  const searchingICD = ref(false);
  const icdSearchQuery = ref('');
  const selectedICDInfo = ref<any>(null);
  const icdPagination = ref({
    skip: 0,
    limit: 20,
    total: 0,
    hasMore: false
  });
  
  // Error states
  const triggerCodeError = ref('');
  const triggerSystemError = ref('');
  const requiredCodeErrors = ref<string[]>([]);
  const requiredCodeDescriptions = ref<string[]>(['']);
  const jsonError = ref({
    condition_json: ''
  });
  const messageSuggestions = ref<string[]>([]);
  
  // Icons
  const InformationCircleIcon = { template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"/></svg>` }
  const LightningBoltIcon = { template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>` }
  const CheckCircleIcon = { template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>` }
  const CogIcon = { template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15a3 3 0 100-6 3 3 0 000 6z"/></svg>` }
  const ExclamationIcon = { template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"/></svg>` }
  const PlusIcon = { template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>` }
  const TrashIcon = { template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>` }
  const ShieldCheckIcon = { 
    template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>` 
  };
  
  const props = defineProps({
    rule: {
      type: Object as () => CrossCheckRuleRequest | null,
      default: null
    },
    isEditing: Boolean,
    submitting: Boolean
  })
  
  const emit = defineEmits(['save'])
  
  // Form state
  const form = ref<CrossCheckRuleRequest>({ ...INITIAL_RULE })
  const currentStep = ref(1)
  const requiredCodes = ref<string[]>([''])
  const requiredDocuments = computed({
    get: () => requiredCodes.value,
    set: (value) => requiredCodes.value = value
  });
  
  // Steps configuration
  const steps = ref([
    'Informasi Dasar',
    'Kondisi Pemicu',
    'Yang Diperlukan',
    'Ringkasan & Konfigurasi'
  ])
  
  // Computed properties
  const isUniversalRule = computed(() => {
    return form.value.gc_required_type === 'X002^003';
  });
  
  const isICDRule = computed(() => {
    return form.value.gc_required_type === 'X002^001' &&
           (form.value.triger_gccode_system?.startsWith('X678') || 
            /ICD/i.test(form.value.triger_gccode_system || ''));
  });
  
  const visibleSteps = computed(() => {
    if (isUniversalRule.value) {
      return ['Informasi Dasar', 'Yang Diperlukan', 'Ringkasan & Konfigurasi'];
    }
    return steps.value;
  });
  
  const totalSteps = computed(() => {
    return visibleSteps.value.length;
  });
  
  const requiredConditionsStep = computed(() => {
    return isUniversalRule.value ? 2 : 3;
  });
  
  const stepTitle = computed(() => {
    if (currentStep.value === requiredConditionsStep.value) {
      if (isUniversalRule.value) return 'Dokumen Wajib Universal';
      return form.value.gc_required_type === 'X002^001' ? 'Kode Diperlukan' : 'Dokumen Diperlukan';
    }
    return visibleSteps.value[currentStep.value - 1];
  });
  
  const conditionJson = computed({
    get: () => {
      return form.value.condition_json 
        ? JSON.stringify(form.value.condition_json, null, 2)
        : ''
    },
    set: (value) => {
      try {
        if (value.trim()) {
          form.value.condition_json = JSON.parse(value)
          jsonError.value.condition_json = ''
        } else {
          form.value.condition_json = {}
          jsonError.value.condition_json = ''
        }
      } catch (e) {
        jsonError.value.condition_json = (e as Error).message
      }
    }
  });
  
  const isFormValid = computed(() => {
    if (!form.value.rule_name?.trim()) return false
    if (!isUniversalRule.value) {
      if (!form.value.trigger_code_id?.trim()) return false
      if (!form.value.triger_gccode_system) return false
    }
    if (!form.value.gc_required_type?.trim()) return false
    if (!form.value.required_code_system?.trim()) return false
    if (requiredCodes.value.length === 0 || requiredCodes.value.some(code => !code.trim())) return false
    if (!form.value.message?.trim()) return false
    if (!form.value.gc_severity) return false
    
    return true
  });
  
  // Helper functions
  const getRuleTypeLabel = (standardcodeId: any) => {
    const option = RULE_TYPE_OPTIONS.value.find(opt => opt.standardcode_id === standardcodeId);
    return option?.standardcode_name || standardcodeId;
  }
  
  const getSeverityLabel = (standardcodeId: any) => {
    const option = SEVERITY_OPTIONS.value.find(opt => opt.standardcode_id === standardcodeId);
    return option?.standardcode_name || standardcodeId;
  }
  
  const getCodeSystemLabel = (standardcodeId: any) => {
    const option = CODE_SYSTEM_OPTIONS.value.find(opt => opt.standardcode_id === standardcodeId);
    return option?.standardcode_name || standardcodeId;
  }
  
  const getRequiredModeLabel = (standardcodeId: any) => {
    const option = REQUIRED_MODE_OPTIONS.value.find(opt => opt.standardcode_id === standardcodeId);
    return option?.standardcode_name || standardcodeId;
  }
  
  const getDocumentTypeLabel = (standardcodeId: any) => {
    const option = DOCUMENT_TYPE_OPTIONS.value.find(opt => opt.standardcode_id === standardcodeId);
    return option?.standardcode_name || standardcodeId;
  }
  
  // Methods
  const handleRuleTypeChange = (typeId: any) => {
    form.value.gc_required_type = typeId;
    
    // Reset validasi errors
    triggerCodeError.value = '';
    triggerSystemError.value = '';
    requiredCodeErrors.value = [];
    
    // Reset trigger conditions untuk universal rule
    if (typeId === 'X002^003') {
      form.value.trigger_code_id = '';
      form.value.triger_gccode_system = '';
      form.value.condition_json = {};
      form.value.required_code_system = 'ADMINISTRATIVE';
      form.value.gc_required_mode = 'X003^001';
    }
    
    // Set default untuk ICD rule
    if (typeId === 'X002^001') {
      form.value.triger_gccode_system = 'X678^001'; // Default ICD-10
      form.value.required_code_system = 'ATC'; // Default ATC untuk obat
    }
    
    updateMessageSuggestions();
  };
  
  function getRuleTypeDescription(typeId: string): string {
    const descriptions: { [key: string]: string } = {
      'X002^001': 'Memeriksa kode ICD diagnosis/prosedur',
      'X002^002': 'Memeriksa kelengkapan dokumen berdasarkan diagnosis',
      'X002^003': 'Dokumen wajib untuk semua klaim (universal)'
    };
    return descriptions[typeId] || 'Tipe pemeriksaan';
  }
  
  function getRequiredConditionsTitle(): string {
    if (isUniversalRule.value) return 'Dokumen Wajib Universal';
    return form.value.gc_required_type === 'X002^001' ? 'Kode yang Diperlukan' : 'Dokumen yang Diperlukan';
  }
  
  function getRequiredConditionsDescription(): string {
    if (isUniversalRule.value) {
      return 'Tentukan dokumen apa yang wajib ada untuk SEMUA klaim, tanpa memandang diagnosis atau tindakan.';
    }
    return form.value.gc_required_type === 'X002^001' 
      ? 'Tentukan kode medis apa yang harus ada ketika kondisi pemicu terpenuhi.' 
      : 'Tentukan dokumen apa yang harus lengkap ketika diagnosis ditemukan.';
  }
  
  function getRuleTypeBadgeClass(ruleType: any): string {
    const classes: { [key: string]: string } = {
      'X002^001': 'px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800',
      'X002^002': 'px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800',
      'X002^003': 'px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800'
    };
    return classes[ruleType] || 'px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800';
  }
  
  function getRuleTypeBadgeText(ruleType: any): string {
    const texts: { [key: string]: string } = {
      'X002^001': 'Kode Medis ICD',
      'X002^002': 'Dokumen Kondisional',
      'X002^003': 'Dokumen Universal'
    };
    return texts[ruleType] || 'Unknown';
  }
  
  function getSeverityBadgeClass(severity: string): string {
    const classes: { [key: string]: string } = {
      'X004^001': 'px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800',
      'X004^002': 'px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800',
      'X004^003': 'px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800'
    };
    return classes[severity] || 'px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800';
  }
  
  function getSeverityBadgeText(severity: string): string {
    const texts: { [key: string]: string } = {
      'X004^001': '❌ ERROR',
      'X004^002': '⚠️ WARNING',
      'X004^003': 'ℹ️ INFO'
    };
    return texts[severity] || 'UNKNOWN';
  }
  
  function getModeDescription(mode: any) {
    const descriptions: { [key: string]: string } = {
      'X003^001': 'Semua harus ada',
      'X003^002': 'Minimal satu harus ada', 
      'X003^003': 'Harus tepat'
    }
    return descriptions[mode] || getRequiredModeLabel(mode)
  }
  
  function getSeverityDescription(severity: string) {
    const descriptions: { [key: string]: string } = {
      'X004^001': 'Akan memblokir proses',
      'X004^002': 'Peringatan saja',
      'X004^003': 'Informasi tambahan'
    }
    return descriptions[severity] || getSeverityLabel(severity)
  }
  
  function getMessagePlaceholder(): string {
    if (isUniversalRule.value) {
      return 'Contoh: Dokumen SEP wajib dilampirkan untuk semua klaim';
    }
    return form.value.gc_required_type === 'X002^001' 
      ? 'Contoh: Diagnosis diabetes memerlukan obat diabetes yang sesuai'
      : 'Contoh: Diagnosis hipertensi memerlukan hasil pemeriksaan tekanan darah';
  }
  
  function updateMessageSuggestions() {
    const suggestions = [];
    
    if (isUniversalRule.value) {
      const requiredItems = requiredDocuments.value.filter(doc => doc.trim())
        .map(doc => {
          const docOption = UNIVERSAL_DOCUMENT_OPTIONS.value.find(d => d.value === doc);
          return docOption ? docOption.label : doc;
        })
        .join(', ');
      
      if (requiredItems) {
        suggestions.push(
          `Dokumen ${requiredItems} wajib dilampirkan untuk semua klaim`,
          `Pastikan dokumen ${requiredItems} lengkap sebelum proses klaim`,
          `Kelengkapan dokumen ${requiredItems} merupakan syarat wajib semua klaim`
        );
      }
    } else if (form.value.trigger_code_id && form.value.triger_gccode_system && requiredCodes.value.length > 0) {
      const triggerDesc = getTriggerCodeDescription();
      const requiredItems = requiredCodes.value.filter(c => c.trim()).map(code => 
        getCodeOrDocumentLabel(code)
      ).join(', ');
      
      if (form.value.gc_required_type === 'X002^001') {
        suggestions.push(
          `Diagnosis ${triggerDesc} memerlukan ${requiredItems}`,
          `Untuk ${triggerDesc}, pastikan tersedia ${requiredItems}`,
          `${triggerDesc} harus disertai dengan ${requiredItems}`
        );
      } else {
        suggestions.push(
          `Diagnosis ${triggerDesc} memerlukan dokumen ${requiredItems}`,
          `Kelengkapan dokumen ${requiredItems} diperlukan untuk ${triggerDesc}`,
          `Pastikan dokumen ${requiredItems} lengkap untuk pasien ${triggerDesc}`
        );
      }
    }
    
    messageSuggestions.value = suggestions;
  }
  
  function getTriggerCodeDescription(): string {
    const codeDescriptions: { [key: string]: string } = {
      'E11': 'Diabetes Mellitus Tipe 2',
      'I10': 'Hipertensi Esensial', 
      'J45': 'Asma',
      'N18': 'Penyakit Ginjal Kronik',
      'Z01.81': 'Pemeriksaan Pre-Operasi',
      'I25': 'Penyakit Jantung Iskemik',
      'E78': 'Gangguan Metabolisme Lipid',
      'M54': 'Nyeri Punggung'
    }
    return codeDescriptions[form.value.trigger_code_id || ''] || 'Kode diagnosis/prosedur'
  }
  
  function getCodeOrDocumentLabel(code: string): string {
    if (form.value.gc_required_type === 'X002^002' || form.value.gc_required_type === 'X002^003') {
      // Cari di universal document options dulu
      const universalDoc = UNIVERSAL_DOCUMENT_OPTIONS.value.find(doc => doc.value === code);
      if (universalDoc) return universalDoc.label;
      
      // Kalau tidak ada, cari di document type options
      return getDocumentTypeLabel(code) || 'Dokumen';
    }
    
    // For medical codes
    const codeDescriptions: { [key: string]: string } = {
      'A10BA': 'Metformin',
      'A10BB': 'Sulfonylurea',
      'A10AC': 'Insulin',
      'C09CA': 'ACE Inhibitor',
      'C07AB': 'Beta Blocker',
      '99213': 'Kunjungan Rawat Jalan',
      '80048': 'Panel Metabolik Dasar'
    }
    return codeDescriptions[code] || 'Kode Medis'
  }
  
  function getICDCodeDescription(code: string): string {
    // Jika ada selected ICD info, gunakan description dari server
    if (selectedICDInfo.value && selectedICDInfo.value.code === code) {
      return selectedICDInfo.value.description;
    }
    
    // Fallback ke hardcoded descriptions
    const descriptions: {[key: string]: string} = {
      'E10': 'Diabetes mellitus tergantung insulin',
      'E11': 'Diabetes mellitus tidak tergantung insulin', 
      'I10': 'Hipertensi esensial (primer)',
      'J45': 'Asma',
      'N18': 'Penyakit ginjal kronik',
      'A01': 'Demam tifoid dan paratifoid'
    };
    
    const baseCode = code.split('.')[0];
    return descriptions[baseCode] || descriptions[code] || 'Kode diagnosis ICD';
  }
  
  // ICD Search Methods
  const icdInput = ref<HTMLInputElement>();
  const handleFocus = (event: FocusEvent) => {
    showICDSuggestions.value = true;
    
    // Jika sudah ada query, tampilkan suggestions
    if (form.value.trigger_code_id && form.value.trigger_code_id.length >= 2) {
      searchICDCode(form.value.trigger_code_id, true);
    }
  };
  
  const handleICDSearch = async (event: Event) => {
    const query = (event.target as HTMLInputElement).value;
    icdSearchQuery.value = query;
    
    if (query.length < 2) {
      icdSuggestions.value = [];
      showICDSuggestions.value = false;
      return;
    }
  
    // Pastikan suggestions ditampilkan
    if (!showICDSuggestions.value) {
      showICDSuggestions.value = true;
    }
    await searchICDCode(query);
  };
  
  const searchICDCode = async (query?: string, isAutoSearch: boolean = false) => {
    const searchQuery = query || icdSearchQuery.value || form.value.trigger_code_id;
  
    if (!searchQuery || searchQuery.length < 2) {
      triggerCodeError.value = 'Masukkan minimal 2 karakter untuk pencarian';
      return;
    }
  
    // Kalau user belum pilih sistem kode, beri peringatan
    if (!form.value.triger_gccode_system) {
      triggerSystemError.value = 'Pilih sistem kode terlebih dahulu';
      showICDSuggestions.value = false;
      return;
    }
  
    searchingICD.value = true;
    triggerSystemError.value = '';
  
    try {
      const encodedSystem = encodeURIComponent(form.value.triger_gccode_system);
      const encodedKeyword = encodeURIComponent(searchQuery);
      
      const response = await api.get(
        `/reference/icd?gccode_system=${encodedSystem}&keyword=${encodedKeyword}&skip=0&limit=${icdPagination.value.limit}`
      );
  
      if (response.data.success && response.data.data) {
        const data = response.data.data;
        icdSuggestions.value = data.items || [];
        icdPagination.value = {
          skip: data.skip || 0,
          limit: data.limit || 20,
          total: data.total || 0,
          hasMore: (data.skip + data.limit) < data.total
        };
        showICDSuggestions.value = true;
      } else {
        icdSuggestions.value = [];
      }
    } catch (error) {
      console.error('Error searching ICD codes:', error);
      triggerCodeError.value = 'Gagal mencari kode ICD';
    } finally {
      searchingICD.value = false;
    }
  };
  
 
 
  const handleSystemChange = () => {
    validateTriggerSystem();
    
    // Reset ICD search ketika sistem berubah
    if (isICDRule.value) {
      icdSuggestions.value = [];
      selectedICDInfo.value = null;
      form.value.trigger_code_id = '';
      if (form.value.trigger_code_id) {
        // Trigger search ulang dengan kode yang sudah ada
        searchICDCode(form.value.trigger_code_id);
      }
    }
  };
   
  const validateTriggerSystem = () => {
    if (!form.value.triger_gccode_system) {
      triggerSystemError.value = 'Sistem kode harus dipilih';
      return;
    }
  
    if (isICDRule.value && !form.value.triger_gccode_system.includes('ICD')) {
      triggerSystemError.value = 'Untuk aturan ICD, sistem kode harus ICD';
      return;
    }
  
    triggerSystemError.value = '';
  };
  
  const validateRequiredCode = (index: number) => {
    const code = requiredCodes.value[index];
    if (!code?.trim()) {
      requiredCodeErrors.value[index] = 'Kode diperlukan harus diisi';
      return;
    }
  
    // Validasi berdasarkan sistem kode
    if (form.value.required_code_system === 'ATC') {
      const atcPattern = /^[A-Z][0-9]{2}[A-Z][A-Z]$/;
      if (!atcPattern.test(code)) {
        requiredCodeErrors.value[index] = 'Format kode ATC tidak valid. Contoh: A10BA';
      }
    } else if (form.value.required_code_system === 'CPT') {
      const cptPattern = /^\d{5}$/;
      if (!cptPattern.test(code)) {
        requiredCodeErrors.value[index] = 'Format kode CPT tidak valid. Contoh: 99213';
      }
    }
  
    requiredCodeErrors.value[index] = '';
  };
  
  const autoFillDescription = (index: number) => {
    const code = requiredCodes.value[index];
    if (!code?.trim() || requiredCodeDescriptions.value[index]?.trim()) return;
  
    // Auto-fill description berdasarkan sistem kode
    const descriptions: {[key: string]: {[key: string]: string}} = {
      'ATC': {
        'A10BA': 'Biguanides (Metformin)',
        'A10BB': 'Sulfonamides, urea derivatives',
        'C07AB': 'Beta blocking agents, selective',
        'C09CA': 'ACE inhibitors, plain',
        'J01CA': 'Penicillins with extended spectrum'
      },
      'CPT': {
        '99213': 'Office visit, established patient',
        '99214': 'Office visit, established patient',
        '80048': 'Basic metabolic panel',
        '85025': 'Complete blood count'
      },
      'LOINC': {
        '630-4': 'Bacteria identified in Urine by Culture',
        '4548-4': 'Hemoglobin A1c/Hemoglobin.total in Blood',
        '2160-0': 'Creatinine Serum/Plasma'
      }
    };
  
    const systemDescriptions = descriptions[form.value.required_code_system || ''];
    if (systemDescriptions && systemDescriptions[code]) {
      requiredCodeDescriptions.value[index] = systemDescriptions[code];
    }
  };
  
  // Form Methods
  const addRequiredDocument = () => {
    requiredDocuments.value.push('');
  };
  
  const removeRequiredDocument = (index: number) => {
    if (requiredDocuments.value.length > 1) {
      requiredDocuments.value.splice(index, 1);
    }
  };
  
  const addRequiredCode = () => {
    requiredCodes.value.push('');
    requiredCodeDescriptions.value.push('');
    requiredCodeErrors.value.push('');
  };
  
  const removeRequiredCode = (index: number) => {
    if (requiredCodes.value.length > 1) {
      requiredCodes.value.splice(index, 1);
      requiredCodeDescriptions.value.splice(index, 1);
      requiredCodeErrors.value.splice(index, 1);
    }
  };
  
  const nextStep = () => {
    if (currentStep.value < totalSteps.value) {
      currentStep.value++;
    }
  };
    
  
  function validateCurrentStep(): boolean {
    switch (currentStep.value) {
      case 1:
        if (!form.value.rule_name?.trim()) {
          alert('Harap isi nama rule');
          return false;
        }
        if (!form.value.gc_required_type) {
          alert('Harap pilih tipe rule');
          return false;
        }
        break;
      case 2:
        if (!isUniversalRule.value) {
          if (!form.value.trigger_code_id?.trim()) {
            alert('Harap isi kode pemicu');
            return false;
          }
          if (!form.value.triger_gccode_system) {
            alert('Harap pilih sistem kode');
            return false;
          }
        }
        break;
      case requiredConditionsStep.value:
        if (!form.value.required_code_system?.trim()) {
          alert('Harap isi sistem kode/dokumen yang diperlukan');
          return false;
        }
        if (!form.value.gc_required_mode) {
          alert('Harap pilih mode pemeriksaan');
          return false;
        }
        if (requiredCodes.value.some(code => !code.trim())) {
          alert('Harap isi semua kode/dokumen yang diperlukan');
          return false;
        }
        break;
      case 4:
        if (!form.value.message?.trim()) {
          alert('Harap isi pesan error');
          return false;
        }
        if (!form.value.gc_severity) {
          alert('Harap pilih tingkat keparahan');
          return false;
        }
        break;
    }
    return true;
  }
  
  // API function
  async function getReferenceByParent(parentId: string, target: any) {
    try {
      const response = await api.get(`/reference/code?parent_id=${parentId}`)
      if (response.data && Array.isArray(response.data.data)) {
        target.value = response.data.data
      } else {
        console.warn(`No data found for ${parentId}`)
        target.value = []
      }
    } catch (error) {
      console.error(`Error fetching ${parentId}:`, error)
      target.value = []
    }
  }
  
}