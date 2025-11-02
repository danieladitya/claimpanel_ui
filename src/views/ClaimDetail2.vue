<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue';
import api from '@/services/api'
import { useRoute } from 'vue-router';
import AdminLayout from '@/layouts/AdminLayout.vue';
import { 
  ArrowLeftIcon, 
  UserIcon, 
  CalendarIcon, 
  DocumentTextIcon, 
  IdentificationIcon,
  BuildingLibraryIcon,
  CreditCardIcon,
  DocumentArrowDownIcon,
  DocumentPlusIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  ClockIcon
} from "@heroicons/vue/24/outline"

const props = defineProps<{ claimId: string | null }>()
const emit = defineEmits(['back'])

const claimData = ref<any | null>(null)
const loading = ref(false)
const uploading = ref<string | null>(null)

// Computed properties
const claim = computed(() => claimData.value?.claim || null)
const payors = computed(() => claimData.value?.payors || [])
const primaryPayor = computed(() => payors.value.find((p: any) => p.is_primary) || payors.value[0])

// Format status dengan badge
const getStatusBadgeClass = (status: string) => {
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

// Format payor type badge
const getPayorTypeBadgeClass = (payorType: string) => {
  const typeMap: { [key: string]: string } = {
    'bpjs': 'bg-blue-100 text-blue-800 border-blue-200',
    'asuransi': 'bg-purple-100 text-purple-800 border-purple-200',
    'perusahaan': 'bg-orange-100 text-orange-800 border-orange-200',
    'pribadi': 'bg-gray-100 text-gray-800 border-gray-200'
  }
  return typeMap[payorType?.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-200'
}

// Format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

// Format date
const formatDate = (dateString: string) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Format datetime
const formatDateTime = (dateString: string) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Format file size (dari bytes ke readable format)
const formatFileSize = (bytes: number) => {
  if (!bytes) return '-'
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
}

// Get documents untuk payor tertentu
const getPayorDocuments = (payorId: string) => {
  const payor = payors.value.find((p: any) => p.id === payorId)
  return payor?.documents || []
}

// Get document stats
const getDocumentStats = (payorId: string) => {
  const documents = getPayorDocuments(payorId)
  const totalRequired = documents.length // Asumsikan semua dokumen required
  const totalUploaded = documents.filter((doc: any) => doc.file_path && doc.file_path !== '').length
  const totalVerified = documents.filter((doc: any) => doc.is_result_merge === 1).length
  
  return {
    totalRequired,
    totalUploaded,
    totalVerified,
    progress: totalRequired > 0 ? Math.round((totalUploaded / totalRequired) * 100) : 0
  }
}

// Get document status
const getDocumentStatus = (document: any) => {
  if (!document.file_path || document.file_path === '') return 'missing'
  if (document.is_result_merge === 1) return 'verified'
  return 'unverified'
}

// Get document status text
const getDocumentStatusText = (document: any) => {
  const status = getDocumentStatus(document)
  const statusMap = {
    'missing': 'Belum Upload',
    'unverified': 'Menunggu Verifikasi',
    'verified': 'Terverifikasi'
  }
  return statusMap[status] || 'Unknown'
}

// Download document
const downloadDocument = async (payorId: string, document: any) => {
  try {
    console.log('Download document:', payorId, document)
    
    // Jika document memiliki file_path yang valid
    if (document.file_path && document.file_path !== '') {
      // Implement download logic berdasarkan file_path
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

// Preview document
const previewDocument = (payorId: string, document: any) => {
  console.log('Preview document:', payorId, document)
  if (document.file_path && document.file_path !== '') {
    // Implement preview logic here
    const fileUrl = `http://127.0.0.1:8000/api/v1/claim/document/${document.id}/preview`
    window.open(fileUrl, '_blank')
  } else {
    alert('Dokumen belum tersedia untuk di-preview')
  }
}

// Upload document
const uploadDocument = async (payorId: string, documentType: string) => {
  uploading.value = payorId
  try {
    console.log('Upload document for payor:', payorId, documentType)
    
    // Implement upload logic here
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // After upload, refresh data
    if (props.claimId) {
      await fetchClaimData(props.claimId)
    }
    
    alert(`Document ${documentType} berhasil diupload`)
  } catch (error) {
    console.error('Upload error:', error)
    alert('Gagal mengupload document')
  } finally {
    uploading.value = null
  }
}

// Verify document
const verifyDocument = async (payorId: string, documentId: string) => {
  try {
    console.log('Verify document:', payorId, documentId)
    
    // Implement verify logic here
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // After verification, refresh data
    if (props.claimId) {
      await fetchClaimData(props.claimId)
    }
    
    alert('Document berhasil diverifikasi')
  } catch (error) {
    console.error('Verify error:', error)
    alert('Gagal memverifikasi document')
  }
}

// Reject document
const rejectDocument = async (payorId: string, documentId: string) => {
  try {
    console.log('Reject document:', payorId, documentId)
    
    const reason = prompt('Alasan penolakan:')
    if (!reason) return
    
    // Implement reject logic here
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // After rejection, refresh data
    if (props.claimId) {
      await fetchClaimData(props.claimId)
    }
    
    alert('Document ditolak')
  } catch (error) {
    console.error('Reject error:', error)
    alert('Gagal menolak document')
  }
}
const route = useRoute()


// ======= Lifecycle =======
onMounted(() => {
  const claimId = route.params.id
  fetchClaimData(claimId)
})

async function fetchClaimData(id: any) {
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

watch(
  () => props.claimId,
  async (id) => {
    if (id) {
      await fetchClaimData(id)
    }
  }, 
  { immediate: true }
)
</script>

<template>
  <AdminLayout>
     
      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="w-12 h-12 border-b-2 border-blue-600 rounded-full animate-spin"></div>
      </div>

      <!-- Main Content -->
      <div v-else-if="claim" class="space-y-6">
        <!-- Header Card -->
        <div class="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
          <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between">
            <div class="flex-1">
              <div class="flex items-center mb-3 space-x-3">
                <div class="p-2 bg-blue-100 rounded-lg">
                  <DocumentTextIcon class="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h1 class="text-2xl font-bold text-gray-900">
                    {{ claim.claim_number }}
                  </h1>
                  <p class="text-sm text-gray-600">Nomor Klaim</p>
                </div>
              </div>
              
              <div class="flex flex-wrap items-center gap-4 mt-4">
                <span 
                  :class="['px-3 py-1 rounded-full text-sm font-medium border', getStatusBadgeClass(claim.claim_status)]"
                >
                  {{ claim.claim_status }}
                </span>
                <span class="text-sm text-gray-600">
                  Dibuat: {{ formatDateTime(claim.created_at) }}
                </span>
                <span class="text-sm text-gray-600">
                  COB: {{ claim.is_cob ? 'Ya' : 'Tidak' }}
                </span>
              </div>
            </div>
            
            <div class="mt-4 lg:mt-0 lg:ml-6">
              <div class="p-4 border border-blue-200 rounded-lg bg-blue-50">
                <p class="text-sm font-medium text-blue-900">Coverage Amount</p>
                <p class="text-2xl font-bold text-blue-700">{{ formatCurrency(claim.coverage_amount) }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Grid Layout -->
        <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <!-- Kolom Kiri - Informasi Klaim & Pasien -->
          <div class="space-y-6 lg:col-span-2">
            <!-- Informasi Klaim -->
            <div class="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
              <h2 class="flex items-center mb-4 text-lg font-semibold text-gray-900">
                <DocumentTextIcon class="w-5 h-5 mr-2 text-gray-600" />
                Informasi Klaim
              </h2>
              <div class="space-y-4">
                <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <p class="text-sm font-medium text-gray-500">Nomor Klaim</p>
                    <p class="font-mono text-sm text-gray-900">{{ claim.claim_number }}</p>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-500">Claim Payor Number</p>
                    <p class="font-mono text-sm text-gray-900">{{ claim.claim_payor_number }}</p>
                  </div>
                </div>
                
                <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <p class="text-sm font-medium text-gray-500">Tanggal Klaim</p>
                    <p class="text-sm text-gray-900">{{ formatDate(claim.claim_date) }}</p>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-500">Jenis Layanan</p>
                    <p class="text-sm text-gray-900">{{ claim.claim_service_type }}</p>
                  </div>
                </div>

                <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <p class="text-sm font-medium text-gray-500">GC Status</p>
                    <p class="font-mono text-sm text-gray-900">{{ claim.gcclaim_status }}</p>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-500">GC Service Type</p>
                    <p class="font-mono text-sm text-gray-900">{{ claim.gcclaim_service_type }}</p>
                  </div>
                </div>

                <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <p class="text-sm font-medium text-gray-500">Claim Member No</p>
                    <p class="font-mono text-sm text-gray-900">{{ claim.claim_member_no }}</p>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-500">Medical No</p>
                    <p class="font-mono text-sm text-gray-900">{{ claim.medical_no }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Informasi Pasien -->
            <div class="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
              <h2 class="flex items-center mb-4 text-lg font-semibold text-gray-900">
                <UserIcon class="w-5 h-5 mr-2 text-gray-600" />
                Informasi Pasien
              </h2>
              <div class="space-y-4">
                <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <p class="text-sm font-medium text-gray-500">Nama Pasien</p>
                    <p class="text-sm font-medium text-gray-900">{{ claim.patient_name }}</p>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-500">Jenis Kelamin</p>
                    <p class="text-sm text-gray-900">{{ claim.gender }}</p>
                  </div>
                </div>
                
                <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <p class="text-sm font-medium text-gray-500">Patient ID</p>
                    <p class="font-mono text-sm text-gray-900">{{ claim.patient_id }}</p>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-500">GC Gender</p>
                    <p class="font-mono text-sm text-gray-900">{{ claim.gcgender }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Kolom Kanan - Informasi Payor & Sistem -->
          <div class="space-y-6">
            <!-- Informasi Payor -->
            <div class="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
              <h2 class="flex items-center mb-4 text-lg font-semibold text-gray-900">
                <BuildingLibraryIcon class="w-5 h-5 mr-2 text-gray-600" />
                Informasi Payor
              </h2>
              
              <div v-if="payors.length > 0" class="space-y-4">
                <div v-for="payor in payors" :key="payor.id" 
                     class="p-4 border rounded-lg"
                     :class="payor.is_primary ? 'border-blue-300 bg-blue-50' : 'border-gray-200'">
                  
                  <!-- Header Payor -->
                  <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center space-x-2">
                      <CreditCardIcon class="w-4 h-4 text-gray-500" />
                      <span class="text-sm font-medium text-gray-900">{{ payor.payor_name }}</span>
                    </div>
                    <div class="flex space-x-2">
                      <span 
                        v-if="payor.is_primary"
                        class="px-2 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full"
                      >
                        Primary
                      </span>
                      <span 
                        :class="['px-2 py-1 text-xs font-medium rounded-full border', getPayorTypeBadgeClass(payor.payor_type)]"
                      >
                        {{ payor.payor_type }}
                      </span>
                    </div>
                  </div>

                  <!-- Detail Payor -->
                  <div class="space-y-2 text-sm">
                    <div class="grid grid-cols-2 gap-2">
                      <div>
                        <p class="text-gray-500">Payor Code</p>
                        <p class="font-mono text-gray-900">{{ payor.payor_code }}</p>
                      </div>
                      <div>
                        <p class="text-gray-500">Payor ID</p>
                        <p class="font-mono text-gray-900">{{ payor.payor_id }}</p>
                      </div>
                    </div>
                    <div>
                      <p class="text-gray-500">GC Payor Type</p>
                      <p class="font-mono text-gray-900">{{ payor.gc_payor_type }}</p>
                    </div>
                    <div class="grid grid-cols-2 gap-2">
                      <div>
                        <p class="text-gray-500">COB</p>
                        <p class="text-gray-900">{{ payor.is_cob ? 'Ya' : 'Tidak' }}</p>
                      </div>
                      <div>
                        <p class="text-gray-500">Status</p>
                        <p class="text-gray-900">{{ payor.is_primary ? 'Primary' : 'Secondary' }}</p>
                      </div>
                    </div>
                    
                    <!-- Document Stats -->
                    <div class="pt-2 border-t border-gray-200">
                      <div class="flex items-center justify-between">
                        <span class="text-gray-500">Dokumen:</span>
                        <span class="text-sm font-medium text-gray-900">
                          {{ getDocumentStats(payor.id).totalUploaded }}/{{ getDocumentStats(payor.id).totalRequired }}
                        </span>
                      </div>
                      <div class="w-full h-2 mt-1 bg-gray-200 rounded-full">
                        <div 
                          class="h-2 transition-all duration-300 bg-green-600 rounded-full"
                          :style="{ width: `${getDocumentStats(payor.id).progress}%` }"
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div v-else class="py-4 text-center">
                <BuildingLibraryIcon class="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p class="text-sm text-gray-500">Tidak ada data payor</p>
              </div>
            </div>

            <!-- Informasi Sistem -->
            <div class="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
              <h2 class="flex items-center mb-4 text-lg font-semibold text-gray-900">
                <IdentificationIcon class="w-5 h-5 mr-2 text-gray-600" />
                Informasi Sistem
              </h2>
              <div class="space-y-3">
                <div>
                  <p class="text-sm font-medium text-gray-500">Dibuat Oleh</p>
                  <p class="text-sm text-gray-900">User ID: {{ claim.created_by }}</p>
                  <p class="text-xs text-gray-500">{{ formatDateTime(claim.created_at) }}</p>
                </div>
                
                <div>
                  <p class="text-sm font-medium text-gray-500">Diupdate Oleh</p>
                  <p class="text-sm text-gray-900">
                    {{ claim.update_by ? `User ID: ${claim.update_by}` : 'Belum pernah diupdate' }}
                  </p>
                  <p v-if="claim.update_date" class="text-xs text-gray-500">
                    {{ formatDateTime(claim.update_date) }}
                  </p>
                </div>
                
                <div>
                  <p class="text-sm font-medium text-gray-500">ID Record</p>
                  <p class="font-mono text-sm text-gray-900 break-all">{{ claim.id }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Dokumen Persyaratan per Payor -->
        <div v-for="payor in payors" :key="`docs-${payor.id}`" class="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h2 class="flex items-center text-lg font-semibold text-gray-900">
                <DocumentTextIcon class="w-5 h-5 mr-2 text-gray-600" />
                Dokumen Persyaratan - {{ payor.payor_name }}
                <span v-if="payor.is_primary" class="px-2 py-1 ml-2 text-xs font-medium text-blue-800 bg-blue-100 rounded-full">
                  Primary
                </span>
              </h2>
              <p class="mt-1 text-sm text-gray-600">Dokumen yang diperlukan untuk proses klaim {{ payor.payor_name }}</p>
            </div>
            
            <!-- Progress Stats -->
            <div class="text-right">
              <div class="flex items-center space-x-4">
                <div class="text-sm">
                  <p class="text-gray-600">Progress Upload</p>
                  <p class="font-semibold text-gray-900">
                    {{ getDocumentStats(payor.id).totalUploaded }}/{{ getDocumentStats(payor.id).totalRequired }} dokumen
                  </p>
                </div>
                <div class="relative w-16 h-16">
                  <svg class="w-full h-full" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#E5E7EB"
                      stroke-width="3"
                    />
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#10B981"
                      :stroke-width="3"
                      :stroke-dasharray="`${getDocumentStats(payor.id).progress}, 100`"
                    />
                  </svg>
                  <div class="absolute inset-0 flex items-center justify-center">
                    <span class="text-xs font-bold text-gray-700">{{ getDocumentStats(payor.id).progress }}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- List Dokumen -->
          <div class="space-y-3">
            <div v-for="document in getPayorDocuments(payor.id)" :key="document.id" 
                 class="flex items-center justify-between p-4 transition-colors duration-200 border border-gray-200 rounded-lg hover:bg-gray-50">
              
              <div class="flex items-center flex-1 space-x-4">
                <!-- Status Icon -->
                <div v-if="document.uploaded && document.verified" class="p-2 bg-green-100 rounded-lg">
                  <CheckCircleIcon class="w-5 h-5 text-green-600" />
                </div>
                <div v-else-if="document.uploaded && !document.verified" class="p-2 bg-yellow-100 rounded-lg">
                  <DocumentTextIcon class="w-5 h-5 text-yellow-600" />
                </div>
                <div v-else class="p-2 bg-gray-100 rounded-lg">
                  <DocumentTextIcon class="w-5 h-5 text-gray-400" />
                </div>

                <!-- Document Info -->
                <div class="flex-1">
                  <div class="flex items-center space-x-2">
                    <p class="text-sm font-medium text-gray-900">{{ document.filename }}</p>
                    <span v-if="document.required" class="px-2 py-1 text-xs font-medium text-red-800 bg-red-100 rounded-full">
                      Wajib
                    </span>
                    <span v-else class="px-2 py-1 text-xs font-medium text-gray-800 bg-gray-100 rounded-full">
                      Opsional
                    </span>
                  </div>
                  <p class="text-sm text-gray-600">{{ document.document_type }}</p>
                  <div class="flex items-center mt-1 space-x-4 text-xs text-gray-500">
                    <span v-if="document.uploaded && document.upload_date">
                      Diupload: {{ formatDateTime(document.upload_date) }}
                    </span>
                    <span v-if="document.file_size">
                      Size: {{ document.file_size }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex items-center space-x-2">
                <button 
                  v-if="document.uploaded"
                  @click="downloadDocument(payor.id, document)"
                  class="p-2 text-gray-400 transition-colors duration-200 rounded-lg hover:text-blue-600 hover:bg-blue-50"
                  title="Download dokumen"
                >
                  <DocumentArrowDownIcon class="w-4 h-4" />
                </button>
                
                <button 
                  v-if="document.uploaded && !document.verified"
                  @click="verifyDocument(payor.id, document.id)"
                  class="px-3 py-1 text-sm text-white transition-colors duration-200 bg-green-600 rounded-lg hover:bg-green-700"
                >
                  Verifikasi
                </button>
                
                <button 
                  v-else-if="!document.uploaded"
                  @click="uploadDocument(payor.id, document.document_type)"
                  :disabled="uploading === payor.id"
                  class="flex items-center px-3 py-1 space-x-1 text-sm text-white transition-colors duration-200 bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <DocumentPlusIcon class="w-4 h-4" />
                  <span>Upload</span>
                </button>

                <div v-if="document.verified" class="flex items-center space-x-1 text-green-600">
                  <CheckCircleIcon class="w-4 h-4" />
                  <span class="text-xs font-medium">Terverifikasi</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State untuk Dokumen -->
          <div v-if="getPayorDocuments(payor.id).length === 0" class="py-8 text-center">
            <DocumentTextIcon class="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p class="text-gray-500">Belum ada dokumen yang diupload untuk payor ini</p>
            <button 
              @click="uploadDocument(payor.id, 'document')"
              class="flex items-center px-4 py-2 mx-auto mt-3 space-x-2 text-white transition-colors duration-200 bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              <DocumentPlusIcon class="w-4 h-4" />
              <span>Upload Dokumen Pertama</span>
            </button>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
          <div class="flex flex-wrap gap-3">
            <button class="px-4 py-2 text-white transition-colors duration-200 bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              Edit Klaim
            </button>
            <button class="px-4 py-2 text-white transition-colors duration-200 bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
              Validasi Semua
            </button>
            <button class="px-4 py-2 text-white transition-colors duration-200 bg-purple-600 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
              Kelola Payor
            </button>
            <button class="px-4 py-2 text-white transition-colors duration-200 bg-gray-600 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
              Print
            </button>
            <button class="px-4 py-2 text-white transition-colors duration-200 bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
              Hapus
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="py-12 text-center">
        <DocumentTextIcon class="w-16 h-16 mx-auto mb-4 text-gray-300" />
        <p class="text-lg text-gray-500">Data klaim tidak ditemukan</p>
      </div>
    
</AdminLayout>
</template>