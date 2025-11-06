import { ref } from "vue"

// composables/useRuleValidation.ts
export function useRuleValidation() {
  const triggerCodeError = ref('')
  const triggerSystemError = ref('')
  const requiredCodeErrors = ref<string[]>([])
  const jsonError = ref({
    condition_json: ''
  })

  const validateTriggerCode = (code: string, isICDRule: boolean, selectedICDInfo: any) => {
    if (!code?.trim()) {
      return 'Kode pemicu harus diisi'
    }

    if (isICDRule) {
      if (selectedICDInfo) {
        if (selectedICDInfo.valid_code !== 1) {
          return 'Kode ICD tidak valid menurut sistem'
        }
      } else {
        const icdPattern = /^[A-TV-Z][0-9][0-9A-Z](\.[0-9A-Z]{1,4})?$/
        if (!icdPattern.test(code)) {
          return 'Format kode ICD tidak valid. Contoh: E11, I10, A01.0'
        }
      }
    }

    return ''
  }

  const validateTriggerSystem = (system: string, isICDRule: boolean) => {
    if (!system) {
      return 'Sistem kode harus dipilih'
    }

    if (isICDRule && !system.includes('ICD')) {
      return 'Untuk aturan ICD, sistem kode harus ICD'
    }

    return ''
  }

  const validateRequiredCode = (code: string, system: string, index: number) => {
    if (!code?.trim()) {
      return 'Kode diperlukan harus diisi'
    }

    if (system === 'ATC') {
      const atcPattern = /^[A-Z][0-9]{2}[A-Z][A-Z]$/
      if (!atcPattern.test(code)) {
        return 'Format kode ATC tidak valid. Contoh: A10BA'
      }
    } else if (system === 'CPT') {
      const cptPattern = /^\d{5}$/
      if (!cptPattern.test(code)) {
        return 'Format kode CPT tidak valid. Contoh: 99213'
      }
    }

    return ''
  }

  const validateConditionJson = (jsonString: string) => {
    try {
      if (jsonString.trim()) {
        JSON.parse(jsonString)
        return ''
      }
      return ''
    } catch (e) {
      return (e as Error).message
    }
  }

  return {
    triggerCodeError,
    triggerSystemError,
    requiredCodeErrors,
    jsonError,
    validateTriggerCode,
    validateTriggerSystem,
    validateRequiredCode,
    validateConditionJson
  }
}