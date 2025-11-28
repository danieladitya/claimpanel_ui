<template>
  <div class="flex gap-6">
    <!-- FORM SECTION -->
    <div class="flex-1 p-6 bg-white shadow rounded-xl">
      <h2 class="mb-6 text-2xl font-semibold text-gray-800">
        {{ isEdit ? 'Edit Cross Check Rule' : 'Tambah Cross Check Rule' }}
      </h2>

      <form @submit.prevent="submitForm" class="space-y-5">
        <!-- Rule Name -->
        <div class="form-group">
          <label class="form-title">Nama Rule *</label>
          <input v-model="form.rule_name" type="text"
                 class="form-control"
                 placeholder="Contoh: Pemeriksaan Obat Diabetes" required>
        </div>

        <!-- Required Type -->
        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700">Tipe Rule *</label>
          <select v-model="form.gc_rule_type" class="form-control"
                   required>
            <option v-for="row in RULE_TYPE_OPTIONS" :key="row.standardcode_id" :value="row.standardcode_id">
              {{ row.standardcode_name }}
            </option>
          </select>
        </div>

        <!-- Description -->
        <div>
          <label class="form-title">Deskripsi</label>
          <textarea v-model="form.rule_description" rows="2"
                    class="form-control"
                    placeholder="Deskripsi singkat rule ini..."></textarea>
        </div>

        <!-- Trigger -->
        <div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block mb-1 text-sm font-medium text-gray-700">Sistem Kode Pemicu *</label>
              <select
                v-model="form.triger_gccode_system"
                class="form-control"
                required
              >
                <option
                  v-for="system in CODE_SYSTEM_OPTIONS"
                  :key="system.standardcode_id"
                  :value="system.standardcode_id"
                >
                  {{ system.standardcode_name }}
                </option>
              </select>
            </div>
            
            <div>
              <label class="block mb-1 text-sm font-medium text-gray-700">Mode Pemeriksaan *</label>
              <select v-model="form.gc_required_mode"
              class="form-control"      
              required>
                <option v-for="mode in REQUIRED_MODE_OPTIONS" :key="mode.standardcode_id" :value="mode.standardcode_id">
                  {{ mode.standardcode_name }}
                </option>
              </select>
            </div>
          </div>

          <!-- Kode Pemicu Section -->
          <div class="mt-4">
            <label class="block mb-1 text-sm font-medium text-gray-700">Kode Pemicu *</label>
            <div class="relative">
              <div class="flex space-x-2">
                <input
                  v-model="form.trigger_code_id"
                  type="text"
                  required
                  :class="[
                    'form-control',
                    triggerCodeError ? 'border-red-300' : 'border-gray-300'
                  ]"
                  placeholder="Ketik untuk mencari kode ICD..."
                  @input="handleICDSearch"
                  @focus="showICDSuggestions = true"
                  @blur="handleBlurTrigger"
                  ref="icdInput"
                />
                <button
                  type="button"
                  @click="searchTriggerICDCode()"
                  class="px-4 py-2 text-blue-600 transition-colors border border-blue-300 rounded-md hover:bg-blue-50"
                  :disabled="searchingICD"
                >
                  <span v-if="searchingICD" class="inline-flex items-center">
                    <svg class="w-4 h-4 mr-1 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </span>
                  <span v-else>Cari</span>
                </button>
              </div>

              <!-- ICD Suggestions untuk Trigger Code -->
              <div 
                v-if="showICDSuggestions && icdSuggestions.length > 0" 
                class="absolute z-50 w-full mt-1 overflow-y-auto bg-white border border-gray-300 rounded-md shadow-lg max-h-60"
              >
                <div 
                  v-for="icd in icdSuggestions" 
                  :key="icd.code_id"
                  class="px-3 py-2 border-b border-gray-100 cursor-pointer hover:bg-blue-50 last:border-b-0"
                  @mousedown="selectTriggerICDCode(icd)"
                >
                  <div class="flex items-start justify-between">
                    <div>
                      <span class="font-mono font-medium text-blue-600">{{ icd.code }}</span>
                      <span class="ml-2 text-xs text-gray-500">{{ icd.code_id }}</span>
                    </div>
                    <span 
                      v-if="icd.valid_code === 1" 
                      class="px-2 py-1 text-xs text-green-800 bg-green-100 rounded-full"
                    >
                      Valid
                    </span>
                  </div>
                  <p class="mt-1 text-sm text-gray-700 line-clamp-2">{{ icd.description }}</p>
                </div>
                
                <!-- Load More untuk Trigger Code -->
                <div 
                  v-if="icdPagination.hasMore" 
                  class="px-3 py-2 text-center border-t border-gray-200"
                >
                  <button
                    @click="loadMoreTriggerICD()"
                    class="text-sm text-blue-600 hover:text-blue-800"
                    :disabled="searchingICD"
                  >
                    {{ searchingICD ? 'Memuat...' : 'Muat lebih banyak' }}
                  </button>
                </div>
              </div>
              
              <!-- Error Message untuk Trigger Code -->
              <p v-if="triggerCodeError" class="mt-1 text-sm text-red-500">{{ triggerCodeError }}</p>
            </div>
          </div>
        </div>

        <!-- Required Type System -->
        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700">Sistem Kode Diperlukan *</label>
          <select 
            v-model="form.gc_required_type"
            class="form-control"
            required
            @change="handleRequiredTypeChange"
          >
            <option v-for="system in RERQUIRED_TYPE_OPTIONS" :key="system.standardcode_id" :value="system.standardcode_id">
              {{ system.standardcode_name }}
            </option>    
          </select>
        </div>
       
        <!-- Required Codes dengan Tampilan Kode + Nama -->
        <div>
          <div class="flex items-center justify-between mb-2">
            <label class="text-sm font-medium text-gray-700">Kode/Dokumen yang Diperlukan *</label>
            <button 
              type="button" 
              @click="addCode"
              class="flex items-center text-sm text-green-600 hover:text-green-700"
            >
              <span class="mr-1">+</span> Tambah Kode
            </button>
          </div>
          
          <!-- Input untuk ICD 10 (X002^001) -->
          <div v-if="form.gc_required_type === 'X002^001'" class="space-y-3">
            <div v-for="(code, index) in form.required_codes" :key="index" class="space-y-2">
              <!-- Display Selected Code dengan Nama -->
              <div v-if="selectedRequiredCodes[index]" class="p-3 border border-green-200 rounded-md bg-green-50">
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <div class="flex items-center space-x-2">
                      <span class="font-mono font-medium text-green-700">{{ selectedRequiredCodes[index].code }}</span>
                      <span class="px-2 py-1 text-xs text-green-600 bg-green-100 rounded-full">
                        {{ selectedRequiredCodes[index].valid_code === 1 ? 'Valid' : 'Tidak Valid' }}
                      </span>
                    </div>
                    <p class="mt-1 text-sm text-gray-700">{{ selectedRequiredCodes[index].description }}</p>
                  </div>
                  <button 
                    type="button" 
                    @click="clearSelectedRequiredCode(index)"
                    class="ml-2 text-red-500 hover:text-red-700"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <!-- Input untuk Pencarian -->
              <div v-else class="flex space-x-2">
                <div class="relative flex-1">
                  <input
                    v-model="form.required_codes[index]"
                    type="text"
                    :class="[
                      'form-control focus:ring-green-500',
                      requiredCodeErrors[index] ? 'border-red-300' : 'border-gray-300'
                    ]"
                    placeholder="Ketik kode ICD-10..."
                    @input="handleRequiredICDSearch(index, $event)"
                    @focus="showRequiredSuggestions[index] = true"
                    @blur="handleBlurRequired(index)"
                  />
                  
                  <!-- ICD Suggestions untuk Required Codes -->
                  <div 
                    v-if="showRequiredSuggestions[index] && requiredSuggestions[index]?.length > 0" 
                    class="absolute z-50 w-full mt-1 overflow-y-auto bg-white border border-gray-300 rounded-md shadow-lg max-h-60"
                  >
                    <div 
                      v-for="icd in requiredSuggestions[index]" 
                      :key="icd.code_id"
                      class="px-3 py-2 border-b border-gray-100 cursor-pointer hover:bg-green-50 last:border-b-0"
                      @mousedown="selectRequiredICDCode(index, icd)"
                    >
                      <div class="flex items-start justify-between">
                        <div>
                          <span class="font-mono font-medium text-green-600">{{ icd.code }}</span>
                          <span class="ml-2 text-xs text-gray-500">{{ icd.code_id }}</span>
                        </div>
                        <span 
                          v-if="icd.valid_code === 1" 
                          class="px-2 py-1 text-xs text-green-800 bg-green-100 rounded-full"
                        >
                          Valid
                        </span>
                      </div>
                      <p class="mt-1 text-sm text-gray-700 line-clamp-2">{{ icd.description }}</p>
                    </div>
                    
                    <!-- Load More untuk Required Codes -->
                    <div 
                      v-if="requiredPagination[index]?.hasMore" 
                      class="px-3 py-2 text-center border-t border-gray-200"
                    >
                      <button
                        @click="loadMoreRequiredICD(index)"
                        class="btn btn-success btn-sm"
                        :disabled="searchingRequired[index]"
                      >
                        {{ searchingRequired[index] ? 'Memuat...' : 'Muat lebih banyak' }}
                      </button>
                    </div>
                  </div>
                  
                  <!-- Error Message untuk Required Code -->
                  <p v-if="requiredCodeErrors[index]" class="mt-1 text-sm text-red-500">{{ requiredCodeErrors[index] }}</p>
                </div>
                
                <button 
                  type="button" 
                  @click="searchRequiredICDCode(index)"
                  class="px-4 py-2 text-green-600 transition-colors border border-green-300 rounded-md hover:bg-green-50"
                  :disabled="searchingRequired[index]"
                >
                  <span v-if="searchingRequired[index]" class="inline-flex items-center">
                    <svg class="w-4 h-4 mr-1 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </span>
                  <span v-else>Cari</span>
                </button>
                
                <button 
                  type="button" 
                  @click="removeCode(index)" 
                  class="px-3 py-2 text-red-500 hover:text-red-700"
                  :disabled="form.required_codes.length === 1"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>

          <!-- Input untuk ICD 9 (X002^002) -->
          <div v-else-if="form.gc_required_type === 'X002^002'" class="space-y-3">
            <div v-for="(code, index) in form.required_codes" :key="index" class="space-y-2">
              <!-- Display Selected Code dengan Nama -->
              <div v-if="selectedRequiredCodes[index]" class="p-3 border border-green-200 rounded-md bg-green-50">
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <div class="flex items-center space-x-2">
                      <span class="font-mono font-medium text-green-700">{{ selectedRequiredCodes[index].code }}</span>
                      <span class="px-2 py-1 text-xs text-green-600 bg-green-100 rounded-full">
                        {{ selectedRequiredCodes[index].valid_code === 1 ? 'Valid' : 'Tidak Valid' }}
                      </span>
                    </div>
                    <p class="mt-1 text-sm text-gray-700">{{ selectedRequiredCodes[index].description }}</p>
                  </div>
                  <button 
                    type="button" 
                    @click="clearSelectedRequiredCode(index)"
                    class="ml-2 text-red-500 hover:text-red-700"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <!-- Input untuk Pencarian -->
              <div v-else class="flex space-x-2">
                <div class="relative flex-1">
                  <input
                    v-model="form.required_codes[index]"
                    type="text"
                    :class="[
                      'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500',
                      requiredCodeErrors[index] ? 'border-red-300' : 'border-gray-300'
                    ]"
                    placeholder="Ketik kode ICD-9..."
                    @input="handleRequiredICD9Search(index, $event)"
                    @focus="showRequiredSuggestions[index] = true"
                    @blur="handleBlurRequired(index)"
                  />
                  
                  <!-- ICD-9 Suggestions -->
                  <div 
                    v-if="showRequiredSuggestions[index] && requiredSuggestions[index]?.length > 0" 
                    class="absolute z-50 w-full mt-1 overflow-y-auto bg-white border border-gray-300 rounded-md shadow-lg max-h-60"
                  >
                    <div 
                      v-for="icd in requiredSuggestions[index]" 
                      :key="icd.code_id"
                      class="px-3 py-2 border-b border-gray-100 cursor-pointer hover:bg-green-50 last:border-b-0"
                      @mousedown="selectRequiredICDCode(index, icd)"
                    >
                      <div class="flex items-start justify-between">
                        <div>
                          <span class="font-mono font-medium text-green-600">{{ icd.code }}</span>
                          <span class="ml-2 text-xs text-gray-500">{{ icd.code_id }}</span>
                        </div>
                        <span 
                          v-if="icd.valid_code === 1" 
                          class="px-2 py-1 text-xs text-green-800 bg-green-100 rounded-full"
                        >
                          Valid
                        </span>
                      </div>
                      <p class="mt-1 text-sm text-gray-700 line-clamp-2">{{ icd.description }}</p>
                    </div>
                    
                    <!-- Load More untuk ICD-9 -->
                    <div 
                      v-if="requiredPagination[index]?.hasMore" 
                      class="px-3 py-2 text-center border-t border-gray-200"
                    >
                      <button
                        @click="loadMoreRequiredICD(index)"
                        class="text-sm text-green-600 hover:text-green-800"
                        :disabled="searchingRequired[index]"
                      >
                        {{ searchingRequired[index] ? 'Memuat...' : 'Muat lebih banyak' }}
                      </button>
                    </div>
                  </div>
                  
                  <!-- Error Message untuk Required Code -->
                  <p v-if="requiredCodeErrors[index]" class="mt-1 text-sm text-red-500">{{ requiredCodeErrors[index] }}</p>
                </div>
                
                <button 
                  type="button" 
                  @click="searchRequiredICD9Code(index)"
                  class="px-4 py-2 text-green-600 transition-colors border border-green-300 rounded-md hover:bg-green-50"
                  :disabled="searchingRequired[index]"
                >
                  <span v-if="searchingRequired[index]" class="inline-flex items-center">
                    <svg class="w-4 h-4 mr-1 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </span>
                  <span v-else>Cari</span>
                </button>
                
                <button 
                  type="button" 
                  @click="removeCode(index)" 
                  class="px-3 py-2 text-red-500 hover:text-red-700"
                  :disabled="form.required_codes.length === 1"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>

        <!-- Input untuk Nama Dokumen (X002^003) -->
<!-- Input untuk Nama Dokumen (X002^003) -->
<div v-else-if="form.gc_required_type === 'X002^003'" class="space-y-3">
  <div v-for="(code, index) in form.required_codes" :key="index" class="space-y-2">
    <!-- Display Selected Document dengan Nama -->
    <div v-if="selectedRequiredCodes[index]" class="p-3 border border-blue-200 rounded-md bg-blue-50">
      <div class="flex items-start justify-between">
        <div class="flex-1">
          <div class="flex items-center space-x-2">
            <span class="font-medium text-blue-700">{{ selectedRequiredCodes[index].document_name }}</span>
            <span class="px-2 py-1 text-xs text-blue-600 bg-blue-100 rounded-full">
              Dokumen
            </span>
          </div>
          <p class="mt-1 text-sm text-gray-700">{{ selectedRequiredCodes[index].description || 'Tidak ada deskripsi' }}</p>
        </div>
        <button 
          type="button" 
          @click="clearSelectedRequiredCode(index)"
          class="ml-2 text-red-500 hover:text-red-700"
        >
          ✕
        </button>
      </div>
    </div>

    <!-- Input untuk Pencarian Dokumen -->
    <div v-else class="flex space-x-2">
      <div class="relative flex-1">
        <input
          v-model="form.required_codes[index]"
          type="text"
          :class="[
            'form-control focus:ring-blue-500',
            requiredCodeErrors[index] ? 'border-red-300' : 'border-gray-300'
          ]"
          placeholder="Ketik untuk mencari nama dokumen..."
          @input="handleRequiredDocumentSearch(index, $event)"
          @focus="showDocumentSuggestions = true"
          @blur="handleBlurDocument"
        />
        
        <!-- Document Suggestions -->
        <div 
          v-if="showDocumentSuggestions && documentSuggestions.length > 0" 
          class="absolute z-50 w-full mt-1 overflow-y-auto bg-white border border-gray-300 rounded-md shadow-lg max-h-60"
        >
          <div 
            v-for="doc in documentSuggestions" 
            :key="doc.id"
            class="px-3 py-2 border-b border-gray-100 cursor-pointer hover:bg-blue-50 last:border-b-0"
            @mousedown="selectRequiredDocument(index, doc)"
          >
            <div class="flex items-start justify-between">
              <div>
                <span class="font-medium text-blue-600">{{ doc.document_name }}</span>
                <span class="ml-2 text-xs text-gray-500">{{ doc.id }}</span>
              </div>
              <span 
                v-if="doc.is_active === 1" 
                class="px-2 py-1 text-xs text-green-800 bg-green-100 rounded-full"
              >
                Aktif
              </span>
            </div>
            <p class="mt-1 text-sm text-gray-700 line-clamp-2">{{ doc.document_name || 'Tidak ada deskripsi' }}</p>
          </div>
          
          <!-- Load More untuk Documents -->
          <div 
            v-if="documentPagination.hasMore" 
            class="px-3 py-2 text-center border-t border-gray-200"
          >
            <button
              @click="loadMoreRequiredDocument(index)"
              class="text-sm text-blue-600 hover:text-blue-800"
              :disabled="searchingDocument"
            >
              {{ searchingDocument ? 'Memuat...' : 'Muat lebih banyak' }}
            </button>
          </div>
        </div>
        
        <!-- Error Message untuk Required Document -->
        <p v-if="requiredCodeErrors[index]" class="mt-1 text-sm text-red-500">{{ requiredCodeErrors[index] }}</p>
      </div>
      
      <button 
        type="button" 
        @click="searchRequiredDocument"
        class="px-4 py-2 text-blue-600 transition-colors border border-blue-300 rounded-md hover:bg-blue-50"
        :disabled="searchingDocument"
      >
        <span v-if="searchingDocument" class="inline-flex items-center">
          <svg class="w-4 h-4 mr-1 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </span>
        <span v-else>Cari</span>
      </button>
      
      <button 
        type="button" 
        @click="removeCode(index)" 
        class="px-3 py-2 text-red-500 hover:text-red-700"
        :disabled="form.required_codes.length === 1"
      >
        ✕
      </button>
    </div>
  </div>
</div>
        </div>

        <!-- Required N -->
        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700">Jumlah Minimum</label>
          <input v-model.number="form.required_n" type="number" min="1"
                 class="w-32 px-3 py-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500">
        </div>

        <!-- Message -->
        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700">Pesan Error *</label>
          <textarea v-model="form.message" rows="2"
                    class="w-full px-3 py-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="Pesan jika validasi gagal" required></textarea>
        </div>

        <!-- Severity & Active -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block mb-1 text-sm font-medium text-gray-700">Severity *</label>
            <select v-model="form.gc_severity"
                    class="w-full px-3 py-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" required>
              <option value="">Pilih Severity</option>
              <option value="X004^001">Warning</option>
              <option value="X004^002">Error</option>
            </select>
          </div>
          <div class="flex items-center mt-6 space-x-2">
            <input v-model="form.active" type="checkbox" class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500">
            <label class="text-sm text-gray-700">Aktif</label>
          </div>
        </div>

        <!-- Condition JSON -->
        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700">Kondisi Tambahan (JSON)</label>
          <textarea v-model="conditionText" rows="3"
                    class="w-full px-3 py-2 font-mono text-sm border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder='{"age": {"min": 18}, "gender": "male"}'></textarea>
          <p v-if="jsonError" class="mt-1 text-sm text-red-500">{{ jsonError }}</p>
        </div>

        <!-- Submit -->
        <div class="pt-4 border-t">
          <button type="submit"
                  class="px-5 py-2 font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50"
                  :disabled="!isValid">
            {{ isEdit ? 'Update Rule' : 'Simpan Rule' }}
          </button>
        </div>
      </form>
    </div>

    <!-- PREVIEW SECTION -->
    <div class="w-1/3 p-5 space-y-4 shadow-inner bg-gray-50 rounded-xl">
      <h3 class="mb-3 text-lg font-semibold text-gray-800">Preview Logika Rule</h3>

      <div class="p-4 bg-white border border-gray-200 rounded-lg">
        <p class="mb-2 text-sm text-gray-700">
          <strong>Nama:</strong> {{ form.rule_name || '-' }}
        </p>
        <p class="mb-2 text-sm text-gray-700">
          <strong>Tipe:</strong> {{ typeLabel }}
        </p>
        <p class="mb-2 text-sm text-gray-700">
          <strong>Status:</strong>
          <span :class="form.active ? 'text-green-600 font-medium' : 'text-gray-500'">
            {{ form.active ? 'Aktif' : 'Non-aktif' }}
          </span>
        </p>

        <hr class="my-3">

        <!-- Logic Description -->
        <div v-if="form.gc_rule_type === 'X010^001'" class="text-sm">
          Jika ditemukan <strong>{{ form.trigger_code_id || '...' }}</strong>,
          maka harus ada kode dari sistem
          <strong>{{ form.gc_required_type || '...' }}</strong>:
          <div class="mt-1 space-y-1">
            <div 
              v-for="(code, index) in form.required_codes" 
              :key="index"
              class="font-mono text-blue-700"
            >
              • {{ code }} <span v-if="selectedRequiredCodes[index]" class="font-normal text-gray-600">- {{ selectedRequiredCodes[index].description }}</span>
            </div>
          </div>
        </div>

        <div v-else-if="form.gc_rule_type === 'X010^002'" class="text-sm">
          Untuk diagnosis <strong>{{ form.trigger_code_id || '...' }}</strong>,
          wajib melampirkan dokumen:
          <div class="mt-1 space-y-1">
            <div 
              v-for="(code, index) in form.required_codes" 
              :key="index"
              class="font-mono text-blue-700"
            >
              • {{ code }}
            </div>
          </div>
        </div>

        <div v-else-if="form.gc_rule_type === 'X010^003'" class="text-sm">
          Rule Universal: semua klaim wajib memiliki dokumen:
          <div class="mt-1 space-y-1">
            <div 
              v-for="(code, index) in form.required_codes" 
              :key="index"
              class="font-mono text-blue-700"
            >
              • {{ code }}
            </div>
          </div>
        </div>

        <p class="mt-3 text-sm text-gray-600">
          Mode: <strong>{{ modeLabel }}</strong> • Severity: <strong>{{ severityLabel }}</strong>
        </p>

        <p v-if="form.message" class="p-2 mt-3 text-sm text-red-700 border border-red-200 rounded-md bg-red-50">
          ⚠️ Pesan Error: "{{ form.message }}"
        </p>
      </div>

      <div v-if="conditionText" class="p-4 bg-white border border-gray-200 rounded-lg">
        <h4 class="mb-1 text-sm font-medium text-gray-700">Kondisi Tambahan:</h4>
        <pre class="p-2 overflow-auto text-xs text-gray-600 rounded bg-gray-50">{{ conditionText }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useReference } from '@/composables/standardCode';
import { IStandardcode } from '@/interface/IStandardcode';
import { useICDSearch } from '@/composables/useICDSearch';
import { useRequiredCodeSearch } from '@/composables/useRequiredCodeSearch';
import { useCrossCheckRules } from '../../composables/useCrossCheckRules';
import { useMasterDocument } from '../../composables/masterDocument';

interface CrossCheckRule {
  rule_name: string
  rule_description?: string, 
  gc_rule_type: string,
  gc_required_type: string
  trigger_code_id?: string
  triger_gccode_system?: string
  required_code_system: string
  gc_required_mode: string
  required_n?: number
  required_codes: string[]
  message: string
  gc_severity: string
  condition_json?: any
  active: boolean
}

const props = defineProps<{ modelValue?: CrossCheckRule; isEdit?: boolean }>()
const emit = defineEmits(['save'])

const form = ref<CrossCheckRule>(props.modelValue || {
  rule_name: '',
  rule_description: '',
  gc_rule_type : '',
  gc_required_type: '',
  trigger_code_id: '',
  triger_gccode_system: '',
  required_code_system: '',
  gc_required_mode: '',
  required_n: 1,
  required_codes: [''],
  message: '',
  gc_severity: '',
  condition_json: {},
  active: true
})

const conditionText = ref('')
const jsonError = ref('')

// Tambahkan reactive state untuk menyimpan data lengkap kode yang dipilih
const selectedRequiredCodes = ref<Record<number, any>>({})

// Gunakan composable terpisah untuk trigger dan required codes
const {
  icdSuggestions,
  showICDSuggestions,
  searchingICD,
  icdPagination,
  searchICDCode,
  loadMoreICD
} = useICDSearch()
const {
  documentSuggestions,
  showDocumentSuggestions,
  searchingDocument,
  documentPagination,
  searchDocument,
  loadMoreDocument
  
} = useMasterDocument()
const {
  requiredSuggestions,
  showRequiredSuggestions,
  searchingRequired,
  requiredPagination,
  requiredCodeErrors,
  searchRequiredICDCode: searchRequiredICD,
  clearRequiredSuggestions
} = useRequiredCodeSearch()
const {
  createRule
} = useCrossCheckRules()
const RULE_TYPE_OPTIONS  = ref<IStandardcode[]>()
const REQUIRED_MODE_OPTIONS = ref<IStandardcode[]>()
const CODE_SYSTEM_OPTIONS = ref<IStandardcode[]>()
const RERQUIRED_TYPE_OPTIONS = ref<IStandardcode[]>()

const triggerCodeError = ref('')

onMounted(async () => {
  const refData = await getReferenceByParent('X010')
  const refRequiredMode = await getReferenceByParent('X003')
  const refCodeSystem = await getReferenceByParent('X678')
  const refRequiredType = await getReferenceByParent('X002')

  RULE_TYPE_OPTIONS.value = refData
  REQUIRED_MODE_OPTIONS.value = refRequiredMode
  CODE_SYSTEM_OPTIONS.value = refCodeSystem
  RERQUIRED_TYPE_OPTIONS.value = refRequiredType
})

const {
  getReferenceByParent
} = useReference()
// Handler untuk Required Codes - Document Search
// Handler untuk Required Codes - Document Search
const handleRequiredDocumentSearch = async (index: number, event?: Event) => {
  const query = event ? (event.target as HTMLInputElement).value : form.value.required_codes[index];
  
  // Reset selected code jika input diubah
  if (selectedRequiredCodes.value[index] && selectedRequiredCodes.value[index].document_name !== query) {
    selectedRequiredCodes.value[index] = null;
  }
  
  if (query && query.length >= 2) {
    await searchRequiredDocument();
  } else {
    showDocumentSuggestions.value = false;
    if (query && query.length > 0) {
      requiredCodeErrors.value[index] = 'Masukkan minimal 2 karakter untuk pencarian';
    } else {
      requiredCodeErrors.value[index] = '';
    }
  }
}

const searchRequiredDocument = async () => {
  const query = form.value.trigger_code_id;
  if (query && query.length >= 2) {
    await searchDocument(form.value.triger_gccode_system || '', query);
  } else {
    triggerCodeError.value = 'Masukkan minimal 2 karakter untuk pencarian'
  }
}

const loadMoreRequiredDocument = async (index: number) => {
  const query = form.value.required_codes[index];
  if (query) {
    await loadMoreDocument('', query);
  }
}

// Handler untuk memilih dokumen required
const selectRequiredDocument = (index: number, doc: any) => {
  form.value.required_codes[index] = doc.document_name;
  selectedRequiredCodes.value[index] = doc; // Simpan data lengkap dokumen
  requiredCodeErrors.value[index] = '';
  showDocumentSuggestions.value = false;
}

// Handler untuk blur event document
const handleBlurDocument = () => {
  setTimeout(() => {
    showDocumentSuggestions.value = false;
  }, 200);
}

// Handler untuk perubahan Required Type - tambahkan reset untuk document
// const handleRequiredTypeChange = () => {
//   form.value.required_codes = [''];
//   selectedRequiredCodes.value = {}; // Reset semua selected codes
  
//   // Reset semua state pencarian required codes
//   Object.keys(requiredSuggestions.value).forEach(index => {
//     clearRequiredSuggestions(Number(index));
//     requiredCodeErrors.value[Number(index)] = '';
//   });
  
//   // Reset document suggestions
//   showDocumentSuggestions.value = false;
// }
// Menambahkan dan menghapus kode required



// Handler untuk Trigger Code
const selectTriggerICDCode = (icd: any) => {
  form.value.trigger_code_id = icd.code
  triggerCodeError.value = ''
  showICDSuggestions.value = false
}

const handleICDSearch = async (event?: Event) => {
  const query = event ? (event.target as HTMLInputElement).value : form.value.trigger_code_id;
  
  if (query && query.length >= 2) {
    const result = await searchICDCode(form.value.triger_gccode_system || '', query);
    if (result.error) {
      triggerCodeError.value = result.error;
    }
  } else {
    showICDSuggestions.value = false;
    if (query && query.length > 0) {
      triggerCodeError.value = 'Masukkan minimal 2 karakter untuk pencarian'
    } else {
      triggerCodeError.value = ''
    }
  }
}

const searchTriggerICDCode = async () => {
  const query = form.value.trigger_code_id;
  if (query && query.length >= 2) {
    await searchICDCode(form.value.triger_gccode_system || '', query);
  } else {
    triggerCodeError.value = 'Masukkan minimal 2 karakter untuk pencarian'
  }
}

const loadMoreTriggerICD = async () => {
  const query = form.value.trigger_code_id;
  if (query) {
    await loadMoreICD(form.value.triger_gccode_system || '', query);
  }
}

const handleBlurTrigger = () => {
  setTimeout(() => {
    showICDSuggestions.value = false
  }, 200)
}

// Handler untuk Required Codes - ICD 10
const handleRequiredICDSearch = async (index: number, event?: Event) => {
  const query = event ? (event.target as HTMLInputElement).value : form.value.required_codes[index];
  
  if (query && query.length >= 2) {
    await searchRequiredICD(index, 'X678^001', query, 1)
  } else {
    clearRequiredSuggestions(index)
    if (query && query.length > 0) {
      requiredCodeErrors.value[index] = 'Masukkan minimal 2 karakter untuk pencarian'
    } else {
      requiredCodeErrors.value[index] = ''
    }
  }
}

// Handler untuk Required Codes - ICD 9
const handleRequiredICD9Search = async (index: number, event?: Event) => {
  const query = event ? (event.target as HTMLInputElement).value : form.value.required_codes[index];
  
  if (query && query.length >= 2) {
    await searchRequiredICD(index, 'X678^002', query, 1)
  } else {
    clearRequiredSuggestions(index)
    if (query && query.length > 0) {
      requiredCodeErrors.value[index] = 'Masukkan minimal 2 karakter untuk pencarian'
    } else {
      requiredCodeErrors.value[index] = ''
    }
  }
}

const searchRequiredICDCode = async (index: number) => {
  const query = form.value.required_codes[index];
  if (query && query.length >= 2) {
    await searchRequiredICD(index, 'X678^001', query, 1)
  } else {
    requiredCodeErrors.value[index] = 'Masukkan minimal 2 karakter untuk pencarian'
  }
}

const searchRequiredICD9Code = async (index: number) => {
  const query = form.value.required_codes[index];
  if (query && query.length >= 2) {
    await searchRequiredICD(index, 'X678^002', query, 1)
  } else {
    requiredCodeErrors.value[index] = 'Masukkan minimal 2 karakter untuk pencarian'
  }
}

const loadMoreRequiredICD = async (index: number) => {
  const query = form.value.required_codes[index];
  const currentPage = Math.floor(requiredPagination.value[index]?.skip / requiredPagination.value[index]?.limit) + 1 || 1
  const nextPage = currentPage + 1
  
  if (query && query.length >= 2) {
    const system = form.value.gc_required_type === 'X002^001' ? 'X678^001' : 'X678^002'
    await searchRequiredICD(index, system, query, nextPage)
  }
}

// Handler untuk memilih kode required
const selectRequiredICDCode = (index: number, icd: any) => {
  form.value.required_codes[index] = icd.code
  selectedRequiredCodes.value[index] = icd // Simpan data lengkap
  requiredCodeErrors.value[index] = ''
  showRequiredSuggestions.value[index] = false
}

// Handler untuk menghapus kode yang sudah dipilih
const clearSelectedRequiredCode = (index: number) => {
  form.value.required_codes[index] = ''
  selectedRequiredCodes.value[index] = null
  clearRequiredSuggestions(index)
}

const handleBlurRequired = (index: number) => {
  setTimeout(() => {
    showRequiredSuggestions.value[index] = false
  }, 200)
}

// Handler untuk perubahan Required Type
const handleRequiredTypeChange = () => {
  form.value.required_codes = ['']
  selectedRequiredCodes.value = {} // Reset semua selected codes
  // Reset semua state pencarian required codes
  Object.keys(requiredSuggestions.value).forEach(index => {
    clearRequiredSuggestions(Number(index))
    requiredCodeErrors.value[Number(index)] = ''
  })
}

const addCode = () => {
  form.value.required_codes.push('')
}

const removeCode = (i: number) => {
  if (form.value.required_codes.length > 1) {
    form.value.required_codes.splice(i, 1)
    // Hapus juga state pencarian dan selected code untuk index yang dihapus
    clearRequiredSuggestions(i)
    delete requiredCodeErrors.value[i]
    delete selectedRequiredCodes.value[i]
    
    // Reindex selectedRequiredCodes
    const newSelectedCodes: Record<number, any> = {}
    Object.keys(selectedRequiredCodes.value).forEach((key, newIndex) => {
      if (Number(key) !== i) {
        newSelectedCodes[newIndex] = selectedRequiredCodes.value[Number(key)]
      }
    })
    selectedRequiredCodes.value = newSelectedCodes
  }
}

watch(conditionText, (val) => {
  try {
    if (val.trim()) {
      form.value.condition_json = JSON.parse(val)
      jsonError.value = ''
    } else form.value.condition_json = {}
  } catch (err: any) {
    jsonError.value = 'JSON tidak valid: ' + err.message
  }
})
  
const isValid = computed(() =>
  form.value.rule_name &&
  form.value.gc_rule_type &&
  form.value.gc_required_type &&
  form.value.trigger_code_id &&
  form.value.triger_gccode_system &&
  form.value.gc_required_mode &&
  form.value.required_codes.every(c => c.trim()) &&
  form.value.message &&
  form.value.gc_severity &&
  !jsonError.value
)
  
const submitForm = () => {
  if (!isValid.value) return
  alert( JSON.stringify( form.value))
  const response = createRule(form.value)
  
  alert(JSON.stringify( response))

  emit('save', form.value)
}
  
// --- Preview computed ---
const codesDisplay = computed(() => form.value.required_codes.filter(c => c.trim()).join(', ') || '...')
  
const typeLabel = computed(() => {
  switch (form.value.gc_rule_type) {
    case 'X010^001': return 'ICD → ATC (Kode Medis)'
    case 'X010^002': return 'Dokumen Khusus'
    case 'X010^003': return 'Universal'
    default: return '-'
  }
})
  
const modeLabel = computed(() => {
  switch (form.value.gc_required_mode) {
    case 'X003^001': return 'Semua Harus Ada'
    case 'X003^002': return 'Minimal Satu Ada'
    default: return '-'
  }
})
  
const severityLabel = computed(() => {
  switch (form.value.gc_severity) {
    case 'X004^001': return 'Warning'
    case 'X004^002': return 'Error'
    default: return '-'
  }
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>