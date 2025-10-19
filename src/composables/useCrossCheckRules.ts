import { ref, computed, Ref } from 'vue'
import { INITIAL_FILTERS, INITIAL_RULE } from '@/utils/constants'
import api from '@/services/api';

export interface CrossCheckRule {
  id: string | null;
  rule_name: string;
  rule_description: string;
  trigger_code_id: string;
  trigger_code_system: string;
  required_code_system: string;
  required_mode: string;
  required_codes: string[];
  required_n: number;
  condition_json: any;
  severity: string;
  message: string;
  active: boolean;
  version_no: number;
  gcrule_type: string;
  created_by?: number | null;
  created_date?: string | null;
  updated_by?: number | null;
  updated_date?: string | null;
}

export interface Filters {
  rule_name: string;
  trigger_code_system: string;
  active: string;
}

export function useCrossCheckRules() {
  const rules = ref<CrossCheckRule[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Filter state
  const filters = ref<Filters>({ ...INITIAL_FILTERS })
  const currentPage = ref(1)
  const itemsPerPage = 10

  // Modal states
  const showCreateModal = ref(false)
  const showEditModal = ref(false)
  const showViewModal = ref(false)
  const showDeleteModal = ref(false)
  
  const editingRule = ref<CrossCheckRule | null>(null)
  const viewingRule = ref<CrossCheckRule | null>(null)
  const deletingRuleId = ref<string | null>(null)

  // Computed
  const filteredRules = computed(() => {
    let filtered = rules.value

    if (filters.value.rule_name) {
      filtered = filtered.filter(rule => 
        rule.rule_name.toLowerCase().includes(filters.value.rule_name.toLowerCase())
      )
    }

    if (filters.value.trigger_code_system) {
      filtered = filtered.filter(rule => 
        rule.trigger_code_system === filters.value.trigger_code_system
      )
    }

    if (filters.value.active !== '') {
      filtered = filtered.filter(rule => 
        rule.active === (filters.value.active === 'true')
      )
    }

    return filtered
  })

  const paginatedRules = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage
    return filteredRules.value.slice(start, start + itemsPerPage)
  })

  const totalPages = computed(() => 
    Math.ceil(filteredRules.value.length / itemsPerPage)
  )

  // Methods
  function openCreateModal() {
    editingRule.value = { ...INITIAL_RULE }
    showCreateModal.value = true
  }

  function openEditModal(rule: CrossCheckRule) {
    editingRule.value = { ...rule }
    showEditModal.value = true
  }

  function openViewModal(rule: CrossCheckRule) {
    viewingRule.value = rule
    showViewModal.value = true
  }

  function openDeleteModal(id: string) {
    deletingRuleId.value = id
    showDeleteModal.value = true
  }

  function closeModals() {
    showCreateModal.value = false
    showEditModal.value = false
    showViewModal.value = false
    showDeleteModal.value = false
    editingRule.value = null
    viewingRule.value = null
    deletingRuleId.value = null
  }

  // async function fetchRules() {
   
  //   loading.value = true
  //   error.value = null
  //   try {
  //     // Replace with actual API call
  //     // const response = await api.get('/cross-check-rules')
  //     // rules.value = response.data
      
  //     // Mock data for demonstration
  //     rules.value = [
  //       {
  //         id: '1',
  //         rule_name: 'Diabetes Medication Check',
  //         rule_description: 'Ensure diabetes patients have appropriate medications',
  //         trigger_code_id: 'E11',
  //         trigger_code_system: 'ICD-10',
  //         required_code_system: 'ATC',
  //         required_mode: 'any',
  //         required_codes: ['A10BA', 'A10BB', 'A10AC'],
  //         required_n: 1,
  //         condition_json: { age: { min: 18 } },
  //         severity: 'error',
  //         message: 'Diabetes diagnosis requires appropriate diabetes medication',
  //         active: true,
  //         version_no: 1,
  //         gcrule_type: 'code',
  //         created_date: '2024-01-15T10:30:00Z',
  //         updated_date: '2024-01-15T10:30:00Z'
  //       },
  //       {
  //         id: '2',
  //         rule_name: 'Hypertension Follow-up',
  //         rule_description: 'Check hypertension patients have follow-up documentation',
  //         trigger_code_id: 'I10',
  //         trigger_code_system: 'ICD-10',
  //         required_code_system: 'DOC',
  //         required_mode: 'all',
  //         required_codes: ['BP_RECORD', 'FOLLOWUP_NOTE'],
  //         required_n: 2,
  //         condition_json: null,
  //         severity: 'warning',
  //         message: 'Hypertension diagnosis requires blood pressure recording and follow-up note',
  //         active: true,
  //         version_no: 1,
  //         gcrule_type: 'document',
  //         created_date: '2024-01-10T14:20:00Z',
  //         updated_date: '2024-01-12T09:15:00Z'
  //       }, 
  //       {
  //         id: '3',
  //         rule_name: 'Kelengkapan Dokumen Diabetes',
  //         rule_description: 'Pastikan dokumentasi lengkap untuk pasien diabetes',
  //         trigger_code_id: 'E11',
  //         trigger_code_system: 'ICD-10',
  //         required_code_system: 'DOC',
  //         required_mode: 'all',
  //         required_codes: ['medical_record', 'lab_result', 'progress_note'],
  //         required_n: 3,
  //         condition_json: null,
  //         severity: 'warning',
  //         message: 'Pasien diabetes memerlukan rekam medis lengkap, hasil laboratorium, dan catatan perkembangan',
  //         active: true,
  //         version_no: 1,
  //         gcrule_type: 'document',
  //         created_date: '2024-01-20T08:15:00Z',
  //         updated_date: '2024-01-20T08:15:00Z'
  //       },
  //       {
  //         id: '4', 
  //         rule_name: 'Dokumen Pre-Operasi',
  //         rule_description: 'Kelengkapan dokumen sebelum tindakan operasi',
  //         trigger_code_id: 'Z01.81',
  //         trigger_code_system: 'ICD-10',
  //         required_code_system: 'DOC',
  //         required_mode: 'all',
  //         required_codes: ['consent_form', 'lab_result', 'radiology_report'],
  //         required_n: 3,
  //         condition_json: { procedure_type: 'surgical' },
  //         severity: 'error',
  //         message: 'Tindakan operasi memerlukan persetujuan, hasil lab, dan laporan radiologi',
  //         active: true,
  //         version_no: 1,
  //         gcrule_type: 'document',
  //         created_date: '2024-01-18T14:30:00Z',
  //         updated_date: '2024-01-18T14:30:00Z'
  //       }
  //     ]
  //   } catch (err) {
  //     error.value = 'Failed to fetch rules: ' + (err as Error).message
  //   } finally {
  //     loading.value = false
  //   }
  // }

  async function fetchRules() {
    loading.value = true
    error.value = null
    try {
      const response = await api.get('/cross-check-rules')
      
      // Transform data sesuai struktur response baru
      rules.value = response.data.data.map(rule => ({
        id: rule.id,
        rule_no: rule.rule_no,
        rule_name: rule.rule_name,
        rule_description: rule.rule_description,
        trigger_code_id: rule.trigger_code_id,
        trigger_code_system: rule.code_system, // dari code_system
        required_code_system: rule.triger_gccode_system,
        required_mode: rule.required_mode, // dari required_mode
        required_codes: rule.required_codes,
        required_n: rule.required_n,
        condition_json: rule.condition_json,
        severity: rule.severity, // dari severity
        message: rule.message,
        active: rule.is_active,
        version_no: 1, // default value
        gcrule_type: 'code', // default value, bisa disesuaikan
        created_date: rule.created_date,
        updated_date: rule.updated_date || rule.created_date
      }))
      
    } catch (err) {
      error.value = 'Failed to fetch rules: ' + (err.message || err)
      console.error('Error fetching rules:', err)
    } finally {
      loading.value = false
    }
  }
  async function createRule(ruleData: CrossCheckRule) {
    try {
      // Replace with actual API call
      // const response = await api.post('/cross-check-rules', ruleData)
      const newRule: CrossCheckRule = {
        ...ruleData,
        id: Date.now().toString(),
        created_date: new Date().toISOString(),
        updated_date: new Date().toISOString()
      }
      rules.value.push(newRule)
      closeModals()
      return newRule
    } catch (err) {
      error.value = 'Failed to create rule: ' + (err as Error).message
      throw err
    }
  }

  async function updateRule(ruleData: CrossCheckRule) {
    try {
      // Replace with actual API call
      // const response = await api.put(`/cross-check-rules/${ruleData.id}`, ruleData)
      const index = rules.value.findIndex(r => r.id === ruleData.id)
      if (index !== -1) {
        rules.value[index] = {
          ...ruleData,
          updated_date: new Date().toISOString(),
          version_no: (rules.value[index].version_no || 1) + 1
        }
      }
      closeModals()
      return rules.value[index]
    } catch (err) {
      error.value = 'Failed to update rule: ' + (err as Error).message
      throw err
    }
  }

  async function deleteRule(id: string) {
    try {
      // Replace with actual API call
      // await api.delete(`/cross-check-rules/${id}`)
      rules.value = rules.value.filter(rule => rule.id !== id)
      closeModals()
    } catch (err) {
      error.value = 'Failed to delete rule: ' + (err as Error).message
      throw err
    }
  }

  function resetFilters() {
    filters.value = { ...INITIAL_FILTERS }
    currentPage.value = 1
  }

  return {
    // State
    rules,
    loading,
    error,
    filters,
    currentPage,
    itemsPerPage,
    
    // Modal states
    showCreateModal,
    showEditModal,
    showViewModal,
    showDeleteModal,
    editingRule,
    viewingRule,
    deletingRuleId,
    
    // Computed
    filteredRules,
    paginatedRules,
    totalPages,
    
    // Methods
    fetchRules,
    createRule,
    updateRule,
    deleteRule,
    openCreateModal,
    openEditModal,
    openViewModal,
    openDeleteModal,
    closeModals,
    resetFilters
  }
}