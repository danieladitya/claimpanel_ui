import { ref, computed, type Ref } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/services/api'

interface ClaimData {
  claim: any
  payors: any[]
}

interface ClaimDetailState {
  claimData: Ref<ClaimData | null>
  loading: Ref<boolean>
  uploading: Ref<string | null>
}

interface ClaimDetailActions {
  fetchClaimData: (id: string) => Promise<void>
  downloadDocument: (payorId: string, document: any) => void
  previewDocument: (payorId: string, document: any) => void
  verifyDocument: (payorId: string, documentId: string) => Promise<void>
  rejectDocument: (payorId: string, documentId: string) => Promise<void>
}

interface ClaimDetailUtils {
  claim: any
  payors: any[]
  primaryPayor: any
  getStatusBadgeClass: (status: string) => string
  getPayorTypeBadgeClass: (payorType: string) => string
  formatCurrency: (amount: number) => string
  formatDate: (dateString: string) => string
  formatDateTime: (dateString: string) => string
  formatFileSize: (bytes: number) => string
  getPayorDocuments: (payorId: string) => any[]
  getDocumentStats: (payorId: string) => any
  getDocumentStatus: (document: any) => string
  getDocumentStatusText: (document: any) => string
}

export function useClaimDetail(claimId?: Ref<string | null>): ClaimDetailState & ClaimDetailActions & ClaimDetailUtils {
  const route = useRoute()
  
  // State
  const claimData = ref<ClaimData | null>(null)
  const loading = ref(false)
  const uploading = ref<string | null>(null)

  // Computed properties
  const claim = computed(() => claimData.value?.claim || null)
  const payors = computed(() => claimData.value?.payors || [])
  const primaryPayor = computed(() => payors.value.find((p: any) => p.is_primary) || payors.value[0])

  // Format functions
  const getStatusBadgeClass = (status: string): string => {
    const statusMap: { [key: string]: string } = {
      'approved': 'bg-green-100 text-green-800 border-green-200',
      'draft': 'bg-gray-100 text-gray-800 border-gray-200',
      'pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'rejected': 'bg-red-100 text-red-800 border-red-200',
      'processed': 'bg-blue-100 text-blue-800 border-blue-200',
      'verified': 'bg-green-100 text-green-800 border-green-200',
      'unverified': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'missing': 'bg-red-100 text-red-800 border-red-200'
    }
    return statusMap[status?.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  const getPayorTypeBadgeClass = (payorType: string): string => {
    const typeMap: { [key: string]: string } = {
      'bpjs': 'bg-blue-100 text-blue-800 border-blue-200',
      'asuransi': 'bg-purple-100 text-purple-800 border-purple-200',
      'perusahaan': 'bg-orange-100 text-orange-800 border-orange-200',
      'pribadi': 'bg-gray-100 text-gray-800 border-gray-200'
    }
    return typeMap[payorType?.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateString: string): string => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatDateTime = (dateString: string): string => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatFileSize = (bytes: number): string => {
    if (!bytes) return '-'
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }

  // Document functions
  const getPayorDocuments = (payorId: string): any[] => {
    const payor = payors.value.find((p: any) => p.id === payorId)
    return payor?.documents || []
  }

  const getDocumentStats = (payorId: string): any => {
    const documents = getPayorDocuments(payorId)
    const totalRequired = documents.length
    const totalUploaded = documents.filter((doc: any) => doc.file_path && doc.file_path !== '').length
    const totalVerified = documents.filter((doc: any) => doc.is_result_merge === 1).length
    
    return {
      totalRequired,
      totalUploaded,
      totalVerified,
      progress: totalRequired > 0 ? Math.round((totalUploaded / totalRequired) * 100) : 0
    }
  }

  const getDocumentStatus = (document: any): string => {
    if (!document.file_path || document.file_path === '') return 'missing'
    if (document.is_result_merge === 1) return 'verified'
    return 'unverified'
  }

  const getDocumentStatusText = (document: any): string => {
    const status = getDocumentStatus(document)
    const statusMap: { [key: string]: string } = {
      'missing': 'Belum Upload',
      'unverified': 'Menunggu Verifikasi',
      'verified': 'Terverifikasi'
    }
    return statusMap[status] || 'Unknown'
  }

  // Actions
  const fetchClaimData = async (id: any): Promise<void> => {
    try {
      loading.value = true
      const resp = await api.get(`/claim/${id}`)
      if (resp.data.success) {
        claimData.value = resp.data.data
        console.log('Claim data dengan documents:', claimData.value)
      }
    } catch (e) {
      console.error('Gagal ambil detail klaim:', e)
      alert('Gagal memuat data klaim')
    } finally {
      loading.value = false
    }
  }

  const downloadDocument = async (payorId: string, document: any): Promise<void> => {
    try {
      console.log('Download document:', payorId, document)
      
      if (document.file_path && document.file_path !== '') {
        const fileUrl = `http://127.0.0.1:8000/api/v1/claim/document/${document.id}/download`
        window.open(fileUrl, '_blank')
      } else {
        alert('Dokumen belum tersedia untuk di-download')
      }
      
    } catch (error) {
      console.error('Download error:', error)
      alert('Gagal mendownload dokumen')
    }
  }

  const previewDocument = (payorId: string, document: any): void => {
    console.log('Preview document:', payorId, document)
    if (document.file_path && document.file_path !== '') {
      const fileUrl = `http://127.0.0.1:8000/api/v1/claim/document/${document.id}/preview`
      window.open(fileUrl, '_blank')
    } else {
      alert('Dokumen belum tersedia untuk di-preview')
    }
  }

  const verifyDocument = async (payorId: string, documentId: string): Promise<void> => {
    try {
      console.log('Verify document:', payorId, documentId)
      
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const currentClaimId = claimId?.value || route.params.id
      if (currentClaimId) {
        await fetchClaimData(currentClaimId)
      }
      
      alert('Document berhasil diverifikasi')
    } catch (error) {
      console.error('Verify error:', error)
      alert('Gagal memverifikasi document')
    }
  }

  const rejectDocument = async (payorId: string, documentId: string): Promise<void> => {
    try {
      console.log('Reject document:', payorId, documentId)
      
      const reason = prompt('Alasan penolakan:')
      if (!reason) return
      
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const currentClaimId = claimId?.value || route.params.id
      if (currentClaimId) {
        await fetchClaimData(currentClaimId)
      }
      
      alert('Document ditolak')
    } catch (error) {
      console.error('Reject error:', error)
      alert('Gagal menolak document')
    }
  }

  return {
    // State
    claimData,
    loading,
    uploading,

    // Actions
    fetchClaimData,
    downloadDocument,
    previewDocument,
    verifyDocument,
    rejectDocument,

    // Computed
    claim,
    payors,
    primaryPayor,

    // Utils
    getStatusBadgeClass,
    getPayorTypeBadgeClass,
    formatCurrency,
    formatDate,
    formatDateTime,
    formatFileSize,
    getPayorDocuments,
    getDocumentStats,
    getDocumentStatus,
    getDocumentStatusText
  }
}