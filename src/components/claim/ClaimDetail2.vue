<script setup lang="ts">
import { ref, watch } from 'vue'
import api from '@/services/api'
import { BackspaceIcon, ArrowLeftIcon } from "@heroicons/vue/24/outline"
import ClaimCard from '@/components/claim/ClaimCard.vue';
import InfoField from '@/components/claim/InfoField.vue';
import axios from 'axios';

const props = defineProps<{ claimId: string | null }>()
const emit = defineEmits(['back'])

const claim = ref<any | null>(null)
  const downloadFile = (url: string, filename: string) => {
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  link.target = "_blank"
  link.click()
}
const merging = ref(false)

const downloadDocument = (document: any) => {
  if (!document.id) {
    alert("Document ID tidak tersedia")
    return
  } 
  const fileUrl = `http://127.0.0.1:8000/api/v1/claim/document/${document.id}/download`
  window.open(fileUrl, "_blank")
}
const mergeDocuments = async () => {
  if (!claim.value) return
  try {
    merging.value = true
    const resp = await axios.post(
      `http://127.0.0.1:8000/api/v1/claim/${claim.value.id}/merge-pdf`
    )
    if (resp.data.success) {
      alert("Dokumen berhasil digabung")
      const mergedFilePath = resp.data.data?.merged_file_path
      const mergedDocId = resp.data.data?.document_id
       // Pastikan props.claimId tidak null
      if (props.claimId) {
        const id: string = props.claimId
        await fetchClaimData(id)
      } else {
        claim.value = null
      }
      if (mergedFilePath) {
        const fileUrl =`http://127.0.0.1:8000/api/v1/claim/document/${mergedDocId}/download`
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
async  function  fetchClaimData (id : string ) {
  try {
        const resp = await api.get(`/claim/document/${id}`)
        // data JSON: { success, message, data }
        claim.value = resp.data.data
      } catch (e) {
        console.error('Gagal ambil detail klaim:', e)
      }
    }

watch(
  () => props.claimId,
  async (id) => {
    if (id) {
      fetchClaimData(id)
    }
    }, 
    { immediate: true })

</script>

<template>
  <div v-if="claim" class="space-y-6">
    <!-- Back -->
    <div>
      <button @click="$emit('back')" class="text-sm text-blue-600">
        <div class="flex items-center space-x-3">
                    <ArrowLeftIcon class="w-5 h-5 text-blue-600" />
                    <p class="text-sm text-gray-700 capitalize"> Kembali ke Dashboard</p>
                  </div>
   
      </button>
    </div>
    <ClaimCard title="📂 Detail Klaim">

      <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
        <InfoField label="No" :value="claim.claim_number" />
        <InfoField label="No. SEP" :value="claim.sep_number" />
        <InfoField label="Pasien" :value="claim.sep_info?.data?.response?.peserta?.nama" />
        <InfoField label="Tanggal SEP" :value="claim.sep_info?.data?.response?.tglSep" />
        <InfoField label="Diagnosis" :value="claim.sep_info?.data?.response?.diagnosa" />
        <InfoField  label="Status" :value="claim.claim_status" />
      </div>
      <div class="row">
        <div class="col-md-12">
<!-- Dokumen -->
<h3 class="mt-6 mb-2 font-medium">📑 Dokumen</h3>
      <ul v-if="claim.documents?.length" class="text-sm divide-y">
        <li
          v-for="doc in claim.documents"
          :key="doc.id"
          class="flex items-center justify-between py-2"
        >
          <span>
            ✔ {{ doc.filename }}
            <span class="ml-2 text-xs text-gray-500">({{ doc.document_type }})</span>
          </span>
          <button
                    @click="downloadDocument(doc)"
                    class="text-sm font-medium text-blue-600 hover:text-blue-800"
                  >
                    Download
                  </button>
       
        </li>
      </ul>
      <p v-else class="text-sm text-gray-400">Belum ada dokumen terunggah</p>

      <!-- Actions -->
      <div class="flex mt-4 space-x-3">
        <button class="px-4 py-2 text-white bg-blue-600 rounded" @click="mergeDocuments()"> Merge Dokumen</button>
        <button class="px-4 py-2 text-white bg-green-600 rounded">Validasi</button>
      </div>
        </div>
      </div>
    </ClaimCard>
  </div>

  <div v-else class="text-gray-500">Memuat detail klaim...</div>
</template>
