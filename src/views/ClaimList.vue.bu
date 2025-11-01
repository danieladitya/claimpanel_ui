<script setup lang="ts">
import { ref } from 'vue'
import AdminLayout from '@/layouts/AdminLayout.vue'
import ClaimFilter from '@/components/claim/ClaimFilter.vue'
import ClaimTable from '@/components/claim/ClaimTable.vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import IFileItem from '@/interface/File'
import IClaim from '@/interface/Iclaim'
import axios from 'axios'

// States
const isModalOpen = ref(false)
const allClaims = ref<IClaim[]>([])
const filteredClaims = ref<IClaim[]>([])
const isLoading = ref(false)
const files = ref<IFileItem[]>([])
const fileType = ref<string>('')
const selectedClaimId = ref<string>('') // claim yang dipilih
const fileInput = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)
const uploadProgress = ref<number>(0)

// Ambil data klaim
fetchClaims()
async function fetchClaims() {
  isLoading.value = true
  try {
    const { data } = await axios.get('http://127.0.0.1:8000/api/v1/claims')
    allClaims.value = data
    filteredClaims.value = [...allClaims.value]
  } catch (error) {
    console.error('Error fetching claims:', error)
    alert('Gagal mengambil data klaim')
  } finally {
    isLoading.value = false
  }
}

// Filter klaim
function updateFilter(filter: { search: string; status: string }) {
  filteredClaims.value = allClaims.value.filter((claim) => {
    const matchSearch =
      !filter.search ||
      claim.claim_number.toLowerCase().includes(filter.search.toLowerCase()) ||
      claim.sep_number.toLowerCase().includes(filter.search.toLowerCase()) ||
      (claim.sep_info?.fullname?.toLowerCase().includes(filter.search.toLowerCase()) || false)

    const matchStatus = !filter.status || claim.claim_status === filter.status
    return matchSearch && matchStatus
  })
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
      files.value.push({ file: f, name: f.name, type: fileType.value })
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
      files.value.push({ file: f, name: f.name, type: fileType.value })
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

  const formData = new FormData()
  files.value.forEach((fileItem) => {
    formData.append('files', fileItem.file)
  })
  // formData.append('file_type', fileType.value)

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
    console.log('Upload successful:', resp.data)
    alert('Klaim baru berhasil dibuat')
    handleModalClose()
  } catch (error) {
    console.error('Upload error:', error)
    alert('Upload gagal')
  } finally {
    uploadProgress.value = 0
    files.value = []
  }
}
// Tutup modal
function handleModalClose() {
  isModalOpen.value = false
  files.value = []
  fileType.value = ''
  selectedClaimId.value = ''
  uploadProgress.value = 0
  fetchClaims()
}
</script>

<template>
  <AdminLayout>
    <div class="p-6 space-y-6">
      <h1 class="text-2xl font-bold text-gray-900">Daftar Klaim</h1>

      <button
        @click="isModalOpen = true"
        class="px-4 py-2 text-white bg-blue-600 rounded-lg shadow hover:bg-blue-700"
      >
        + Klaim Baru
      </button>

      <ClaimFilter @update:filter="updateFilter" />
      <ClaimTable :claims="filteredClaims" />
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
      <h3 class="font-semibold text-gray-700 ">Upload Dokumen Klaim Baru</h3>
      <small class="mb-3 text-gray-400">untuk klaim baru wajib menyertakan surat elegibitas peserta</small>
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
