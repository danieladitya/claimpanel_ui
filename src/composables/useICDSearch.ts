// composables/useICDSearch.ts
import { ref } from 'vue'
import api from '@/services/api'

export function useICDSearch() {
  const icdSuggestions = ref<any[]>([])
  const showICDSuggestions = ref(false)
  const searchingICD = ref(false)
  const icdSearchQuery = ref('')
  const selectedICDInfo = ref<any>(null)
  const icdPagination = ref({
    skip: 0,
    limit: 20,
    total: 0,
    hasMore: false
  })

  const searchICDCode = async (system: string, query: string, isAutoSearch: boolean = false) => {
    if (!query || query.length < 2) {
      return { error: 'Masukkan minimal 2 karakter untuk pencarian' }
    }

    if (!system) {
      return { error: 'Pilih sistem kode terlebih dahulu' }
    }

    searchingICD.value = true

    try {
      const encodedSystem = encodeURIComponent(system)
      const encodedKeyword = encodeURIComponent(query)
      
      const response = await api.get(
        `/reference/icd?gccode_system=${encodedSystem}&keyword=${encodedKeyword}&skip=0&limit=${icdPagination.value.limit}`
      )

      if (response.data.success && response.data.data) {
        const data = response.data.data
        icdSuggestions.value = data.items || []
        icdPagination.value = {
          skip: data.skip || 0,
          limit: data.limit || 20,
          total: data.total || 0,
          hasMore: (data.skip + data.limit) < data.total
        }
        showICDSuggestions.value = true
        return { success: true }
      } else {
        icdSuggestions.value = []
        return { error: 'Tidak ada hasil ditemukan' }
      }
    } catch (error) {
      console.error('Error searching ICD codes:', error)
      return { error: 'Gagal mencari kode ICD' }
    } finally {
      searchingICD.value = false
    }
  }

  const loadMoreICD = async (system: string, query: string) => {
    if (searchingICD.value || !icdPagination.value.hasMore) return

    searchingICD.value = true
    icdPagination.value.skip += icdPagination.value.limit

    try {
      const encodedSystem = encodeURIComponent(system)
      const encodedKeyword = encodeURIComponent(query)
      
      const response = await api.get(
        `/reference/icd?gccode_system=${encodedSystem}&keyword=${encodedKeyword}&skip=${icdPagination.value.skip}&limit=${icdPagination.value.limit}`
      )

      if (response.data.success && response.data.data) {
        const newItems = response.data.data.items || []
        icdSuggestions.value = [...icdSuggestions.value, ...newItems]
        icdPagination.value.hasMore = 
          (icdPagination.value.skip + icdPagination.value.limit) < response.data.data.total
      }
    } catch (error) {
      console.error('Error loading more ICD codes:', error)
    } finally {
      searchingICD.value = false
    }
  }

  const clearICDSelection = () => {
    selectedICDInfo.value = null
    icdSuggestions.value = []
    showICDSuggestions.value = false
  }

  const selectICDCode = (icd: any) => {
    selectedICDInfo.value = icd
    showICDSuggestions.value = false
    return icd.code
  }

  return {
    icdSuggestions,
    showICDSuggestions,
    searchingICD,
    icdSearchQuery,
    selectedICDInfo,
    icdPagination,
    searchICDCode,
    loadMoreICD,
    clearICDSelection,
    selectICDCode
  }
}