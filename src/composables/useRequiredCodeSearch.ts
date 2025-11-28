// composables/useRequiredCodeSearch.ts
import api from '@/services/api'
import { ref } from 'vue'
 
export function useRequiredCodeSearch() {
  const requiredSuggestions = ref<Record<number, any[]>>({})
  const showRequiredSuggestions = ref<Record<number, boolean>>({})
  const searchingRequired = ref<Record<number, boolean>>({})
  const requiredPagination = ref<Record<number, { 
    skip: number; 
    limit: number; 
    total: number; 
    hasMore: boolean 
  }>>({})
  const requiredCodeErrors = ref<Record<number, string>>({})

  const initializeRequiredState = (index: number) => {
    if (!requiredSuggestions.value[index]) {
      requiredSuggestions.value[index] = []
      showRequiredSuggestions.value[index] = false
      searchingRequired.value[index] = false
      requiredPagination.value[index] = { 
        skip: 0, 
        limit: 20, 
        total: 0, 
        hasMore: false 
      }
      requiredCodeErrors.value[index] = ''
    }
  }

  const searchRequiredICDCode = async (index: number, system: string, query: string, page: number = 1) => {
    if (!query || query.length < 2) {
      setRequiredCodeError(index, 'Masukkan minimal 2 karakter untuk pencarian')
      return { error: 'Masukkan minimal 2 karakter untuk pencarian' }
    }

    if (!system) {
      setRequiredCodeError(index, 'Pilih sistem kode terlebih dahulu')
      return { error: 'Pilih sistem kode terlebih dahulu' }
    }

    initializeRequiredState(index)
    setSearchingRequired(index, true)
    setRequiredCodeError(index, '')

    try {
      const skip = (page - 1) * requiredPagination.value[index].limit
      const encodedSystem = encodeURIComponent(system)
      const encodedKeyword = encodeURIComponent(query)
      
      const response = await api.get(
        `/reference/icd?gccode_system=${encodedSystem}&keyword=${encodedKeyword}&skip=${skip}&limit=${requiredPagination.value[index].limit}`
      )

      if (response.data.success && response.data.data) {
        const data = response.data.data
        const items = data.items || []
        
        if (page === 1) {
          setRequiredSuggestions(index, items)
        } else {
          setRequiredSuggestions(index, [...requiredSuggestions.value[index], ...items])
        }
        
        setRequiredPagination(index, {
          skip: data.skip || skip,
          limit: data.limit || requiredPagination.value[index].limit,
          total: data.total || 0,
          hasMore: (data.skip + data.limit) < data.total
        })
        
        setShowRequiredSuggestions(index, true)
        return { 
          success: true, 
          suggestions: items,
          hasMore: (data.skip + data.limit) < data.total
        }
      } else {
        setRequiredSuggestions(index, [])
        setShowRequiredSuggestions(index, false)
        return { error: 'Tidak ada hasil ditemukan' }
      }
    } catch (error: any) {
      console.error('Error searching required ICD codes:', error)
      const errorMsg = error.response?.data?.message || 'Gagal mencari kode ICD'
      setRequiredCodeError(index, errorMsg)
      return { error: errorMsg }
    } finally {
      setSearchingRequired(index, false)
    }
  }

  const setRequiredSuggestions = (index: number, suggestions: any[]) => {
    requiredSuggestions.value[index] = suggestions
  }

  const setShowRequiredSuggestions = (index: number, show: boolean) => {
    showRequiredSuggestions.value[index] = show
  }

  const setSearchingRequired = (index: number, searching: boolean) => {
    searchingRequired.value[index] = searching
  }

  const setRequiredPagination = (index: number, pagination: { 
    skip: number; 
    limit: number; 
    total: number; 
    hasMore: boolean 
  }) => {
    requiredPagination.value[index] = pagination
  }

  const setRequiredCodeError = (index: number, error: string) => {
    requiredCodeErrors.value[index] = error
  }

  const clearRequiredSuggestions = (index: number) => {
    requiredSuggestions.value[index] = []
    showRequiredSuggestions.value[index] = false
    requiredPagination.value[index] = { 
      skip: 0, 
      limit: 20, 
      total: 0, 
      hasMore: false 
    }
  }

  return {
    requiredSuggestions,
    showRequiredSuggestions,
    searchingRequired,
    requiredPagination,
    requiredCodeErrors,
    searchRequiredICDCode,
    setRequiredSuggestions,
    setShowRequiredSuggestions,
    setSearchingRequired,
    setRequiredPagination,
    setRequiredCodeError,
    clearRequiredSuggestions
  }
}