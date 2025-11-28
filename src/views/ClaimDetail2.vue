
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
                  <!-- <div>
                    <p class="text-sm font-medium text-gray-500">Status</p>
                    <p class="text-sm font-medium text-gray-900">{{ claim.claim_status }}</p>
                  </div> -->
                  <!-- <div>
                    <p class="text-sm font-medium text-gray-500">Service Type</p>
                    <p class="font-mono text-sm text-gray-900">{{ claim.claim_service_type }}</p>
                  </div> -->
                  
                </div>
 
              </div>
            </div>
          </div>

          <!-- Kolom Kanan - Informasi Payor & Sistem -->
          <div class="space-y-6">
            <!-- Informasi Payor -->
            <div class="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
              <h2 class="flex items-center mb-4 text-lg font-semibold text-gray-900">
                <UserIcon class="w-5 h-5 mr-2 text-gray-600" />
                Informasi Pasien
              </h2>
              <div class="space-y-4">
                <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <p class="text-sm font-medium text-gray-500">Medical No</p>
                    <p class="font-mono text-sm text-gray-900">{{ claim.medical_no }}</p>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-500">Member No</p>
                    <p class="font-mono text-sm text-gray-900">{{ claim.claim_member_no }}</p>
                  </div>
                  
                  </div>
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
              </div>
              
                
            </div>
 
          </div>
        </div>
        <div class="row">
              <div class="col-md-12">
                
                <table class="table table-compact">
                  <thead>
                      <tr>
                        <th>Tipe Penjamin</th>
                        <th>Penjamin</th>
                        <th>Primary</th>
                        <th>Status Kelengkapan</th>
                        <th></th>
                      </tr>
                  </thead>
                  <tbody>
                      <tr v-for="payor in payors" :key="payor.id" >
                        <td>  {{ payor.payor_type }}</td>
                          <td>   {{ payor.payor_name }}
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
                          </td>
                       
                          <td> <span 
                              v-if="payor.is_primary"
                              class="px-2 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full"
                            >
                              Primary
                            </span>
                          </td>
                          <td>
                            <span :class="['status', payor.gc_validate_status == 'X005^003' ? 'inactive' : 'active']">
                             {{  payor.validate_status }}
                   
                    </span>

                            
                          </td>
                          <td>
                            <button @click="GetValidation(payor.id)" class="icon-bg-success">    
                              <CheckIcon class="w-4 h-4" />
                            </button> &nbsp;
                            &nbsp;
                            <button v-if="payor.gc_validate_status == 'X005^005' " @click="handleMergeDocuments(payor.id)" class="icon-bg-success">Merge Document</button>
                          </td>
                      </tr>
                  </tbody>
               </table>
               
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
            <div>
              <button
            @click="FormUpload(payor.id)"
            class="flex items-center btn btn-primary"
        
          >
          <DocumentArrowDownIcon class="w-4 h-4" /> Upload Dokumen
          </button>
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
                     <p class="text-sm font-medium text-gray-900">{{ document.document_name }}</p>
                    <button class="btn-icon" @click="downloadDocument(document)"><ArrowDownTrayIcon class="w-5 h-5 text-blue-500" /></button>
                    
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
            </div>
          </div>

          <!-- Empty State untuk Dokumen -->
          <div v-if="getPayorDocuments(payor.id).length === 0" class="py-8 text-center">
            <DocumentTextIcon class="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p class="text-gray-500">Belum ada dokumen yang diupload untuk payor ini</p>
           
          </div>
        </div>
 
      </div>

      <!-- Empty State -->
      <div v-else class="py-12 text-center">
        <DocumentTextIcon class="w-16 h-16 mx-auto mb-4 text-gray-300" />
        <p class="text-lg text-gray-500">Data klaim tidak ditemukan</p>
      </div>
      
      <!-- Modal Upload Klaim Baru -->
<BaseModal
  :isOpen="isModalUploadOpen"
  title="Tambah Dokumen Klaim Baru"
  :fullscreen="false"
  @close="handleModalUploadClose"
>
  <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
    <!-- Daftar file -->
    <div class="col-span-1 p-4 bg-white rounded-lg shadow">
      <h3 class="mb-3 font-semibold text-gray-700">Daftar File</h3>
      <ul v-if="files.length > 0" class="space-y-2">
        <li
          v-for="(file, index) in files"
          :key="index"
          class="flex items-center justify-between p-2 bg-gray-100 rounded-lg"
        >
          <span class="text-sm text-gray-800 truncate">{{ file.name }}</span>
          <button
            @click="removeFile(index)"
            class="text-sm text-red-500 hover:text-red-700"
          >
            ✕
          </button>
        </li>
      </ul>
      <p v-else class="text-sm text-gray-400">Belum ada file yang diunggah</p>
    </div>

    <!-- Upload -->
    <div class="col-span-2 p-4 space-y-4 bg-white rounded-lg shadow">
      <h3 class="mb-3 font-semibold text-gray-700">Upload Dokumen Klaim Baru</h3>
 

      <!-- Dropzone -->
      <div
        class="w-full p-6 text-center border-2 border-dashed rounded-lg cursor-pointer"
        :class="isDragging ? 'border-blue-400 bg-blue-50' : 'border-gray-300'"
        @dragover.prevent="isDragging = true"
        @dragleave.prevent="isDragging = false"
        @drop="handleDrop"
        @click="fileInput?.click()"
      >
        <p class="text-gray-500">Tarik & letakkan file di sini, atau klik untuk memilih</p>
        <input ref="fileInput" type="file" multiple class="hidden" @change="handleFileSelect" />
      </div>

      <!-- Progress bar -->
      <div v-if="uploadProgress > 0" class="w-full h-2 bg-gray-200 rounded-full">
        <div
          class="h-2 transition-all bg-blue-500 rounded-full"
          :style="{ width: uploadProgress + '%' }"
        ></div>
      </div>
    </div>
  </div>
</BaseModal>

  <!-- HASIL VALIDASI -->
  <BaseModal
  :isOpen="isModalOpen"
  title="Hasil Validasi Dokumen"
  :fullscreen="false"
  @close="handleModalClose"
  >
  <div >
 

<!-- Summary -->
<div class="grid grid-cols-1 gap-4 mb-6 md:grid-cols-3">
    <div class="p-4 border rounded-lg bg-gray-50">
        <p class="text-sm text-gray-500">Dokumen Hilang</p>
        <p class="text-2xl font-bold text-red-600">{{ validationClaimData?.missing_count }} Dokumen</p>
    </div>

    <div class="p-4 border rounded-lg bg-gray-50">
        <p class="text-sm text-gray-500">Validasi Aturan</p>
        <p class="text-2xl font-bold text-green-600">✔ Lolos</p>
    </div>

    <div class="p-4 border rounded-lg bg-gray-50">
        <p class="text-sm text-gray-500">Status Klaim</p>
        <p class="text-2xl font-bold text-red-600">
      
          {{ validationClaimData?.flag_document_success == 1 ? 'COMPLATE' : 'INCOMPLATE' }}
          </p>
    </div>
</div>

<!-- Missing Documents -->
<div class="mb-6" v-if="validationClaimData?.flag_document_success == 0">
    <h3 class="mb-2 font-semibold text-gray-700">Dokumen Belum Lengkap</h3>
    <div class="space-y-3" v-for="doc in validationClaimData?.document_validation">
        <div class="flex items-center justify-between p-3 m-2 border rounded-lg bg-red-50">
            <span class="font-medium">{{ doc.document_name }}</span>
            <span class="px-3 py-1 text-xs text-white bg-red-500 rounded-full">{{ doc.status }}</span>
        </div>

        
    </div>
</div>

<!-- Actions Needed -->
<div v-if="validationClaimData?.flag_document_success == 0">
    <h3 class="mb-2 font-semibold text-gray-700" >Langkah yang Harus Dilakukan</h3>

    <ul class="pl-5 space-y-1 text-gray-700 list-disc"  v-for="doc in validationClaimData?.actions_needed">
        <li>Upload dokumen: <strong>{{ doc }}</strong></li>
      
    </ul>
</div>
</div>
</BaseModal>
</AdminLayout>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue';
import api from '@/services/api'
import { useRoute } from 'vue-router';
import AdminLayout from '@/layouts/AdminLayout.vue';
import BaseModal from '@/components/ui/BaseModal.vue';;
import IFileItem from '@/interface/File';
import axios from 'axios';
import { useValidationClaim } from '../composables/useValidationClaim';
import { CheckIcon, ArrowDownTrayIcon } from '@heroicons/vue/24/outline';
import { async } from '../services/validationClaim.service';

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
const route = useRoute()


const isModalOpen = ref(false) 
function handleModalClose() {
  isModalOpen.value = false
  const claimId = route.params.id

  fetchClaimData(claimId)

}

const {
  validationClaimData,
  mergeDocumentData,
   error,
  getValidation,
  processMergeDocument,
  downloadMergedDocument,
  reset
} = useValidationClaim();


async function GetValidation(id: string) {
    getValidation(id)
    isModalOpen.value = true

   
}
const handleMergeDocuments = async (id: string) => {

  await processMergeDocument(id);
};

/*UPLOAD MODAL*/
const isModalUploadOpen = ref(false)
const files = ref<IFileItem[]>([]) 
const fileInput = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)
const uploadProgress = ref<number>(0)
const claim_payor_id = ref<string | null>(null)
// Tutup modal
function handleModalUploadClose() {
  isModalUploadOpen.value = false
  files.value = [] 
  uploadProgress.value = 0
   
}

// Pilih file (manual)
function handleFileSelect(event: Event) {
  
  const target = event.target as HTMLInputElement
  // if (!fileType.value || !selectedClaimId.value) {
  //   alert('Pilih klaim dan jenis file dulu')
  //   return
  // }
  if (target.files && target.files.length > 0) {
    for (let i = 0; i < target.files.length; i++) {
      const f = target.files[i]
      files.value.push({ file: f, name: f.name})
    }
    uploadFiles()
  }
}
// Drag & drop
function handleDrop(e: DragEvent) {
  e.preventDefault()
  isDragging.value = false
  // if (!fileType.value || !selectedClaimId.value) {
  //   alert('Pilih klaim dan jenis file dulu')
  //   return
  // }
  if (e.dataTransfer?.files?.length) {
    for (let i = 0; i < e.dataTransfer.files.length; i++) {
      const f = e.dataTransfer.files[i]
      files.value.push({ file: f, name: f.name})
    }
    uploadFiles()
  }
}

// Hapus file dari list
function removeFile(index: number) {
  files.value.splice(index, 1)
}
function  FormUpload(id : string) {
  isModalUploadOpen.value = true
  claim_payor_id.value = id
}
// Upload
async function uploadFiles() {
  if (files.value.length === 0) {
    alert('Tidak ada file untuk diunggah')
    return
  }

  const claimId = route.params.id
  const formData = new FormData()

  // Tambah ID klaim sekali saja
  formData.append('id_claim', String(claimId))

  // Tambah semua file
  files.value.forEach((fileItem) => {
    formData.append('files', fileItem.file)
  })

  try {
    const resp = await api.post(`/claim/payor/${claim_payor_id.value}/upload`, formData, {
      headers: { 
        'Content-Type': 'multipart/form-data' // Ini akan dipertahankan
      },
      onUploadProgress: (e) => {
        if (e.total) {
          uploadProgress.value = Math.round((e.loaded * 100) / e.total)
        }
      }, 
      timeout: 30000 // 30 detik timeout
    }); 
    if (resp.data.success) {
       
      alert('Dokumen berhasil diunggah')
      // refresh klaim supaya dokumen baru langsung muncul
      const claimId = route.params.id
     await fetchClaimData(claimId)
      handleModalUploadClose()
    } else {
      alert('Upload gagal: ' + (resp.data.message || 'Unknown error'))
    }

  } catch (error: any) {
    console.error('Upload error:', error)
    alert('Upload gagal: ' + (error.response?.data?.message || error.message))
  } finally {
    uploadProgress.value = 0
    files.value = []
  }
}



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
// Download document
const downloadDocument = async (document: any) => {
  try {
    if (document.file_path && document.file_path !== '') {
      const fileUrl = `http://127.0.0.1:8000/api/v1/claim/document/${document.id}`;
      
      // Untuk download
      window.open(fileUrl, '_blank');
      
      // Atau untuk preview di tab baru
      // const previewUrl = `http://127.0.0.1:8000/api/v1/claim/document/${document.id}/preview`;
      // window.open(previewUrl, '_blank');
    } else {
      alert('Dokumen belum tersedia untuk di-download');
    }
  } catch (error) {
    console.error('Download error:', error);
    alert('Gagal mendownload dokumen');
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
