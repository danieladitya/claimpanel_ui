// composables/useICDSearch.ts
import api from '@/services/api'
import { ref } from 'vue'
 
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

  const searchICDCode = async (system: string, query: string, page: number = 1) => {
    if (!query || query.length < 2) {
      return { error: 'Masukkan minimal 2 karakter untuk pencarian' }
    }

    if (!system) {
      return { error: 'Pilih sistem kode terlebih dahulu' }
    }

    searchingICD.value = true
    icdSearchQuery.value = query

    try {
      const skip = (page - 1) * icdPagination.value.limit
      const encodedSystem = encodeURIComponent(system)
      const encodedKeyword = encodeURIComponent(query)
      
      const response = await api.get(
        `/reference/icd?gccode_system=${encodedSystem}&keyword=${encodedKeyword}&skip=${skip}&limit=${icdPagination.value.limit}`
      )

      if (response.data.success && response.data.data) {
        const data = response.data.data
        const items = data.items || []
        
        if (page === 1) {
          icdSuggestions.value = items
        } else {
          icdSuggestions.value = [...icdSuggestions.value, ...items]
        }
        
        icdPagination.value = {
          skip: data.skip || skip,
          limit: data.limit || icdPagination.value.limit,
          total: data.total || 0,
          hasMore: (data.skip + data.limit) < data.total
        }
        
        showICDSuggestions.value = true
        return { 
          success: true,
          suggestions: items,
          hasMore: (data.skip + data.limit) < data.total
        }
      } else {
        icdSuggestions.value = []
        return { error: 'Tidak ada hasil ditemukan' }
      }
    } catch (error: any) {
      console.error('Error searching ICD codes:', error)
      return { error: 'Gagal mencari kode ICD' }
    } finally {
      searchingICD.value = false
    }
  }

  const loadMoreICD = async (system: string, query: string) => {
    const currentPage = Math.floor(icdPagination.value.skip / icdPagination.value.limit) + 1
    const nextPage = currentPage + 1
    return await searchICDCode(system, query, nextPage)
  }

  const clearICDSelection = () => {
    icdSuggestions.value = []
    showICDSuggestions.value = false
    selectedICDInfo.value = null
    icdSearchQuery.value = ''
    icdPagination.value = {
      skip: 0,
      limit: 20,
      total: 0,
      hasMore: false
    }
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
    clearICDSelection
  }
}