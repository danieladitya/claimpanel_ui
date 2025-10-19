<template>
  <AdminLayout>
    <div class="min-h-screen py-10 bg-gray-50">
      <div class="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        
        <!-- Header -->
        <header class="pb-6 mb-10 border-b">
          <h1 class="text-3xl font-bold text-gray-900">Klaim</h1>
          <p class="mt-2 text-gray-600">Informasi lengkap mengenai klaim pasien</p>
        </header>

        <!-- Action Bar -->
        <div class="flex items-center justify-between mb-8">
          <div v-if="claimData" :class="statusBadgeClass" 
               class="inline-flex items-center px-4 py-2 text-sm font-medium rounded-full shadow-sm">
            <span class="w-2 h-2 mr-2 rounded-full"></span>
            {{ claimData.claim_status.toUpperCase() }}
          </div>
          <button
            @click="isModalOpen = true"
            class="px-4 py-2 text-white transition bg-blue-600 rounded-lg shadow hover:bg-blue-700"
          >
            + Dokumen
          </button>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex items-center justify-center py-20">
          <div class="w-12 h-12 border-b-2 border-blue-600 rounded-full animate-spin"></div>
        </div>

        <!-- Error State -->
        <div v-if="error" class="p-4 mb-6 border border-red-200 rounded-lg shadow-sm bg-red-50">
          <div class="flex items-center">
            <ExclamationTriangleIcon class="w-5 h-5 mr-2 text-red-400" />
            <span class="text-red-800">{{ error }}</span>
          </div>
        </div>

        <!-- Main Content -->
        <div v-if="claimData" class="grid grid-cols-1 gap-8 lg:grid-cols-3">
          
          <!-- Left Column -->
          <div class="space-y-8 lg:col-span-2">
            
            <!-- Basic Claim Info -->
            <ClaimCard title="Informasi Klaim">
              <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                <InfoField label="Nomor Claim" :value="claimData.claim_number" />
                <InfoField label="Nomor SEP" :value="claimData.sep_number" />
                <InfoField label="Status Claim" :value="claimData.claim_status" />
                <InfoField label="Status File" :value="claimData.claim_file_status" />
                <InfoField label="Tanggal Dibuat" :value="formatDate(claimData.created_at)" />
                <InfoField label="Terakhir Diupdate" :value="formatDate(claimData.update_date)" />
              </div>
            </ClaimCard>

            <!-- SEP Info -->
            <ClaimCard v-if="claimData.sep_info" title="Informasi SEP">
              <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                <InfoField label="No. SEP" :value="claimData.sep_info.data?.response?.noSep" />
                <InfoField label="Tanggal SEP" :value="formatDate(claimData.sep_info.data?.response?.tglSep)" />
                <InfoField label="Jenis Pelayanan" :value="claimData.sep_info.data?.response?.jnsPelayanan" />
                <InfoField label="Kelas Rawat" :value="claimData.sep_info.data?.response?.kelasRawat" />
                <InfoField label="Diagnosa" :value="claimData.sep_info.data?.response?.diagnosa" />
                <InfoField label="Catatan" :value="claimData.sep_info.data?.response?.catatan" />
                <InfoField label="Poli" :value="claimData.sep_info.data?.response?.poli" />
                <InfoField label="Tujuan Kunjungan" :value="claimData.sep_info.data?.response?.tujuanKunj?.nama" />
              </div>
            </ClaimCard>

            <!-- Patient Info -->
            <ClaimCard v-if="claimData.sep_info?.data?.response?.peserta" title="Informasi Pasien">
              <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                <InfoField label="Nama Pasien" :value="claimData.sep_info.data.response.peserta.nama" />
                <InfoField label="No. Kartu" :value="claimData.sep_info.data.response.peserta.noKartu" />
                <InfoField label="No. MR" :value="claimData.sep_info.data.response.peserta.noMr" />
                <InfoField label="Jenis Kelamin" :value="getGenderText(claimData.sep_info.data.response.peserta.kelamin)" />
                <InfoField label="Tanggal Lahir" :value="formatDate(claimData.sep_info.data.response.peserta.tglLahir)" />
                <InfoField label="Jenis Peserta" :value="claimData.sep_info.data.response.peserta.jnsPeserta" />
                <InfoField label="Hak Kelas" :value="claimData.sep_info.data.response.peserta.hakKelas" />
              </div>
            </ClaimCard>
          </div>

          <!-- Right Column -->
          <div class="space-y-8">
            
            <!-- Documents -->
            <ClaimCard title="Dokumen">
              <template #action>
                <button
                  @click="mergeDocuments"
                  class="px-3 py-1 text-sm text-white transition bg-blue-600 rounded hover:bg-blue-700"
                  :disabled="merging"
                >
                  <span v-if="!merging">Merge Dokumen</span>
                  <span v-else>Merging...</span>
                </button>
              </template>

              <div class="space-y-3">
                <div
                  v-for="document in claimData.documents"
                  :key="document.id"
                  class="flex items-center justify-between p-3 transition bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  <div class="flex items-center space-x-3">
                    <DocumentIcon class="w-5 h-5 text-gray-400" />
                    <p class="text-sm text-gray-700 capitalize">{{ document.document_type }}</p>
                  </div>
                  <button
                    @click="downloadDocument(document)"
                    class="text-sm font-medium text-blue-600 hover:text-blue-800"
                  >
                    Download
                  </button>
                </div>

                <p v-if="claimData.documents.length === 0" class="py-4 text-sm text-center text-gray-500">
                  Tidak ada dokumen
                </p>
              </div>
            </ClaimCard>

            <!-- Status -->
            <ClaimCard title="Status">
              <div class="space-y-3">
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600">File Status:</span>
                  <span :class="fileStatusClass" class="text-sm font-medium capitalize">
                    {{ claimData.claim_file_status }}
                  </span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600">Validation:</span>
                  <span class="text-sm text-gray-900">
                    {{ claimData.validation_file_result ? 'Completed' : 'Pending' }}
                  </span>
                </div>
              </div>
            </ClaimCard>
          </div>
        </div>
      </div>
    </div>
        <!-- Modal Upload -->
    <!-- Modal Upload Klaim Baru -->
<BaseModal
  :isOpen="isModalOpen"
  title="Tambah Klaim Baru"
  :fullscreen="false"
  @close="handleModalClose"
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

      <!-- Jenis file -->
      <!-- <div>
        <label class="block mb-1 text-sm font-medium text-gray-700">Jenis Dokumen</label>
        <select v-model="fileType" class="w-full p-2 border rounded-lg">
          <option disabled value="">Pilih jenis file</option>
          <option value="eligibilitas">Surat Eligibilitas Peserta (SEP)</option>
          <option value="resume_medis">Resume Medis</option>
          <option value="hasil_lab">Hasil Lab</option>
          <option value="billing">Billing</option>
        </select>
      </div> -->

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

  </AdminLayout>
</template>


<script setup lang="ts">
import { ref, onMounted, computed } from "vue"
import { useRoute } from "vue-router"
import { DocumentIcon, ExclamationTriangleIcon } from "@heroicons/vue/24/outline"
import axios from "axios"
 // Components
import AdminLayout from "@/layouts/AdminLayout.vue"
import InfoField from "@/components/claim/InfoField.vue"
import ClaimCard from "@/components/claim/ClaimCard.vue"
import IFileItem from '@/interface/File';
import BaseModal from '@/components/ui/BaseModal.vue';
 
const route = useRoute()
const claimData = ref<any>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const merging = ref(false)


const isModalOpen = ref(false) 
const files = ref<IFileItem[]>([]) 
const fileInput = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)
const uploadProgress = ref<number>(0)

// ======= UI Helpers =======
const statusBadgeClass = computed(() => {
  const status = claimData.value?.claim_status
  switch (status) {
    case "draft": return "bg-yellow-100 text-yellow-800"
    case "submitted": return "bg-blue-100 text-blue-800"
    case "approved": return "bg-green-100 text-green-800"
    case "rejected": return "bg-red-100 text-red-800"
    default: return "bg-gray-100 text-gray-800"
  }
})

const fileStatusClass = computed(() => {
  const status = claimData.value?.claim_file_status
  switch (status) {
    case "uploaded": return "text-green-600"
    case "processing": return "text-yellow-600"
    case "failed": return "text-red-600"
    default: return "text-gray-600"
  }
})

const formatDate = (dateString: string) => {
  if (!dateString) return "-"
  return new Date(dateString).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

const getGenderText = (genderCode: string) => {
  return genderCode === "P" ? "Perempuan" : genderCode === "L" ? "Laki-laki" : "-"
}

// ======= API Helpers =======
const fetchClaimData = async () => {
  try {
    loading.value = true
    const claimId = route.params.id
    const response = await fetch(`http://127.0.0.1:8000/api/v1/claim/document/${claimId}`)
    const result = await response.json()
    if (result.success) {
      claimData.value = result.data
    } else {
      throw new Error(result.message || "Failed to fetch claim data")
    }
  } catch (err: any) {
    error.value = err.message
    console.error("Error fetching claim:", err)
  } finally {
    loading.value = false
  }
}

const downloadFile = (url: string, filename: string) => {
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  link.target = "_blank"
  link.click()
}
const downloadDocument = (document: any) => {
  if (!document.id) {
    alert("Document ID tidak tersedia")
    return
  }
  const fileUrl = `http://127.0.0.1:8000/api/v1/claim/document/${document.id}/download`
  window.open(fileUrl, "_blank")
}
const mergeDocuments = async () => {
  if (!claimData.value) return
  try {
    merging.value = true
    const resp = await axios.post(
      `http://127.0.0.1:8000/api/v1/claim/${claimData.value.id}/merge-pdf`
    )
    if (resp.data.success) {
      alert("Dokumen berhasil digabung")
      const mergedFilePath = resp.data.data?.merged_file_path
      const mergedDocId = resp.data.data?.document_id
      await fetchClaimData()
      if (mergedFilePath) {
        const fileUrl = `http://127.0.0.1:8000/${mergedFilePath}`
        downloadFile(fileUrl, `merged_${mergedDocId}.pdf`)
      }
    } else {
      alert("Gagal merge dokumen: " + (resp.data.message || "Unknown error"))
    }
  } catch (err: any) {
    console.error("Error merging documents:", err)
    alert("Terjadi kesalahan saat merge dokumen")
  } finally {
    merging.value = false
  }
}

// ======= Lifecycle =======
onMounted(() => {
  fetchClaimData()
})


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
    const resp = await axios.post(
      'http://127.0.0.1:8000/api/v1/claim/bpjs/upload/bulk',
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => {
          if (e.total) {
            uploadProgress.value = Math.round((e.loaded * 100) / e.total)
          }
        }
      }
    )

    if (resp.data.success) {
      console.log('Upload successful:', resp.data)
      alert('Dokumen berhasil diunggah')
      // refresh klaim supaya dokumen baru langsung muncul
      await fetchClaimData()
      handleModalClose()
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

// Tutup modal
function handleModalClose() {
  isModalOpen.value = false
  files.value = [] 
  uploadProgress.value = 0
   
}

</script>
