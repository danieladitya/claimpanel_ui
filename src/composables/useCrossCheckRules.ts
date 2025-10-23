import { ref, computed, Ref } from 'vue'
import { INITIAL_FILTERS, INITIAL_RULE } from '@/utils/constants'
import api from '@/services/api';
import { ICrossCheckRules } from '@/interface/ICrossCheckRules';
import { ICrossCheckRulesListResponse } from '../interface/ICrossCheckRules';
 
export interface Filters {
  rule_name: string;
  trigger_code_system: string;
  active: string;
}

export function useCrossCheckRules() {
  const rules = ref<ICrossCheckRules[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const respData = ref<ICrossCheckRulesListResponse>()
  // Filter state
  const filters = ref<Filters>({ ...INITIAL_FILTERS })
  const currentPage = ref(1)
  const itemsPerPage = 10

  // Modal states
  const showCreateModal = ref(false)
  const showEditModal = ref(false)
  const showViewModal = ref(false)
  const showDeleteModal = ref(false)
  
  const editingRule = ref<ICrossCheckRules | null>(null)
  const viewingRule = ref<ICrossCheckRules | null>(null)
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
        rule.triger_gccode_system === filters.value.trigger_code_system
      )
    }

    if (filters.value.active !== '') {
      filtered = filtered.filter(rule => 
        rule.is_active === (filters.value.active === 'true')
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

  function openEditModal(rule: ICrossCheckRules) {
    editingRule.value = { ...rule }
    showEditModal.value = true
  }

  function openViewModal(rule: ICrossCheckRules) {
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

 
  async function fetchRules() {
    loading.value = true
    error.value = null
    try {
      const response = await api.get('/cross-check-rules')
      respData.value = response.data
      if(respData.value){
        rules.value = respData.value.data ?? []
      }
       
    } catch (err : any) {
      error.value = 'Failed to fetch rules: ' + (err.message || err)
      console.error('Error fetching rules:', err)
    } finally {
      loading.value = false
    }
  }
  async function createRule(ruleData: ICrossCheckRules) {
    try {
      // Replace with actual API call
      // const response = await api.post('/cross-check-rules', ruleData)
      const newRule: ICrossCheckRules = {
        ...ruleData,
        id: Date.now().toString(),
        created_date: new Date().toISOString(),
       // updated_date: new Date().toISOString()
      }
      rules.value.push(newRule)
      closeModals()
      return newRule
    } catch (err) {
      error.value = 'Failed to create rule: ' + (err as Error).message
      throw err
    }
  }

  async function updateRule(ruleData: ICrossCheckRules) {
    try {
      // Replace with actual API call
      // const response = await api.put(`/cross-check-rules/${ruleData.id}`, ruleData)
      const index = rules.value.findIndex(r => r.id === ruleData.id)
      if (index !== -1) {
        rules.value[index] = {
          ...ruleData,
          //updated_date: new Date().toISOString(),
         //version_no: (rules.value[index].version_no || 1) + 1
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