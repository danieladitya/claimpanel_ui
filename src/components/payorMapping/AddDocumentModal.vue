<template>
    <div v-if="isVisible" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <!-- Header -->
        <div class="bg-blue-500 text-white p-6">
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-bold">{{ isEditMode ? 'Edit Dokumen' : 'Tambah Dokumen Baru' }}</h2>
            <button 
              @click="closeModal"
              class="text-white hover:text-gray-200 transition-colors"
            >
              <i class="fas fa-times text-2xl"></i>
            </button>
          </div>
          <p class="text-blue-100 mt-1">
            {{ isEditMode ? 'Perbarui informasi dokumen' : 'Tambahkan dokumen baru ke mapping payor' }}
          </p>
        </div>
  
        <!-- Form -->
        <div class="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <form @submit.prevent="submitForm">
            <!-- Nama Dokumen -->
            <div class="mb-6">
              <label for="documentName" class="block text-sm font-medium text-gray-700 mb-2">
                Nama Dokumen <span class="text-red-500">*</span>
              </label>
              <input
                id="documentName"
                v-model="form.name"
                type="text"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Masukkan nama dokumen"
                :class="{ 'border-red-500': errors.name }"
              >
              <p v-if="errors.name" class="text-red-500 text-sm mt-1">{{ errors.name }}</p>
            </div>
  
            <!-- Deskripsi -->
            <div class="mb-6">
              <label for="documentDescription" class="block text-sm font-medium text-gray-700 mb-2">
                Deskripsi Dokumen <span class="text-red-500">*</span>
              </label>
              <textarea
                id="documentDescription"
                v-model="form.description"
                required
                rows="3"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                placeholder="Masukkan deskripsi dokumen"
                :class="{ 'border-red-500': errors.description }"
              ></textarea>
              <p v-if="errors.description" class="text-red-500 text-sm mt-1">{{ errors.description }}</p>
            </div>
  
            <!-- Kategori dan Status -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <!-- Kategori -->
              <div>
                <label for="documentCategory" class="block text-sm font-medium text-gray-700 mb-2">
                  Kategori <span class="text-red-500">*</span>
                </label>
                <select
                  id="documentCategory"
                  v-model="form.category"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  :class="{ 'border-red-500': errors.category }"
                >
                  <option value="">Pilih Kategori</option>
                  <option value="Medis">Medis</option>
                  <option value="Administrasi">Administrasi</option>
                  <option value="Keuangan">Keuangan</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
                <p v-if="errors.category" class="text-red-500 text-sm mt-1">{{ errors.category }}</p>
              </div>
  
              <!-- Status -->
              <div>
                <label for="documentStatus" class="block text-sm font-medium text-gray-700 mb-2">
                  Status <span class="text-red-500">*</span>
                </label>
                <select
                  id="documentStatus"
                  v-model="form.status"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  :class="{ 'border-red-500': errors.status }"
                >
                  <option value="">Pilih Status</option>
                  <option value="Wajib">Wajib</option>
                  <option value="Opsional">Opsional</option>
                </select>
                <p v-if="errors.status" class="text-red-500 text-sm mt-1">{{ errors.status }}</p>
              </div>
            </div>
  
            <!-- Required Fields Info -->
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div class="flex items-start">
                <i class="fas fa-info-circle text-blue-500 mt-1 mr-3"></i>
                <div>
                  <p class="text-blue-800 font-medium text-sm">Informasi Penting</p>
                  <p class="text-blue-600 text-sm mt-1">
                    Dokumen dengan status <span class="font-semibold">"Wajib"</span> harus dilengkapi oleh peserta 
                    untuk proses klaim. Dokumen <span class="font-semibold">"Opsional"</span> dapat dilengkapi 
                    sebagai pendukung tambahan.
                  </p>
                </div>
              </div>
            </div>
  
            <!-- Form Actions -->
            <div class="flex justify-end space-x-3 pt-4 border-t">
              <button
                type="button"
                @click="closeModal"
                class="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Batal
              </button>
              <button
                type="submit"
                :disabled="isSubmitting"
                class="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                <i v-if="isSubmitting" class="fas fa-spinner fa-spin mr-2"></i>
                <i v-else class="fas fa-save mr-2"></i>
                {{ isSubmitting ? 'Menyimpan...' : (isEditMode ? 'Update' : 'Simpan') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, reactive, watch } from 'vue'
  
  export default {
    name: 'AddDocumentModal',
    props: {
      isVisible: {
        type: Boolean,
        required: true
      },
      payor: {
        type: Object,
        default: null
      },
      editingDocument: {
        type: Object,
        default: null
      }
    },
    emits: ['close', 'save'],
    setup(props, { emit }) {
      const isEditMode = ref(false)
      const isSubmitting = ref(false)
      
      const form = reactive({
        name: '',
        description: '',
        category: '',
        status: ''
      })
  
      const errors = reactive({
        name: '',
        description: '',
        category: '',
        status: ''
      })
  
      // Reset form
      const resetForm = () => {
        form.name = ''
        form.description = ''
        form.category = ''
        form.status = ''
        
        // Reset errors
        Object.keys(errors).forEach(key => {
          errors[key] = ''
        })
      }
  
      // Validate form
      const validateForm = () => {
        let isValid = true
        
        // Reset errors
        Object.keys(errors).forEach(key => {
          errors[key] = ''
        })
  
        // Validate name
        if (!form.name.trim()) {
          errors.name = 'Nama dokumen wajib diisi'
          isValid = false
        } else if (form.name.trim().length < 3) {
          errors.name = 'Nama dokumen minimal 3 karakter'
          isValid = false
        }
  
        // Validate description
        if (!form.description.trim()) {
          errors.description = 'Deskripsi dokumen wajib diisi'
          isValid = false
        } else if (form.description.trim().length < 10) {
          errors.description = 'Deskripsi dokumen minimal 10 karakter'
          isValid = false
        }
  
        // Validate category
        if (!form.category) {
          errors.category = 'Kategori wajib dipilih'
          isValid = false
        }
  
        // Validate status
        if (!form.status) {
          errors.status = 'Status wajib dipilih'
          isValid = false
        }
  
        return isValid
      }
  
      // Submit form
      const submitForm = async () => {
        if (!validateForm()) return
  
        isSubmitting.value = true
  
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          const documentData = {
            id: isEditMode.value ? props.editingDocument.id : Date.now(),
            name: form.name.trim(),
            description: form.description.trim(),
            category: form.category,
            status: form.status,
            selected: false
          }
  
          emit('save', documentData, isEditMode.value)
          closeModal()
        } catch (error) {
          console.error('Error saving document:', error)
        } finally {
          isSubmitting.value = false
        }
      }
  
      // Close modal
      const closeModal = () => {
        resetForm()
        isEditMode.value = false
        emit('close')
      }
  
      // Watch for editing document changes
      watch(() => props.editingDocument, (newDocument) => {
        if (newDocument) {
          isEditMode.value = true
          form.name = newDocument.name
          form.description = newDocument.description
          form.category = newDocument.category
          form.status = newDocument.status
        }
      })
  
      // Watch for modal visibility
      watch(() => props.isVisible, (newValue) => {
        if (!newValue) {
          resetForm()
          isEditMode.value = false
        }
      })
  
      return {
        isEditMode,
        isSubmitting,
        form,
        errors,
        submitForm,
        closeModal
      }
    }
  }
  </script>
  
  <style scoped>
  /* Smooth transitions for modal */
  .modal-enter-active,
  .modal-leave-active {
    transition: opacity 0.3s ease;
  }
  
  .modal-enter-from,
  .modal-leave-to {
    opacity: 0;
  }
  
  .modal-content-enter-active,
  .modal-content-leave-active {
    transition: all 0.3s ease;
  }
  
  .modal-content-enter-from {
    opacity: 0;
    transform: scale(0.9);
  }
  
  .modal-content-leave-to {
    opacity: 0;
    transform: scale(0.9);
  }
  </style>