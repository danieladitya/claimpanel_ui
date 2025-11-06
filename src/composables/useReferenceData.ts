// composables/useReferenceData.ts
import { ref } from 'vue'
import api from '@/services/api'

export function useReferenceData() {
  const RULE_TYPE_OPTIONS = ref<any[]>([])
  const SEVERITY_OPTIONS = ref<any[]>([])
  const CODE_SYSTEM_OPTIONS = ref<any[]>([])
  const REQUIRED_MODE_OPTIONS = ref<any[]>([])
  const DOCUMENT_TYPE_OPTIONS = ref<any[]>([])

  const UNIVERSAL_DOCUMENT_OPTIONS = ref([
    { value: 'SEP', label: 'Surat Eligibilitas Pasien (SEP)' },
    { value: 'IDENTITY_CARD', label: 'Kartu Identitas Pasien' },
    { value: 'INSURANCE_CARD', label: 'Kartu Asuransi' },
    { value: 'REFERRAL_LETTER', label: 'Surat Rujukan' },
    { value: 'CONSENT_FORM', label: 'Form Persetujuan Tindakan' },
    { value: 'ADMISSION_FORM', label: 'Form Pendaftaran' },
    { value: 'MEDICAL_RECORD', label: 'Rekam Medis' },
    { value: 'LAB_RESULT', label: 'Hasil Laboratorium' },
    { value: 'RADIOLOGY_REPORT', label: 'Laporan Radiologi' }
  ])

  const STATUS_OPTIONS = [
    { value: 'true', label: 'Aktif' },
    { value: 'false', label: 'Non-Aktif' }
  ]

  const getReferenceByParent = async (parentId: string, target: any) => {
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

  const loadAllReferences = async () => {
    await Promise.all([
      getReferenceByParent('X002', RULE_TYPE_OPTIONS),
      getReferenceByParent('X004', SEVERITY_OPTIONS),
      getReferenceByParent('X678', CODE_SYSTEM_OPTIONS),
      getReferenceByParent('X003', REQUIRED_MODE_OPTIONS),
      getReferenceByParent('X001', DOCUMENT_TYPE_OPTIONS)
    ])
  }

  return {
    RULE_TYPE_OPTIONS,
    SEVERITY_OPTIONS,
    CODE_SYSTEM_OPTIONS,
    REQUIRED_MODE_OPTIONS,
    DOCUMENT_TYPE_OPTIONS,
    UNIVERSAL_DOCUMENT_OPTIONS,
    STATUS_OPTIONS,
    loadAllReferences,
    getReferenceByParent
  }
}