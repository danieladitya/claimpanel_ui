<template>
    <div class="container mx-auto p-6">
      <!-- Header -->
      <header class="mb-8">
        <h1 class="text-2xl font-bold text-gray-800">Mapping Dokumen Claim per Payor</h1>
        <p class="text-gray-600">Kelola dokumen yang diperlukan untuk setiap payor</p>
      </header>
  
      <div class="flex flex-col lg:flex-row gap-6">
        <!-- Sidebar Daftar Payor -->
        <div class="w-full lg:w-1/3 bg-white rounded-lg shadow p-4">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-semibold text-gray-700">Daftar Payor</h2>
            <button 
              @click="addPayor" 
              class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
            >
              <i class="fas fa-plus mr-1"></i> Tambah
            </button>
          </div>
          
          <!-- Search Bar -->
          <div class="relative mb-4">
            <input 
              type="text" 
              v-model="searchPayor" 
              placeholder="Cari payor..." 
              class="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
            <i class="fas fa-search absolute left-3 top-3 text-gray-400"></i>
          </div>
          
          <!-- Payor List -->
          <div class="space-y-2 max-h-[calc(100vh-250px)] overflow-y-auto">
            <div 
              v-for="payor in filteredPayors" 
              :key="payor.id"
              @click="selectPayor(payor)"
              :class="[
                'payor-item p-3 rounded cursor-pointer transition-all',
                selectedPayor?.id === payor.id 
                  ? 'bg-blue-50 border-l-4 border-blue-500' 
                  : 'hover:bg-gray-100'
              ]"
            >
              <div class="flex justify-between items-center">
                <h3 class="font-medium text-gray-800">{{ payor.name }}</h3>
                <span 
                  :class="[
                    'text-xs px-2 py-1 rounded-full',
                    selectedPayor?.id === payor.id 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-gray-100 text-gray-800'
                  ]"
                >
                  {{ payor.documents.length }} dokumen
                </span>
              </div>
              <p class="text-sm text-gray-600 mt-1">Kategori: {{ payor.category }}</p>
            </div>
          </div>
        </div>
        
        <!-- Konten Utama Mapping Dokumen -->
        <div class="w-full lg:w-2/3 bg-white rounded-lg shadow p-6" v-if="selectedPayor">
          <div class="flex justify-between items-center mb-6">
            <div>
              <h2 class="text-xl font-bold text-gray-800">{{ selectedPayor.name }}</h2>
              <p class="text-gray-600">Kelola mapping dokumen untuk payor ini</p>
            </div>
            <div class="flex space-x-2">
              <button 
                @click="saveMapping" 
                class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded flex items-center"
              >
                <i class="fas fa-save mr-2"></i> Simpan
              </button>
              <button 
                @click="resetMapping" 
                class="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded flex items-center"
              >
                <i class="fas fa-undo mr-2"></i> Reset
              </button>
            </div>
          </div>
          
          <!-- Filter dan Pencarian Dokumen -->
          <div class="flex flex-col md:flex-row justify-between mb-6 gap-4">
            <div class="relative w-full md:w-64">
              <input 
                type="text" 
                v-model="searchDocument" 
                placeholder="Cari dokumen..." 
                class="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
              <i class="fas fa-search absolute left-3 top-3 text-gray-400"></i>
            </div>
            <div class="flex space-x-2">
              <select 
                v-model="selectedCategory" 
                class="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                <option value="">Semua Kategori</option>
                <option value="Medis">Medis</option>
                <option value="Administrasi">Administrasi</option>
                <option value="Keuangan">Keuangan</option>
              </select>
              <select 
                v-model="selectedStatus" 
                class="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                <option value="">Status: Semua</option>
                <option value="Wajib">Status: Wajib</option>
                <option value="Opsional">Status: Opsional</option>
              </select>
            </div>
          </div>
          
          <!-- Daftar Dokumen -->
          <div class="space-y-4 max-h-[calc(100vh-350px)] overflow-y-auto">
            <!-- Dokumen Item -->
            <div 
              v-for="document in filteredDocuments" 
              :key="document.id"
              class="border rounded-lg p-4 hover:bg-gray-50 transition-all"
            >
              <div class="flex justify-between items-start">
                <div class="flex items-start">
                  <input 
                    type="checkbox" 
                    v-model="document.selected"
                    class="mt-1 mr-3 h-5 w-5 text-blue-500 rounded focus:ring-blue-300"
                  >
                  <div>
                    <h3 class="font-medium text-gray-800">{{ document.name }}</h3>
                    <p class="text-sm text-gray-600 mt-1">{{ document.description }}</p>
                    <div class="flex flex-wrap gap-2 mt-2">
                      <span 
                        :class="[
                          'text-xs px-2 py-1 rounded',
                          document.category === 'Medis' ? 'bg-blue-100 text-blue-800' : 
                          document.category === 'Administrasi' ? 'bg-purple-100 text-purple-800' : 
                          'bg-green-100 text-green-800'
                        ]"
                      >
                        {{ document.category }}
                      </span>
                      <span 
                        :class="[
                          'text-xs px-2 py-1 rounded',
                          document.status === 'Wajib' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                        ]"
                      >
                        {{ document.status }}
                      </span>
                    </div>
                  </div>
                </div>
                <div class="flex space-x-2">
                  <button 
                    @click="editDocument(document)" 
                    class="text-blue-500 hover:text-blue-700"
                  >
                    <i class="fas fa-edit"></i>
                  </button>
                  <button 
                    @click="deleteDocument(document)" 
                    class="text-red-500 hover:text-red-700"
                  >
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Action Bar Bawah -->
          <div class="flex justify-between items-center mt-6 pt-4 border-t">
            <div class="text-sm text-gray-600">
              Menampilkan {{ filteredDocuments.length }} dari {{ selectedPayor.documents.length }} dokumen
            </div>
            <div class="flex space-x-2">
              <button 
                @click="addDocument" 
                class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center"
              >
                <i class="fas fa-plus mr-2"></i> Tambah Dokumen
              </button>
              <button 
                @click="exportMapping" 
                class="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded flex items-center"
              >
                <i class="fas fa-file-export mr-2"></i> Ekspor Mapping
              </button>
            </div>
          </div>
        </div>
  
        <!-- Placeholder jika tidak ada payor yang dipilih -->
        <div v-else class="w-full lg:w-2/3 bg-white rounded-lg shadow p-6 flex items-center justify-center">
          <div class="text-center text-gray-500">
            <i class="fas fa-hand-pointer text-4xl mb-4"></i>
            <p>Pilih payor dari daftar untuk melihat dokumen</p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed, onMounted } from 'vue'
  
  export default {
    name: 'DocumentMapping',
    setup() {
      // Data state
      const payors = ref([])
      const selectedPayor = ref(null)
      const searchPayor = ref('')
      const searchDocument = ref('')
      const selectedCategory = ref('')
      const selectedStatus = ref('')
  
      // Sample data
      const samplePayors = [
        {
          id: 1,
          name: 'BPJS Kesehatan',
          category: 'Pemerintah',
          documents: [
            {
              id: 1,
              name: 'Formulir Klaim BPJS',
              description: 'Formulir resmi yang diisi oleh peserta untuk mengajukan klaim',
              category: 'Medis',
              status: 'Wajib',
              selected: false
            },
            {
              id: 2,
              name: 'Kartu Peserta BPJS',
              description: 'Fotokopi kartu peserta BPJS Kesehatan yang masih aktif',
              category: 'Administrasi',
              status: 'Wajib',
              selected: true
            },
            {
              id: 3,
              name: 'Resep Obat',
              description: 'Resep obat asli dari dokter yang merawat',
              category: 'Medis',
              status: 'Opsional',
              selected: false
            },
            {
              id: 4,
              name: 'Hasil Laboratorium',
              description: 'Lengkap dengan stempel rumah sakit dan tanda tangan dokter',
              category: 'Medis',
              status: 'Wajib',
              selected: true
            },
            {
              id: 5,
              name: 'Kwitansi Pembayaran',
              description: 'Asli dengan detail biaya pengobatan',
              category: 'Keuangan',
              status: 'Wajib',
              selected: false
            }
          ]
        },
        {
          id: 2,
          name: 'Astra Life',
          category: 'Swasta',
          documents: [
            {
              id: 1,
              name: 'Formulir Klaim Astra Life',
              description: 'Formulir resmi yang diisi oleh peserta',
              category: 'Medis',
              status: 'Wajib',
              selected: true
            },
            {
              id: 2,
              name: 'KTP Peserta',
              description: 'Fotokopi KTP peserta yang masih berlaku',
              category: 'Administrasi',
              status: 'Wajib',
              selected: true
            }
          ]
        },
        {
          id: 3,
          name: 'Allianz',
          category: 'Swasta',
          documents: [
            {
              id: 1,
              name: 'Formulir Klaim Allianz',
              description: 'Formulir resmi yang diisi oleh peserta',
              category: 'Medis',
              status: 'Wajib',
              selected: true
            }
          ]
        },
        {
          id: 4,
          name: 'AXA Mandiri',
          category: 'Swasta',
          documents: [
            {
              id: 1,
              name: 'Formulir Klaim AXA Mandiri',
              description: 'Formulir resmi yang diisi oleh peserta',
              category: 'Medis',
              status: 'Wajib',
              selected: true
            }
          ]
        },
        {
          id: 5,
          name: 'Prudential',
          category: 'Swasta',
          documents: [
            {
              id: 1,
              name: 'Formulir Klaim Prudential',
              description: 'Formulir resmi yang diisi oleh peserta',
              category: 'Medis',
              status: 'Wajib',
              selected: true
            }
          ]
        }
      ]
  
      // Computed properties
      const filteredPayors = computed(() => {
        if (!searchPayor.value) return payors.value
        
        return payors.value.filter(payor => 
          payor.name.toLowerCase().includes(searchPayor.value.toLowerCase())
        )
      })
  
      const filteredDocuments = computed(() => {
        if (!selectedPayor.value) return []
        
        let documents = selectedPayor.value.documents
        
        if (searchDocument.value) {
          documents = documents.filter(doc => 
            doc.name.toLowerCase().includes(searchDocument.value.toLowerCase()) ||
            doc.description.toLowerCase().includes(searchDocument.value.toLowerCase())
          )
        }
        
        if (selectedCategory.value) {
          documents = documents.filter(doc => doc.category === selectedCategory.value)
        }
        
        if (selectedStatus.value) {
          documents = documents.filter(doc => doc.status === selectedStatus.value)
        }
        
        return documents
      })
  
      // Methods
      const selectPayor = (payor) => {
        selectedPayor.value = payor
      }
  
      const addPayor = () => {
        alert('Fungsi tambah payor akan diimplementasikan')
      }
  
      const saveMapping = () => {
        alert('Fungsi simpan mapping akan diimplementasikan')
      }
  
      const resetMapping = () => {
        if (selectedPayor.value) {
          selectedPayor.value.documents.forEach(doc => {
            doc.selected = false
          })
        }
      }
  
      const addDocument = () => {
        alert('Fungsi tambah dokumen akan diimplementasikan')
      }
  
      const editDocument = (document) => {
        alert(`Fungsi edit dokumen ${document.name} akan diimplementasikan`)
      }
  
      const deleteDocument = (document) => {
        if (confirm(`Apakah Anda yakin ingin menghapus dokumen ${document.name}?`)) {
          const index = selectedPayor.value.documents.findIndex(doc => doc.id === document.id)
          if (index !== -1) {
            selectedPayor.value.documents.splice(index, 1)
          }
        }
      }
  
      const exportMapping = () => {
        alert('Fungsi ekspor mapping akan diimplementasikan')
      }
  
      // Lifecycle
      onMounted(() => {
        payors.value = samplePayors
        if (payors.value.length > 0) {
          selectedPayor.value = payors.value[0]
        }
      })
  
      return {
        payors,
        selectedPayor,
        searchPayor,
        searchDocument,
        selectedCategory,
        selectedStatus,
        filteredPayors,
        filteredDocuments,
        selectPayor,
        addPayor,
        saveMapping,
        resetMapping,
        addDocument,
        editDocument,
        deleteDocument,
        exportMapping
      }
    }
  }
  </script>
  
  <style scoped>
  /* Custom styles if needed */
  </style>