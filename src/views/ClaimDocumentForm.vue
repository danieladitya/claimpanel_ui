<template>
  <AdminLayout>
  <div class="max-w-4xl p-6 mx-auto bg-white rounded-lg shadow-lg">
    <h1 class="mb-6 text-2xl font-bold text-gray-800">Dokumen Merge Siap Download</h1>

    <!-- ================= FORM ================= -->
    <form @submit.prevent="fetchClaimDocuments" class="space-y-6">
      <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
        
        <!-- Bulan -->
        <div>
          <label class="block mb-1 text-sm font-medium">Bulan <span class="text-red-500">*</span></label>
          <!-- <input
            v-model="filters.month"
            type="month"
            required
            :max="maxMonth"
            class="w-full px-4 py-2 border rounded-lg focus:ring-blue-500"
          /> -->
          <select
            v-model="filters.month"
            required
            class="w-full px-4 py-2 border rounded-lg focus:ring-blue-500"
          >
            <option value="">Pilih Bulan</option>

            <option
              v-for="m in monthOptions"
              :key="m.value"
              :value="m.value"
            >
              {{ m.label }}
            </option>
          </select>
        </div>

        <!-- Payor -->
        <div>
          <label class="block mb-1 text-sm font-medium">Payor <span class="text-red-500">*</span></label>
          <select
            v-model="filters.payorCode"
            required
            class="w-full px-4 py-2 border rounded-lg focus:ring-blue-500"
          >
            <option value="">Pilih Payor</option>
            <option v-for="p in payors" :key="p.id" :value="p.payor_code">
              {{ p.payor_name }} ({{ p.payor_code }})
            </option>
          </select>
        </div>
      </div>

      <!-- Buttons -->
      <div class="flex space-x-4">
        <button
          type="submit"
          :disabled="loading"
          class="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          <span v-if="loading" class="mr-2 animate-spin">⟳</span>
          {{ loading ? "Memuat..." : "Ambil Dokumen" }}
        </button>

        <button
          type="button"
          :disabled="loading"
          @click="resetForm"
          class="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          Reset
        </button>
      </div>
    </form>

    <!-- ================= LOADING ================= -->
    <div v-if="loading" class="mt-8 text-center">
      <div class="w-8 h-8 mx-auto border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
      <p class="mt-2 text-gray-600">Memuat data...</p>
    </div>

    <!-- ================= ERROR ================= -->
    <div v-if="error" class="p-4 mt-6 text-red-700 border border-red-200 rounded-lg bg-red-50">
      {{ error }}
    </div>

    <!-- ================= HAS RESULTS ================= -->
    <div v-if="!loading && claimDocuments.length > 0" class="mt-8">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold text-gray-800">
          Ditemukan {{ claimDocuments.length }} dokumen
        </h2>

        <button
          @click="downloadAll"
          :disabled="downloading"
          class="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
          <span v-if="downloading" class="mr-2 animate-spin">⟳</span>
          {{ downloading ? "Mengunduh..." : "Unduh Semua" }}
        </button>
      </div>

      <!-- TABLE -->
      <div class="overflow-x-auto border rounded-lg">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="text-xs font-medium text-gray-500 uppercase bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left">No. Klaim</th>
              <th class="px-6 py-3 text-left">No Payor</th>
              <th class="px-6 py-3 text-left">Tanggal</th>
              <th class="px-6 py-3 text-left">File</th>
              <th class="px-6 py-3 text-left">Aksi</th>
            </tr>
          </thead>

          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="doc in claimDocuments" :key="doc.id">
              <td class="px-6 py-4">{{ doc.claim_number }}</td>
              <td class="px-6 py-4">{{ doc.claim_payor_number }}</td>
              <td class="px-6 py-4">{{ formatDate(doc.claim_date) }}</td>
              <td class="px-6 py-4">
                <span class="px-2 py-1 text-xs text-blue-800 bg-blue-100 rounded">
                  {{ getFileExtension(doc.filename) }}
                </span>
              </td>
              <td class="px-6 py-4">
                <button @click="downloadDocument(doc)" class="text-blue-600 hover:underline">
                  Unduh
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ================= EMPTY STATE ================= -->
    <div v-if="!loading && claimDocuments.length === 0 && !error" class="py-10 mt-10 text-center text-gray-500">
      Belum ada data dokumen.
    </div>

  </div>
</AdminLayout>
</template>

<script setup lang="ts">
 import { ref, onMounted } from "vue";
import { useClaimDocument } from "../composables/useClaimDocument";
import { useMasterPayor } from '../composables/masterPayor';
import { generateMonthOptions } from "@/utils/dataHelper";
import AdminLayout from '@/layouts/AdminLayout.vue';
const {payors, fetchMasterPayors} = useMasterPayor()
const { claimDocumentData, loading, error, fetchClaimDocument, resetDocuments } =
  useClaimDocument();
const monthOptions = ref<MonthOption[]>([]);
// Local states
const payorData = ref([]);
const downloading = ref(false);

const filters = ref({
  month: "",
  payorCode: ""
});

const maxMonth = new Date().toISOString().slice(0, 7);

// Computed alias for template
const claimDocuments = claimDocumentData;

// Fetch payors on mount
onMounted(async () => {
  await fetchMasterPayors(1, 100);
  monthOptions.value = generateMonthOptions(24);
 });

// === FORM SUBMIT ===
async function fetchClaimDocuments() {
  await fetchClaimDocument(filters.value.month, filters.value.payorCode);
}

// === RESET FORM ===
function resetForm() {
  filters.value.month = "";
  filters.value.payorCode = "";
  resetDocuments();
}

// === UTILITIES ===
function formatDate(date: string) {
  return new Date(date).toLocaleDateString("id-ID");
}

function getFileExtension(filename: string) {
  return filename.split(".").pop()?.toUpperCase() ?? "PDF";
}

// === DOWNLOAD FILE PER ITEM ===
function downloadDocument(doc: any) {
  const url =
    "http://127.0.0.1:8000/" + doc.file_path.replace(/\\/g, "/");
  window.open(url, "_blank");
}

// === DOWNLOAD ZIP ===
async function downloadAll() {
  downloading.value = true;

  try {
    const url = `http://127.0.0.1:8000/api/v1/claim_document/download-zip?month=${filters.value.month}&payor_code=${filters.value.payorCode}`;

    const res = await fetch(url);
    const blob = await res.blob();

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `documents_${filters.value.month}_${filters.value.payorCode}.zip`;
    link.click();
  } catch (err) {
    console.error("Error download ZIP:", err);
  } finally {
    downloading.value = false;
  }
}
</script>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
