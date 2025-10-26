// composables/useReference.ts
import { readonly, ref, type Ref } from 'vue'
import api from '@/services/api'
import { IStandardcode, IStandardcodeListResponse } from '@/interface/IStandardcode'


/**
 * Composable untuk mengelola data reference
 */
export function useReference() {
  const loading = ref(false)
  const error = ref<string | null>(null)

  /**
   * Mengambil data reference berdasarkan parent_id
   */
  const getReferenceByParent = async (
    parentId: string, 
    target?: Ref<IStandardcode[]>
  ): Promise<IStandardcode[]> => {
    loading.value = true
    error.value = null

    try {
      const response = await api.get<IStandardcodeListResponse>(`/reference/code?parent_id=${parentId}`)
      
      if (response.data && Array.isArray(response.data.data)) {
        const referenceData = response.data.data
        
        // Jika target disediakan, update reactive reference
        if (target) {
          target.value = referenceData
        }
        
        return referenceData
      } else {
        console.warn(`No data found for parent_id: ${parentId}`)
        const emptyData: IStandardcode[] = []
        if (target) target.value = emptyData
        return emptyData
      }
    } catch (err: any) {
      const errorMessage = `Error fetching reference for ${parentId}: ${err.message}`
      console.error(errorMessage)
      error.value = errorMessage
      
      const emptyData: IStandardcode[] = []
      if (target) target.value = emptyData
      return emptyData
    } finally {
      loading.value = false
    }
  }

  /**
   * Mengambil multiple references sekaligus
   */
  const getMultipleReferences = async (
    references: { parentId: string; target: Ref<IStandardcode[]> }[]
  ): Promise<void> => {
    loading.value = true
    error.value = null

    try {
      await Promise.all(
        references.map(ref => getReferenceByParent(ref.parentId, ref.target))
      )
    } catch (err: any) {
      const errorMessage = `Error fetching multiple references: ${err.message}`
      console.error(errorMessage)
      error.value = errorMessage
    } finally {
      loading.value = false
    }
  }

  /**
   * Clear error
   */
  const clearError = () => {
    error.value = null
  }

  return {
    // State
    loading: readonly(loading),
    error: readonly(error),
    
    // Methods
    getReferenceByParent,
    getMultipleReferences,
    clearError
  }
}

/**
 * Composable untuk reference tertentu (optimized untuk specific use case)
 */
export function useSpecificReference(parentId: string) {
  const data = ref<IStandardcode[]>([])
  const { loading, error, getReferenceByParent, clearError } = useReference()

  /**
   * Load data untuk parentId tertentu
   */
  const load = async (): Promise<IStandardcode[]> => {
    return await getReferenceByParent(parentId, data)
  }

  return {
    // State
    data: readonly(data),
    loading: readonly(loading),
    error: readonly(error),
    
    // Methods
    load,
    clearError,
    
    // Utilities
    findByCode: (code: string) => data.value.find(item => item.standardcode_id === code),
    findByName: (name: string) => data.value.find(item => item.standardcode_name === name),
    getOptions: () => data.value.map(item => ({
      value: item.standardcode_id,
      label: item.standardcode_name,
      ...item
    }))
  }
}