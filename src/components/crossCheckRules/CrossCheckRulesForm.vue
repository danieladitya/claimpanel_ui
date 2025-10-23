<template>
  <Modal :show="show" @close="$emit('close')" size="xl">
    <template #title>
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-xl font-semibold text-gray-900">
            {{ isEditing ? 'Edit Cross Check Rule' : 'Buat Rule Pemeriksaan Silang Baru' }}
          </h3>
          <p class="mt-1 text-sm text-gray-500">
            Step {{ currentStep }} of {{ totalSteps }}: {{ stepTitle }}
          </p>
        </div>
        <div class="flex items-center space-x-2">
          <span class="text-sm text-gray-500">ID: {{ form.id || 'New' }}</span>
          <span :class="[
            'px-2 py-1 text-xs font-medium rounded-full',
            getRuleTypeBadgeClass(form.gc_required_type)
          ]">
            {{ getRuleTypeBadgeText(form.gc_required_type) }}
          </span>
        </div>
      </div>
    </template>

    <template #body>
      <!-- Progress Steps -->
      <div class="mb-8">
        <div class="flex justify-between">
          <div v-for="(step, index) in visibleSteps" :key="index" class="flex items-center">
            <div class="flex flex-col items-center">
              <div
                :class="[
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold',
                  currentStep > index + 1 ? 'bg-green-500 text-white' :
                  currentStep === index + 1 ? 'bg-blue-500 text-white' :
                  'bg-gray-200 text-gray-500'
                ]"
              >
                {{ currentStep > index + 1 ? '✓' : index + 1 }}
              </div>
              <span
                :class="[
                  'text-xs mt-1',
                  currentStep >= index + 1 ? 'text-blue-600 font-medium' : 'text-gray-500'
                ]"
              >
                {{ step }}
              </span>
            </div>
            <div
              v-if="index < visibleSteps.length - 1"
              :class="[
                'w-12 h-1 mx-2',
                currentStep > index + 1 ? 'bg-green-500' : 'bg-gray-200'
              ]"
            ></div>
          </div>
        </div>
      </div>

      <form @submit.prevent="submitForm" class="space-y-6">
        <!-- Step 1: Basic Information -->
        <div v-if="currentStep === 1" class="space-y-6">
          <div class="p-4 border border-blue-200 rounded-lg bg-blue-50">
            <div class="flex">
              <div class="flex-shrink-0">
                <InformationCircleIcon class="w-5 h-5 text-blue-400" />
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-blue-800">
                  Informasi Dasar Rule
                </h3>
                <p class="mt-1 text-sm text-blue-700">
                  Tentukan nama, deskripsi, dan jenis pemeriksaan rule.
                </p>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 gap-4">
            <div>
              <label class="block mb-1 text-sm font-medium text-gray-700">
                Nama Rule *
                <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.rule_name"
                type="text"
                required
                class="w-full px-3 py-2 transition-colors border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Contoh: Pemeriksaan Obat Diabetes / Kelengkapan Dokumen Hipertensi"
                maxlength="150"
              />
              <p class="mt-1 text-xs text-gray-500">
                Maksimal 150 karakter. Gunakan nama yang deskriptif.
              </p>
            </div>

            <div>
              <label class="block mb-1 text-sm font-medium text-gray-700">
                Tipe Pemeriksaan *
              </label>
              <div class="grid grid-cols-3 gap-4">
                <div
                  v-for="type in RULE_TYPE_OPTIONS"
                  :key="type.standardcode_id"
                  :class="[
                    'border rounded-lg p-4 cursor-pointer transition-all',
                    form.gc_required_type === type.standardcode_id
                      ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                      : 'border-gray-300 hover:border-gray-400'
                  ]"
                  @click="handleRuleTypeChange(type.standardcode_id)"
                >
                  <div class="flex items-center">
                    <div
                      :class="[
                        'w-4 h-4 rounded-full border mr-3',
                        form.gc_required_type === type.standardcode_id
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-400'
                      ]"
                    ></div>
                    <div>
                      <div class="font-medium text-gray-900">{{ type.standardcode_name }}</div>
                      <div class="mt-1 text-xs text-gray-500">
                        {{ getRuleTypeDescription(type.standardcode_id) }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label class="block mb-1 text-sm font-medium text-gray-700">
                Deskripsi Rule
                <span class="text-xs font-normal text-gray-500">(Opsional)</span>
              </label>
              <textarea
                v-model="form.rule_description"
                rows="3"
                class="w-full px-3 py-2 transition-colors border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Jelaskan tujuan dan kegunaan rule ini..."
                maxlength="500"
              />
              <p class="mt-1 text-xs text-gray-500">
                {{ form.rule_description?.length || 0 }}/500 karakter
              </p>
            </div>
          </div>
        </div>

        <!-- Step 2: Trigger Condition (Hanya untuk Conditional Rules) -->
        <div v-if="currentStep === 2 && !isUniversalRule" class="space-y-6">
      <div class="p-4 border border-blue-200 rounded-lg bg-blue-50">
        <div class="flex">
          <div class="flex-shrink-0">
            <LightningBoltIcon class="w-5 h-5 text-blue-400" />
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-blue-800">
              {{ isICDRule ? 'Kode ICD Pemicu (Kode A)' : 'Kondisi Pemicu' }}
            </h3>
            <p class="mt-1 text-sm text-blue-700">
              {{ isICDRule 
                ? 'Tentukan kode ICD diagnosis yang akan memicu pemeriksaan (Kode A).' 
                : 'Tentukan kode diagnosis atau prosedur yang akan memicu pemeriksaan ini.'
              }}
            </p>
          </div>
        </div>
      </div>

      <!-- DEBUG INFO -->
      <div class="p-2 bg-yellow-100 border border-yellow-300 rounded">
        <p class="text-sm text-yellow-800">
          Debug: isICDRule = {{ isICDRule }}, showICDSuggestions = {{ showICDSuggestions }}, trigger_code_id = "{{ form.trigger_code_id }}"
        </p>
      </div>
      
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700">
            Sistem Kode *
          </label>
          <select
            v-model="form.triger_gccode_system"
            required
            :class="[
              'w-full px-3 py-2 transition-colors border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500',
              triggerSystemError ? 'border-red-300' : 'border-gray-300'
            ]"
            @change="handleSystemChange"
          >
            <option value="">Pilih Sistem Kode</option>
            <option 
              v-for="system in CODE_SYSTEM_OPTIONS" 
              :key="system.standardcode_id" 
              :value="system.standardcode_id"
            >
              {{ system.standardcode_name }}
            </option>
          </select>
          <p v-if="triggerSystemError" class="mt-1 text-sm text-red-600">
            {{ triggerSystemError }}
          </p>
          <p class="mt-1 text-xs text-gray-500">
            {{ isICDRule 
              ? 'Standar sistem kode ICD yang digunakan' 
              : 'Standar sistem kode yang digunakan'
            }}
          </p>
        </div>
        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700">
            {{ isICDRule ? 'Kode ICD Pemicu (Kode A) *' : 'Kode Pemicu *' }}
            <span class="text-red-500">*</span>
          </label>
          
          <!-- Autocomplete ICD Search -->
          <div class="relative" v-if="isICDRule">
            <div class="flex space-x-2">
              <input
                v-model="form.trigger_code_id"
                type="text"
                required
                :class="[
                  'flex-1 px-3 py-2 transition-colors border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500',
                  triggerCodeError ? 'border-red-300' : 'border-gray-300'
                ]"
                placeholder="Ketik untuk mencari kode ICD..."
                @input="handleICDSearch"
                @focus="handleFocus"
                @blur="onTriggerCodeBlur"
                ref="icdInput"
              />
              <button
                type="button"
                @click="searchICDCode"
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

            <!-- ICD Suggestions Dropdown -->
            <div 
              v-if="showICDSuggestions && icdSuggestions.length > 0" 
              class="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto"
            >
              <div 
                v-for="icd in icdSuggestions" 
                :key="icd.code_id"
                class="px-3 py-2 cursor-pointer hover:bg-blue-50 border-b border-gray-100 last:border-b-0"
                @mousedown="selectICDCode(icd)"
              >
                <div class="flex justify-between items-start">
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
              
              <!-- Load More -->
              <div 
                v-if="icdPagination.hasMore" 
                class="px-3 py-2 text-center border-t border-gray-200"
              >
                <button
                  @click="loadMoreICD"
                  class="text-sm text-blue-600 hover:text-blue-800"
                  :disabled="searchingICD"
                >
                  {{ searchingICD ? 'Memuat...' : 'Muat lebih banyak' }}
                </button>
              </div>
            </div>

            <!-- No Results -->
            <div 
              v-if="showICDSuggestions && icdSearchQuery && icdSuggestions.length === 0 && !searchingICD" 
              class="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg"
            >
              <div class="px-3 py-4 text-center text-gray-500">
                Tidak ditemukan kode ICD untuk "{{ icdSearchQuery }}"
              </div>
            </div>
          </div>

          <!-- Regular Input untuk non-ICD -->
          <input
            v-else
            v-model="form.trigger_code_id"
            type="text"
            required
            :class="[
              'w-full px-3 py-2 transition-colors border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500',
              triggerCodeError ? 'border-red-300' : 'border-gray-300'
            ]"
            :placeholder="form.gc_required_type === 'X002^001' ? 'Contoh: E11, I10, A10' : 'Contoh: E11, I10 (diagnosis yang memerlukan dokumen)'"
            @blur="validateTriggerCode"
          />

          <p v-if="triggerCodeError" class="mt-1 text-sm text-red-600">
            {{ triggerCodeError }}
          </p>
          <p class="mt-1 text-xs text-gray-500">
            {{ isICDRule 
              ? 'Kode ICD diagnosis yang memicu rule (Kode A)' 
              : form.gc_required_type === 'X002^001' 
                ? 'Kode diagnosis atau prosedur yang memicu rule' 
                : 'Kode diagnosis yang memerlukan kelengkapan dokumen' 
            }}
          </p>
        </div>

        
      </div>

      <!-- Selected ICD Info -->
      <div v-if="isICDRule && selectedICDInfo" class="p-4 border border-green-200 rounded-lg bg-green-50">
        <div class="flex">
          <div class="flex-shrink-0">
            <CheckCircleIcon class="w-5 h-5 text-green-400" />
          </div>
          <div class="ml-3 flex-1">
            <div class="flex justify-between items-start">
              <h3 class="text-sm font-medium text-green-800">
                Kode ICD Terpilih
              </h3>
              <button
                type="button"
                @click="clearICDSelection"
                class="text-sm text-green-600 hover:text-green-800"
              >
                Hapus
              </button>
            </div>
            <div class="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p class="text-sm">
                  <span class="font-mono font-bold text-green-900 text-lg">{{ selectedICDInfo.code }}</span>
                  <span class="ml-2 text-xs text-green-700">({{ selectedICDInfo.code_id }})</span>
                </p>
                <p class="mt-1 text-sm text-green-700">{{ selectedICDInfo.description }}</p>
              </div>
              <div class="text-sm text-green-600">
                <p>Sistem: {{ selectedICDInfo.standardcode_name }}</p>
                <p>Status: 
                  <span :class="[
                    'px-2 py-1 text-xs rounded-full',
                    selectedICDInfo.valid_code === 1 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  ]">
                    {{ selectedICDInfo.valid_code === 1 ? 'Valid' : 'Tidak Valid' }}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ICD Code Validation (fallback) -->
      <div v-else-if="isICDRule && form.trigger_code_id" class="p-4 border border-green-200 rounded-lg bg-green-50">
        <div class="flex">
          <div class="flex-shrink-0">
            <CheckCircleIcon class="w-5 h-5 text-green-400" />
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-green-800">
              Validasi Kode ICD
            </h3>
            <p class="mt-1 text-sm text-green-700">
              Kode ICD <strong>{{ form.trigger_code_id }}</strong> akan memicu pemeriksaan untuk kode yang diperlukan.
            </p>
            <p class="mt-1 text-xs text-green-600">
              {{ getICDCodeDescription(form.trigger_code_id) }}
            </p>
          </div>
        </div>
      </div>

      <div class="p-4 rounded-lg bg-gray-50">
        <h4 class="mb-2 text-sm font-medium text-gray-900">
          {{ isICDRule ? 'Contoh Kode ICD Diagnosis:' : 'Contoh Kode Diagnosis:' }}
        </h4>
        <div class="space-y-1 text-sm text-gray-600">
          <div v-if="isICDRule">
            • <strong>E10-E14</strong> - Diabetes Mellitus<br>
            • <strong>I10-I15</strong> - Penyakit Hipertensi<br>
            • <strong>J40-J47</strong> - Penyakit Paru Obstruktif Kronik<br>
            • <strong>N17-N19</strong> - Gagal Ginjal
          </div>
          <div v-else>
            • <strong>E11</strong> - Diabetes Mellitus Tipe 2<br>
            • <strong>I10</strong> - Hipertensi Esensial<br>
            • <strong>J45</strong> - Asma<br>
            • <strong>N18</strong> - Penyakit Ginjal Kronik
          </div>
        </div>
      </div>
    </div>
        <!-- Step 3: Required Conditions -->
        <div v-if="currentStep === requiredConditionsStep" class="space-y-6">
          <div class="p-4 border border-blue-200 rounded-lg bg-blue-50">
            <div class="flex">
              <div class="flex-shrink-0">
                <CheckCircleIcon class="w-5 h-5 text-blue-400" />
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-blue-800">
                  {{ getRequiredConditionsTitle() }}
                </h3>
                <p class="mt-1 text-sm text-blue-700">
                  {{ getRequiredConditionsDescription() }}
                </p>
              </div>
            </div>
          </div>

          <!-- Universal Document Rule -->
          <div v-if="isUniversalRule" class="space-y-4">
            <div class="p-4 border border-green-200 rounded-lg bg-green-50">
              <div class="flex">
                <div class="flex-shrink-0">
                  <ExclamationIcon class="w-5 h-5 text-green-400" />
                </div>
                <div class="ml-3">
                  <h3 class="text-sm font-medium text-green-800">
                    Aturan Universal
                  </h3>
                  <p class="mt-1 text-sm text-green-700">
                    Dokumen ini wajib ada untuk SEMUA klaim, tanpa memandang diagnosis atau tindakan.
                  </p>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label class="block mb-1 text-sm font-medium text-gray-700">
                  Sistem Dokumen *
                </label>
                <select
                  v-model="form.required_code_system"
                  required
                  class="w-full px-3 py-2 transition-colors border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Pilih Sistem Dokumen</option>
                  <option value="DOC">Dokumen Medis</option>
                  <option value="ADMINISTRATIVE">Dokumen Administratif</option>
                </select>
                <p class="mt-1 text-xs text-gray-500">
                  Kategori dokumen yang diperlukan
                </p>
              </div>

              <div>
                <label class="block mb-1 text-sm font-medium text-gray-700">
                  Mode Pemeriksaan *
                </label>
                <select
                  v-model="form.gc_required_mode"
                  required
                  class="w-full px-3 py-2 transition-colors border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Pilih Mode Pemeriksaan</option>
                  <option 
                    v-for="mode in REQUIRED_MODE_OPTIONS" 
                    :key="mode.standardcode_id" 
                    :value="mode.standardcode_id"
                  >
                    {{ mode.standardcode_name }}
                  </option>
                </select>
                <p class="mt-1 text-xs text-gray-500">
                  Cara pemeriksaan dokumen yang diperlukan
                </p>
              </div>
            </div>

            <div>
              <label class="block mb-1 text-sm font-medium text-gray-700">
                Jenis Dokumen yang Diperlukan *
                <span class="text-red-500">*</span>
              </label>
              <div class="space-y-2">
                <div
                  v-for="(doc, index) in requiredDocuments"
                  :key="index"
                  class="flex items-center space-x-2"
                >
                  <select
                    v-model="requiredDocuments[index]"
                    required
                    class="flex-1 px-3 py-2 transition-colors border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Pilih Jenis Dokumen</option>
                    <option 
                      v-for="docType in UNIVERSAL_DOCUMENT_OPTIONS" 
                      :key="docType.value" 
                      :value="docType.value"
                    >
                      {{ docType.label }}
                    </option>
                  </select>
                  <button
                    type="button"
                    @click="removeRequiredDocument(index)"
                    class="p-2 text-red-500 transition-colors hover:text-red-700"
                    :disabled="requiredDocuments.length <= 1"
                  >
                    <TrashIcon class="w-4 h-4" />
                  </button>
                </div>
                
                <button
                  type="button"
                  @click="addRequiredDocument"
                  class="flex items-center text-sm text-blue-500 transition-colors hover:text-blue-700"
                >
                  <PlusIcon class="w-4 h-4 mr-1" />
                  Tambah Dokumen
                </button>
              </div>
              <p class="mt-2 text-xs text-gray-500">
                Mode <strong>{{ getModeDescription(form.gc_required_mode) }}</strong>
              </p>
            </div>
          </div>
          <!-- ICD Rule - Kode A memerlukan Kode B -->
          <div v-else-if="isICDRule" class="space-y-4">
            <div class="p-4 border border-purple-200 rounded-lg bg-purple-50">
              <div class="flex">
                <div class="flex-shrink-0">
                  <ShieldCheckIcon class="w-5 h-5 text-purple-400" />
                </div>
                <div class="ml-3">
                  <h3 class="text-sm font-medium text-purple-800">
                    Aturan ICD: Kode A → Kode B
                  </h3>
                  <p class="mt-1 text-sm text-purple-700">
                    Jika ditemukan <strong>Kode ICD {{ form.trigger_code_id }}</strong>, maka harus ada kode berikut:
                  </p>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label class="block mb-1 text-sm font-medium text-gray-700">
                  Sistem Kode yang Diperlukan *
                </label>
                <select
                  v-model="form.required_code_system"
                  required
                  class="w-full px-3 py-2 transition-colors border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Pilih Sistem Kode</option>
                  <option value="ATC">Kode ATC (Obat)</option>
                  <option value="CPT">Kode CPT (Tindakan)</option>
                  <option value="LOINC">Kode LOINC (Laboratorium)</option>
                  <option value="ICD">Kode ICD Lainnya</option>
                </select>
                <p class="mt-1 text-xs text-gray-500">
                  Sistem kode untuk item yang diperlukan (Kode B)
                </p>
              </div>

              <div>
                <label class="block mb-1 text-sm font-medium text-gray-700">
                  Mode Pemeriksaan *
                </label>
                <select
                  v-model="form.gc_required_mode"
                  required
                  class="w-full px-3 py-2 transition-colors border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Pilih Mode Pemeriksaan</option>
                  <option 
                    v-for="mode in REQUIRED_MODE_OPTIONS" 
                    :key="mode.standardcode_id" 
                    :value="mode.standardcode_id"
                  >
                    {{ mode.standardcode_name }}
                  </option>
                </select>
                <p class="mt-1 text-xs text-gray-500">
                  Cara pemeriksaan kode yang diperlukan
                </p>
              </div>

              <div>
                <label class="block mb-1 text-sm font-medium text-gray-700">
                  Jumlah Minimum
                  <span class="text-xs font-normal text-gray-500">(Opsional)</span>
                </label>
                <input
                  v-model="form.required_n"
                  type="number"
                  min="1"
                  class="w-full px-3 py-2 transition-colors border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p class="mt-1 text-xs text-gray-500">
                  Minimal berapa kode yang harus ada
                </p>
              </div>
            </div>

            <!-- INPUT KODE B YANG DIPERLUKAN - INI YANG PERLU DITAMBAHKAN -->
            <div>
              <label class="block mb-1 text-sm font-medium text-gray-700">
                Kode yang Diperlukan (Kode B) *
                <span class="text-red-500">*</span>
              </label>
              <div class="space-y-3">
                <div
                  v-for="(code, index) in requiredCodes"
                  :key="index"
                  class="flex items-center p-3 space-x-2 border border-gray-200 rounded-lg"
                >
                  <div class="grid flex-1 grid-cols-2 gap-2">
                    <div>
                      <label class="block mb-1 text-xs font-medium text-gray-600">Kode</label>
                      <input
                        v-model="requiredCodes[index]"
                        type="text"
                        required
                        :class="[
                          'w-full px-3 py-2 text-sm transition-colors border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500',
                          requiredCodeErrors[index] ? 'border-red-300' : 'border-gray-300'
                        ]"
                        placeholder="Masukkan kode"
                        @blur="validateRequiredCode(index)"
                      />
                      <p v-if="requiredCodeErrors[index]" class="mt-1 text-xs text-red-600">
                        {{ requiredCodeErrors[index] }}
                      </p>
                    </div>
                    <div>
                      <label class="block mb-1 text-xs font-medium text-gray-600">Deskripsi</label>
                      <input
                        v-model="requiredCodeDescriptions[index]"
                        type="text"
                        class="w-full px-3 py-2 text-sm transition-colors border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Deskripsi kode"
                        @blur="autoFillDescription(index)"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    @click="removeRequiredCode(index)"
                    class="p-2 text-red-500 transition-colors hover:text-red-700"
                    :disabled="requiredCodes.length <= 1"
                  >
                    <TrashIcon class="w-4 h-4" />
                  </button>
                </div>
                
                <button
                  type="button"
                  @click="addRequiredCode"
                  class="flex items-center text-sm text-blue-500 transition-colors hover:text-blue-700"
                >
                  <PlusIcon class="w-4 h-4 mr-1" />
                  Tambah Kode
                </button>
              </div>
              <p class="mt-2 text-xs text-gray-500">
                Mode <strong>{{ getModeDescription(form.gc_required_mode) }}</strong>
                • Kode A (<strong>{{ form.trigger_code_id }}</strong>) memerlukan Kode B di atas
              </p>
            </div>

            <!-- ICD Rule Examples -->
            <div class="p-4 border border-yellow-200 rounded-lg bg-yellow-50">
              <div class="flex">
                <div class="flex-shrink-0">
                  <ExclamationIcon class="w-5 h-5 text-yellow-400" />
                </div>
                <div class="ml-3">
                  <h3 class="text-sm font-medium text-yellow-800">
                    Contoh Aturan ICD: Kode A → Kode B
                  </h3>
                  <div class="mt-2 space-y-2 text-sm text-yellow-700">
                    <p><strong>Diabetes (E11)</strong> → <code>A10BA</code> (Metformin), <code>A10BB</code> (Sulfonylurea)</p>
                    <p><strong>Hipertensi (I10)</strong> → <code>C09CA</code> (ACE Inhibitor), <code>C07AB</code> (Beta Blocker)</p>
                    <p><strong>Infeksi Saluran Kemih (N39.0)</strong> → <code>J01CA</code> (Antibiotik), <code>LOINC: 630-4</code> (Urinalisis)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          
          <!-- Conditional Rules -->
          
          <div v-else>
            <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label class="block mb-1 text-sm font-medium text-gray-700">
                  {{ form.gc_required_type === 'X002^001' ? 'Sistem Kode yang Diperlukan *' : 'Sistem Dokumen *' }}
                </label>
                <input
                  v-if="form.gc_required_type === 'X002^001'"
                  v-model="form.required_code_system"
                  type="text"
                  required
                  class="w-full px-3 py-2 transition-colors border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Contoh: ATC, CPT, LOINC"
                />
                <select
                  v-else
                  v-model="form.required_code_system"
                  required
                  class="w-full px-3 py-2 transition-colors border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Pilih Sistem Dokumen</option>
                  <option value="DOC">Dokumen Medis</option>
                  <option value="MEDICAL_RECORD">Rekam Medis</option>
                  <option value="LAB_RESULT">Hasil Laboratorium</option>
                  <option value="RADIOLOGY">Hasil Radiologi</option>
                </select>
                <p class="mt-1 text-xs text-gray-500">
                  {{ form.gc_required_type === 'X002^001' 
                    ? 'Sistem kode untuk item yang diperlukan' 
                    : 'Kategori dokumen yang diperlukan'
                  }}
                </p>
              </div>

              <div>
                <label class="block mb-1 text-sm font-medium text-gray-700">
                  Mode Pemeriksaan *
                </label>
                <select
                  v-model="form.gc_required_mode"
                  required
                  class="w-full px-3 py-2 transition-colors border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Pilih Mode Pemeriksaan</option>
                  <option 
                    v-for="mode in REQUIRED_MODE_OPTIONS" 
                    :key="mode.standardcode_id" 
                    :value="mode.standardcode_id"
                  >
                    {{ mode.standardcode_name }}
                  </option>
                </select>
                <p class="mt-1 text-xs text-gray-500">
                  Cara pemeriksaan {{ form.gc_required_type === 'X002^001' ? 'kode' : 'dokumen' }} yang diperlukan
                </p>
              </div>

              <div>
                <label class="block mb-1 text-sm font-medium text-gray-700">
                  Jumlah Minimum
                  <span class="text-xs font-normal text-gray-500">(Opsional)</span>
                </label>
                <input
                  v-model="form.required_n"
                  type="number"
                  min="1"
                  class="w-full px-3 py-2 transition-colors border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p class="mt-1 text-xs text-gray-500">
                  Minimal berapa {{ form.gc_required_type === 'X002^001'  ? 'item' : 'dokumen' }} yang harus ada
                </p>
              </div>
            </div>

            <div>
              <label class="block mb-1 text-sm font-medium text-gray-700">
                {{ form.gc_required_type === 'X002^001'  ? 'Kode yang Diperlukan *' : 'Jenis Dokumen yang Diperlukan *' }}
                <span class="text-red-500">*</span>
              </label>
              <div class="space-y-2">
                <div
                  v-for="(code, index) in requiredCodes"
                  :key="index"
                  class="flex items-center space-x-2"
                >
                  <input
                    v-if="form.gc_required_type === 'X002^001'"
                    v-model="requiredCodes[index]"
                    type="text"
                    required
                    class="flex-1 px-3 py-2 transition-colors border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Masukkan kode medis"
                  />
                  <select
                    v-else
                    v-model="requiredCodes[index]"
                    required
                    class="flex-1 px-3 py-2 transition-colors border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Pilih Jenis Dokumen</option>
                    <option 
                      v-for="docType in DOCUMENT_TYPE_OPTIONS" 
                      :key="docType.standardcode_id" 
                      :value="docType.standardcode_id"
                    >
                      {{ docType.standardcode_name }}
                    </option>
                  </select>
                  <button
                    type="button"
                    @click="removeRequiredCode(index)"
                    class="p-2 text-red-500 transition-colors hover:text-red-700"
                    :disabled="requiredCodes.length <= 1"
                  >
                    <TrashIcon class="w-4 h-4" />
                  </button>
                </div>
                
                <button
                  type="button"
                  @click="addRequiredCode"
                  class="flex items-center text-sm text-blue-500 transition-colors hover:text-blue-700"
                >
                  <PlusIcon class="w-4 h-4 mr-1" />
                  Tambah {{ form.gc_required_type === 'X002^001' ? 'Kode' : 'Dokumen' }}
                </button>
              </div>
              <p class="mt-2 text-xs text-gray-500">
                Mode <strong>{{ getModeDescription(form.gc_required_mode) }}</strong>
              </p>
            </div>
          </div>
        </div>

        <!-- Step 4: Rule Configuration & Summary -->
        <!-- Step 4: Rule Configuration & Summary -->
        <div v-if="currentStep === 4" class="space-y-6">
          <div class="p-4 border border-blue-200 rounded-lg bg-blue-50">
            <div class="flex">
              <div class="flex-shrink-0">
                <CogIcon class="w-5 h-5 text-blue-400" />
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-blue-800">
                  Konfigurasi Rule & Ringkasan
                </h3>
                <p class="mt-1 text-sm text-blue-700">
                  Tinjau kembali rule yang telah dibuat dan tentukan konfigurasi akhir.
                </p>
              </div>
            </div>
          </div>

          <!-- ICD Rule Specific Summary -->
          <div v-if="isICDRule" class="bg-white border border-purple-200 rounded-lg shadow-sm">
            <div class="px-6 py-4 border-b border-purple-200 bg-purple-50">
              <h4 class="text-lg font-semibold text-purple-900">🧬 Ringkasan Aturan ICD</h4>
              <p class="mt-1 text-sm text-purple-700">Aturan: Kode A → Harus ada Kode B</p>
            </div>
            
            <div class="p-6 space-y-4">
              <div class="flex items-center justify-between py-3 border-b border-gray-100">
                <span class="text-sm font-medium text-gray-700">Jenis Aturan:</span>
                <span class="px-3 py-1 text-sm font-medium text-purple-800 bg-purple-100 rounded-full">
                  🧬 ICD Code Validation
                </span>
              </div>

              <div class="grid grid-cols-2 gap-6">
                <div class="space-y-3">
                  <div class="p-3 border border-blue-200 rounded-lg bg-blue-50">
                    <p class="text-sm font-medium text-blue-800">🎯 Kode Pemicu (Kode A)</p>
                    <p class="mt-1 text-lg font-bold text-blue-900">{{ form.trigger_code_id }}</p>
                    <p class="text-xs text-blue-700">{{ getICDCodeDescription(form.trigger_code_id) }}</p>
                    <p class="mt-1 text-xs text-blue-600">
                      Sistem: {{ getCodeSystemLabel(form.triger_gccode_system) }}
                    </p>
                  </div>
                </div>

                <div class="space-y-3">
                  <div class="p-3 border border-green-200 rounded-lg bg-green-50">
                    <p class="text-sm font-medium text-green-800">✅ Kode Diperlukan (Kode B)</p>
                    <div class="mt-2 space-y-2">
                      <div
                        v-for="(code, index) in requiredCodes.filter(c => c.trim())"
                        :key="index"
                        class="flex items-center justify-between p-2 bg-green-100 rounded"
                      >
                        <div>
                          <code class="font-mono text-sm text-green-800">{{ code }}</code>
                          <p class="text-xs text-green-600">{{ requiredCodeDescriptions[index] }}</p>
                        </div>
                        <span class="px-2 py-1 text-xs text-green-700 bg-green-200 rounded">
                          {{ form.required_code_system }}
                        </span>
                      </div>
                    </div>
                    <p class="mt-2 text-xs text-green-700">
                      Mode: <strong>{{ getModeDescription(form.gc_required_mode) }}</strong>
                      <span v-if="form.required_n > 1"> • Minimal {{ form.required_n }} kode</span>
                    </p>
                  </div>
                </div>
              </div>

              <div class="p-3 border border-purple-200 rounded-lg bg-purple-50">
                <p class="text-sm font-medium text-purple-800">🔗 Logika Aturan</p>
                <p class="mt-1 text-sm text-purple-700">
                  <strong>JIKA</strong> ditemukan diagnosis 
                  <strong>{{ form.trigger_code_id }} ({{ getICDCodeDescription(form.trigger_code_id) }})</strong>
                  <strong>MAKA</strong> harus ada 
                  <strong>{{ requiredCodes.filter(c => c.trim()).length }} kode</strong> dari sistem 
                  <strong>{{ form.required_code_system }}</strong>
                </p>
              </div>
            </div>
          </div>

          <!-- Configuration untuk semua rule types -->
          <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
            <!-- Severity Configuration -->
            <div class="p-4 rounded-lg bg-gray-50">
              <h5 class="mb-3 text-sm font-medium text-gray-900">Tingkat Keparahan *</h5>
              <div class="space-y-2">
                <div
                  v-for="severity in SEVERITY_OPTIONS"
                  :key="severity.standardcode_id"
                  :class="[
                    'border rounded-lg p-3 cursor-pointer transition-all',
                    form.gc_severity === severity.standardcode_id
                      ? 'border-red-500 bg-red-50 ring-2 ring-red-200'
                      : 'border-gray-300 hover:border-gray-400'
                  ]"
                  @click="form.gc_severity = severity.standardcode_id"
                >
                  <div class="flex items-center">
                    <div
                      :class="[
                        'w-4 h-4 rounded-full border mr-3',
                        form.gc_severity === severity.standardcode_id
                          ? 'border-red-500 bg-red-500'
                          : 'border-gray-400'
                      ]"
                    ></div>
                    <div>
                      <div class="font-medium text-gray-900">{{ severity.standardcode_name }}</div>
                      <div class="mt-1 text-xs text-gray-500">
                        {{ getSeverityDescription(severity.standardcode_id) }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Status Configuration -->
            <div class="p-4 rounded-lg bg-gray-50">
              <h5 class="mb-3 text-sm font-medium text-gray-900">Status Rule</h5>
              <div class="space-y-2">
                <div
                  v-for="status in STATUS_OPTIONS.filter(s => s.value !== '')"
                  :key="status.value"
                  :class="[
                    'border rounded-lg p-3 cursor-pointer transition-all',
                    form.active === (status.value === 'true')
                      ? 'border-green-500 bg-green-50 ring-2 ring-green-200'
                      : 'border-gray-300 hover:border-gray-400'
                  ]"
                  @click="form.active = status.value === 'true'"
                >
                  <div class="flex items-center">
                    <div
                      :class="[
                        'w-4 h-4 rounded-full border mr-3',
                        form.active === (status.value === 'true')
                          ? 'border-green-500 bg-green-500'
                          : 'border-gray-400'
                      ]"
                    ></div>
                    <div>
                      <div class="font-medium text-gray-900">{{ status.label }}</div>
                      <div class="mt-1 text-xs text-gray-500">
                        {{ status.value === 'true' ? 'Rule akan dijalankan' : 'Rule tidak aktif' }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Additional Configuration -->
          <div class="space-y-4">
            <div>
              <label class="block mb-1 text-sm font-medium text-gray-700">
                Pesan Error *
                <span class="text-red-500">*</span>
              </label>
              <textarea
                v-model="form.message"
                required
                rows="3"
                class="w-full px-3 py-2 transition-colors border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                :placeholder="getMessagePlaceholder()"
                @input="updateMessageSuggestions"
              />
              <p class="mt-1 text-xs text-gray-500">
                Pesan yang akan ditampilkan ketika rule tidak terpenuhi
              </p>
              
              <!-- Message Suggestions -->
              <div v-if="messageSuggestions.length > 0" class="mt-2 space-y-1">
                <p class="text-xs text-gray-600">Contoh pesan:</p>
                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="suggestion in messageSuggestions"
                    :key="suggestion"
                    @click="form.message = suggestion"
                    class="px-2 py-1 text-xs text-gray-700 transition-colors bg-gray-100 rounded hover:bg-gray-200"
                  >
                    {{ suggestion }}
                  </button>
                </div>
              </div>
            </div>

            <div v-if="!isUniversalRule">
              <label class="block mb-1 text-sm font-medium text-gray-700">
                Kondisi Tambahan
                <span class="text-xs font-normal text-gray-500">(Opsional)</span>
              </label>
              <textarea
                v-model="conditionJson"
                rows="4"
                :class="[
                  'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors font-mono text-sm',
                  jsonError.condition_json ? 'border-red-300' : 'border-gray-300'
                ]"
                placeholder='Contoh: {"age": {"min": 18}, "gender": "male"}'
              />
              <p v-if="jsonError.condition_json" class="mt-1 text-sm text-red-600">
                {{ jsonError.condition_json }}
              </p>
              <p class="mt-1 text-xs text-gray-500">
                Kondisi tambahan dalam format JSON (opsional)
              </p>
            </div>
          </div>

          <!-- Final Validation -->
          <div v-if="!isFormValid" class="p-4 border border-red-200 rounded-lg bg-red-50">
            <div class="flex">
              <div class="flex-shrink-0">
                <ExclamationIcon class="w-5 h-5 text-red-400" />
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-red-800">
                  Perhatian
                </h3>
                <p class="mt-1 text-sm text-red-700">
                  Beberapa field wajib belum terisi. Silakan periksa kembali form Anda.
                </p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </template>

    <template #footer>
      <div class="flex justify-between w-full">
        <button
          type="button"
          @click="prevStep"
          v-if="currentStep > 1"
          class="px-4 py-2 text-gray-600 transition-colors border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Sebelumnya
        </button>
        <div v-else></div>

        <div class="flex space-x-3">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 text-gray-600 transition-colors border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Batal
          </button>
          
          <button
            type="button"
            @click="nextStep"
            v-if="currentStep < totalSteps"
            class="px-4 py-2 text-white transition-colors bg-blue-500 rounded-md hover:bg-blue-600"
          >
            Lanjut
          </button>
          
          <button
            type="button"
            @click="submitForm"
            v-else
            :disabled="submitting || !isFormValid"
            class="px-4 py-2 text-white transition-colors bg-green-500 rounded-md hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="submitting" class="inline-flex items-center">
              <svg class="w-4 h-4 mr-2 -ml-1 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Menyimpan...
            </span>
            <span v-else>
              {{ isEditing ? 'Update Rule' : 'Buat Rule' }}
            </span>
          </button>
        </div>
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import Modal from '@/components/ui/Modal.vue';
import api from '@/services/api';

// Interfaces
interface CrossCheckRuleRequest {
  id?: string;
  rule_no?: string;
  rule_name?: string;
  rule_description?: string;
  gc_required_type?: string;
  trigger_code_id?: string;
  triger_gccode_system?: string;
  required_code_system?: string;
  gc_required_mode?: string;
  required_n: number;
  required_codes?: string[];
  message?: string;
  gc_severity?: string;
  condition_json?: any;
  active?: boolean;
  created_by?: number;
  updated_by?: number;
}

interface IStandardcode {
  standardcode_id: string;
  is_active: number;
  update_date: any;
  created_date: string;
  standardcode_name: string;
  parent_id: string;
  tag_property: any;
}

interface DocumentOption {
  value: string;
  label: string;
}

interface StatusOption {
  value: string;
  label: string;
}

// Constants
const STATUS_OPTIONS: StatusOption[] = [
  { value: 'true', label: 'Aktif' },
  { value: 'false', label: 'Non-Aktif' }
];

const INITIAL_RULE: CrossCheckRuleRequest = {
  rule_name: '',
  rule_description: '',
  gc_required_type: '',
  trigger_code_id: '',
  triger_gccode_system: '',
  required_code_system: '',
  gc_required_mode: '',
  required_n: 1,
  required_codes: [],
  message: '',
  gc_severity: '',
  condition_json: {},
  active: true,
  created_by: 0,
  updated_by: 0
};
const icdInput = ref<HTMLInputElement>();
  const handleFocus = (event: FocusEvent) => {
  console.log('🔵 FOCUS EVENT TRIGGERED', event);
  console.log('🔵 Current showICDSuggestions before:', showICDSuggestions.value);
  
  showICDSuggestions.value = true;
  
  console.log('🔵 Current showICDSuggestions after:', showICDSuggestions.value);
  
  // Jika sudah ada query, tampilkan suggestions
  if (form.value.trigger_code_id && form.value.trigger_code_id.length >= 2) {
    searchICDCode(form.value.trigger_code_id, true);
  }
};


// Tambahan state untuk ICD Search
const icdSuggestions = ref<any[]>([]);
const showICDSuggestions = ref(false);
const searchingICD = ref(false);
const icdSearchQuery = ref('');
const selectedICDInfo = ref<any>(null);
const icdPagination = ref({
  skip: 0,
  limit: 20,
  total: 0,
  hasMore: false
});

// Reference data
const RULE_TYPE_OPTIONS = ref<IStandardcode[]>([]);
const SEVERITY_OPTIONS = ref<IStandardcode[]>([]);
const CODE_SYSTEM_OPTIONS = ref<IStandardcode[]>([]);
const REQUIRED_MODE_OPTIONS = ref<IStandardcode[]>([]);
const DOCUMENT_TYPE_OPTIONS = ref<IStandardcode[]>([]);

// Universal document options
const UNIVERSAL_DOCUMENT_OPTIONS = ref<DocumentOption[]>([
  { value: 'SEP', label: 'Surat Eligibilitas Pasien (SEP)' },
  { value: 'IDENTITY_CARD', label: 'Kartu Identitas Pasien' },
  { value: 'INSURANCE_CARD', label: 'Kartu Asuransi' },
  { value: 'REFERRAL_LETTER', label: 'Surat Rujukan' },
  { value: 'CONSENT_FORM', label: 'Form Persetujuan Tindakan' },
  { value: 'ADMISSION_FORM', label: 'Form Pendaftaran' },
  { value: 'MEDICAL_RECORD', label: 'Rekam Medis' },
  { value: 'LAB_RESULT', label: 'Hasil Laboratorium' },
  { value: 'RADIOLOGY_REPORT', label: 'Laporan Radiologi' }
]);

const triggerCodeError = ref('');
const triggerSystemError = ref('');
const requiredCodeErrors = ref<string[]>([]);
const requiredCodeDescriptions = ref<string[]>(['']);
const icdCodeCache = ref<{[key: string]: string}>({});

//tambahan baru
// Computed properties tambahan// Computed properties tambahan
const isICDRule = computed(() => {
  return form.value.gc_required_type === 'X002^001' &&
         (form.value.triger_gccode_system?.startsWith('X678') || 
          /ICD/i.test(form.value.triger_gccode_system || ''));
});

 // Methods untuk ICD Search
// Methods untuk ICD Search - PERBAIKI DENGAN DEBOUNCE
const handleICDSearch = async (event: Event) => {
  console.log('🟡 INPUT EVENT TRIGGERED', event);
  const query = (event.target as HTMLInputElement).value;
  icdSearchQuery.value = query;
  
  console.log('🟡 Query:', query);
  console.log('🟡 Current showICDSuggestions:', showICDSuggestions.value);
  
  if (query.length < 2) {
    icdSuggestions.value = [];
    showICDSuggestions.value = false;
    return;
  }

  // Pastikan suggestions ditampilkan
  if (!showICDSuggestions.value) {
    showICDSuggestions.value = true;
  }
  await searchICDCode(query);
};

const searchICDCode = async (query?: string, isAutoSearch: boolean = false) => {
  const searchQuery = query || icdSearchQuery.value || form.value.trigger_code_id;

  if (!searchQuery || searchQuery.length < 2) {
    triggerCodeError.value = 'Masukkan minimal 2 karakter untuk pencarian';
    return;
  }

  // ⛔ Kalau user belum pilih sistem kode, beri peringatan
  if (!form.value.triger_gccode_system) {
    triggerSystemError.value = 'Pilih sistem kode terlebih dahulu';
    showICDSuggestions.value = false;
    return;
  }

  searchingICD.value = true;
  triggerSystemError.value = '';

  try {
    const encodedSystem = encodeURIComponent(form.value.triger_gccode_system);
    const encodedKeyword = encodeURIComponent(searchQuery);

    console.log(`🔍 Searching ICD [${encodedSystem}] with keyword "${searchQuery}"`);
    
    const response = await api.get(
      `/reference/icd?gccode_system=${encodedSystem}&keyword=${encodedKeyword}&skip=0&limit=${icdPagination.value.limit}`
    );

    if (response.data.success && response.data.data) {
      const data = response.data.data;
      icdSuggestions.value = data.items || [];
      icdPagination.value = {
        skip: data.skip || 0,
        limit: data.limit || 20,
        total: data.total || 0,
        hasMore: (data.skip + data.limit) < data.total
      };
      showICDSuggestions.value = true;
    } else {
      icdSuggestions.value = [];
    }
  } catch (error) {
    console.error('Error searching ICD codes:', error);
    triggerCodeError.value = 'Gagal mencari kode ICD';
  } finally {
    searchingICD.value = false;
  }
};


const loadMoreICD = async () => {
  if (searchingICD.value || !icdPagination.value.hasMore) return;

  searchingICD.value = true;
  icdPagination.value.skip += icdPagination.value.limit;

  try {
    const encodedSystem = encodeURIComponent(form.value.triger_gccode_system);
    const encodedKeyword = encodeURIComponent(icdSearchQuery.value);
    
    const response = await api.get(
      `/reference/icd?gccode_system=${encodedSystem}&keyword=${encodedKeyword}&skip=${icdPagination.value.skip}&limit=${icdPagination.value.limit}`
    );

    if (response.data.success && response.data.data) {
      const newItems = response.data.data.items || [];
      icdSuggestions.value = [...icdSuggestions.value, ...newItems];
      icdPagination.value.hasMore = 
        (icdPagination.value.skip + icdPagination.value.limit) < response.data.data.total;
    }
  } catch (error) {
    console.error('Error loading more ICD codes:', error);
  } finally {
    searchingICD.value = false;
  }
};
const onTriggerCodeBlur = () => {
  console.log('🔴 BLUR EVENT TRIGGERED');
  console.log('🔴 Current showICDSuggestions before:', showICDSuggestions.value);
  
  // Delay hiding suggestions to allow click selection
  setTimeout(() => {
    showICDSuggestions.value = false;
    console.log('🔴 Current showICDSuggestions after timeout:', showICDSuggestions.value);
  }, 200);
};

const handleSystemChange = () => {
  validateTriggerSystem();
  
  // Reset ICD search ketika sistem berubah
  if (isICDRule.value) {
    icdSuggestions.value = [];
    selectedICDInfo.value = null;
    form.value.trigger_code_id = '';
    if (form.value.trigger_code_id) {
      // Trigger search ulang dengan kode yang sudah ada
      searchICDCode(form.value.trigger_code_id);
    }
  }
};

const clearICDSelection = () => {
  selectedICDInfo.value = null;
  form.value.trigger_code_id = '';
  icdSuggestions.value = [];
  showICDSuggestions.value = false;
};

const selectICDCode = (icd: any) => {
  console.log('ICD code selected:', icd); // Debug log
  form.value.trigger_code_id = icd.code;
  selectedICDInfo.value = icd;
  showICDSuggestions.value = false;
  triggerCodeError.value = '';
  
  // Auto-fill description jika kosong
  if (!form.value.rule_description) {
    form.value.rule_description = `Rule untuk diagnosis ${icd.description} (${icd.code})`;
  }
  
  updateMessageSuggestions();
};


const canProceedToNextStep = computed(() => {
  switch (currentStep.value) {
    case 1:
      return form.value.rule_name?.trim() && form.value.gc_required_type;
    case 2:
      if (isUniversalRule.value) return true;
      return form.value.trigger_code_id?.trim() && 
             form.value.triger_gccode_system && 
             !triggerCodeError.value && 
             !triggerSystemError.value;
    case requiredConditionsStep.value:
      return form.value.required_code_system?.trim() && 
             form.value.gc_required_mode && 
             requiredCodes.value.some(code => code.trim()) &&
             !requiredCodeErrors.value.some(error => error);
    default:
      return true;
  }
});

// Update existing methods
const validateTriggerCode = () => {
  if (!form.value.trigger_code_id?.trim()) {
    triggerCodeError.value = 'Kode pemicu harus diisi';
    return;
  }

  if (isICDRule.value) {
    // Jika ada selected ICD info, gunakan validasi dari server
    if (selectedICDInfo.value) {
      if (selectedICDInfo.value.valid_code !== 1) {
        triggerCodeError.value = 'Kode ICD tidak valid menurut sistem';
        return;
      }
    } else {
      // Fallback validation untuk manual input
      const icdPattern = /^[A-TV-Z][0-9][0-9A-Z](\.[0-9A-Z]{1,4})?$/;
      if (!icdPattern.test(form.value.trigger_code_id)) {
        triggerCodeError.value = 'Format kode ICD tidak valid. Contoh: E11, I10, A01.0';
        return;
      }
    }
  }

  triggerCodeError.value = '';
};


const validateTriggerSystem = () => {
  if (!form.value.triger_gccode_system) {
    triggerSystemError.value = 'Sistem kode harus dipilih';
    return;
  }

  if (isICDRule.value && !form.value.triger_gccode_system.includes('ICD')) {
    triggerSystemError.value = 'Untuk aturan ICD, sistem kode harus ICD';
    return;
  }

  triggerSystemError.value = '';
};


const validateRequiredCode = (index: number) => {
  const code = requiredCodes.value[index];
  if (!code?.trim()) {
    requiredCodeErrors.value[index] = 'Kode diperlukan harus diisi';
    return;
  }

  // Validasi berdasarkan sistem kode
  if (form.value.required_code_system === 'ATC') {
    const atcPattern = /^[A-Z][0-9]{2}[A-Z][A-Z]$/;
    if (!atcPattern.test(code)) {
      requiredCodeErrors.value[index] = 'Format kode ATC tidak valid. Contoh: A10BA';
    }
  } else if (form.value.required_code_system === 'CPT') {
    const cptPattern = /^\d{5}$/;
    if (!cptPattern.test(code)) {
      requiredCodeErrors.value[index] = 'Format kode CPT tidak valid. Contoh: 99213';
    }
  }

  requiredCodeErrors.value[index] = '';
};
// Update getICDCodeDescription untuk menggunakan data dari server
const getICDCodeDescription = (code: string): string => {
  // Jika ada selected ICD info, gunakan description dari server
  if (selectedICDInfo.value && selectedICDInfo.value.code === code) {
    return selectedICDInfo.value.description;
  }
  
  // Fallback ke hardcoded descriptions
  const descriptions: {[key: string]: string} = {
    'E10': 'Diabetes mellitus tergantung insulin',
    'E11': 'Diabetes mellitus tidak tergantung insulin', 
    'I10': 'Hipertensi esensial (primer)',
    'J45': 'Asma',
    'N18': 'Penyakit ginjal kronik',
    'A01': 'Demam tifoid dan paratifoid'
  };
  
  const baseCode = code.split('.')[0];
  return descriptions[baseCode] || descriptions[code] || 'Kode diagnosis ICD';
};



const autoFillDescription = (index: number) => {
  const code = requiredCodes.value[index];
  if (!code?.trim() || requiredCodeDescriptions.value[index]?.trim()) return;

  // Auto-fill description berdasarkan sistem kode
  const descriptions: {[key: string]: {[key: string]: string}} = {
    'ATC': {
      'A10BA': 'Biguanides (Metformin)',
      'A10BB': 'Sulfonamides, urea derivatives',
      'C07AB': 'Beta blocking agents, selective',
      'C09CA': 'ACE inhibitors, plain',
      'J01CA': 'Penicillins with extended spectrum'
    },
    'CPT': {
      '99213': 'Office visit, established patient',
      '99214': 'Office visit, established patient',
      '80048': 'Basic metabolic panel',
      '85025': 'Complete blood count'
    },
    'LOINC': {
      '630-4': 'Bacteria identified in Urine by Culture',
      '4548-4': 'Hemoglobin A1c/Hemoglobin.total in Blood',
      '2160-0': 'Creatinine Serum/Plasma'
    }
  };

  const systemDescriptions = descriptions[form.value.required_code_system || ''];
  if (systemDescriptions && systemDescriptions[code]) {
    requiredCodeDescriptions.value[index] = systemDescriptions[code];
  }
};
const ShieldCheckIcon = { 
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>` 
};

//end tambahan baru

// API function
async function getReferenceByParent(parentId: string, target: any) {
  try {
    const response = await api.get(`/reference/code?parent_id=${parentId}`)
    if (response.data && Array.isArray(response.data.data)) {
      target.value = response.data.data
    } else {
      console.warn(`No data found for ${parentId}`)
      target.value = []
    }
  } catch (error) {
    console.error(`Error fetching ${parentId}:`, error)
    target.value = []
  }
}

// Lifecycle
onMounted(() => {
  getReferenceByParent('X002', RULE_TYPE_OPTIONS)       // Rule Required Type
  getReferenceByParent('X004', SEVERITY_OPTIONS)        // Rule Severity
  getReferenceByParent('X678', CODE_SYSTEM_OPTIONS)     // Code System
  getReferenceByParent('X003', REQUIRED_MODE_OPTIONS)   // Rule Required Mode
  getReferenceByParent('X001', DOCUMENT_TYPE_OPTIONS)   // Document Type (Claim Item Type)
});

// Icons (simplified)
const InformationCircleIcon = { template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"/></svg>` }
const LightningBoltIcon = { template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>` }
const CheckCircleIcon = { template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>` }
const CogIcon = { template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15a3 3 0 100-6 3 3 0 000 6z"/></svg>` }
const ExclamationIcon = { template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"/></svg>` }
const PlusIcon = { template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>` }
const TrashIcon = { template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>` }

const props = defineProps({
  show: Boolean,
  rule: {
    type: Object as () => CrossCheckRuleRequest | null,
    default: null
  },
  isEditing: Boolean,
  submitting: Boolean
})

const emit = defineEmits(['save', 'close'])

// Form state
const form = ref<CrossCheckRuleRequest>({ ...INITIAL_RULE })
const currentStep = ref(1)
const requiredCodes = ref<string[]>([''])
const jsonError = ref({
  condition_json: ''
})
const messageSuggestions = ref<string[]>([])

// Steps configuration
const steps = ref([
  'Informasi Dasar',
  'Kondisi Pemicu',
  'Yang Diperlukan',
  'Ringkasan & Konfigurasi'
])

// Computed properties
const isUniversalRule = computed(() => {
  return form.value.gc_required_type === 'X002^003';
});

const visibleSteps = computed(() => {
  if (isUniversalRule.value) {
    return ['Informasi Dasar', 'Yang Diperlukan', 'Ringkasan & Konfigurasi'];
  }
  return steps.value;
});

const totalSteps = computed(() => {
  return visibleSteps.value.length;
});

const requiredConditionsStep = computed(() => {
  return isUniversalRule.value ? 2 : 3;
});

const requiredDocuments = computed({
  get: () => requiredCodes.value,
  set: (value) => requiredCodes.value = value
});

const stepTitle = computed(() => {
  if (currentStep.value === requiredConditionsStep.value) {
    if (isUniversalRule.value) return 'Dokumen Wajib Universal';
    return form.value.gc_required_type === 'X002^001' ? 'Kode Diperlukan' : 'Dokumen Diperlukan';
  }
  return visibleSteps.value[currentStep.value - 1];
});

const conditionJson = computed({
  get: () => {
    return form.value.condition_json 
      ? JSON.stringify(form.value.condition_json, null, 2)
      : ''
  },
  set: (value) => {
    try {
      if (value.trim()) {
        form.value.condition_json = JSON.parse(value)
        jsonError.value.condition_json = ''
      } else {
        form.value.condition_json = {}
        jsonError.value.condition_json = ''
      }
    } catch (e) {
      jsonError.value.condition_json = (e as Error).message
    }
  }
});

const isFormValid = computed(() => {
  if (!form.value.rule_name?.trim()) return false
  if (!isUniversalRule.value) {
    if (!form.value.trigger_code_id?.trim()) return false
    if (!form.value.triger_gccode_system) return false
  }
  if (!form.value.gc_required_type?.trim()) return false
  if (!form.value.required_code_system?.trim()) return false
  if (requiredCodes.value.length === 0 || requiredCodes.value.some(code => !code.trim())) return false
  if (!form.value.message?.trim()) return false
  if (!form.value.gc_severity) return false
  
  return true
});

// Helper functions
const getRuleTypeLabel = (standardcodeId: any) => {
  const option = RULE_TYPE_OPTIONS.value.find(opt => opt.standardcode_id === standardcodeId);
  return option?.standardcode_name || standardcodeId;
}

const getSeverityLabel = (standardcodeId: any) => {
  const option = SEVERITY_OPTIONS.value.find(opt => opt.standardcode_id === standardcodeId);
  return option?.standardcode_name || standardcodeId;
}

const getCodeSystemLabel = (standardcodeId: any) => {
  const option = CODE_SYSTEM_OPTIONS.value.find(opt => opt.standardcode_id === standardcodeId);
  return option?.standardcode_name || standardcodeId;
}

const getRequiredModeLabel = (standardcodeId: any) => {
  const option = REQUIRED_MODE_OPTIONS.value.find(opt => opt.standardcode_id === standardcodeId);
  return option?.standardcode_name || standardcodeId;
}

const getDocumentTypeLabel = (standardcodeId: any) => {
  const option = DOCUMENT_TYPE_OPTIONS.value.find(opt => opt.standardcode_id === standardcodeId);
  return option?.standardcode_name || standardcodeId;
}

// Methods
const handleRuleTypeChange = (typeId: any) => {
  form.value.gc_required_type = typeId;
  
  // Reset validasi errors
  triggerCodeError.value = '';
  triggerSystemError.value = '';
  requiredCodeErrors.value = [];
  
  // Reset trigger conditions untuk universal rule
  if (typeId === 'X002^003') {
    form.value.trigger_code_id = '';
    form.value.triger_gccode_system = '';
    form.value.condition_json = {};
    form.value.required_code_system = 'ADMINISTRATIVE';
    form.value.gc_required_mode = 'X003^001';
  }
  
  // Set default untuk ICD rule
  if (typeId === 'X002^001') {
    form.value.triger_gccode_system = 'X678^001'; // Default ICD-10
    form.value.required_code_system = 'ATC'; // Default ATC untuk obat
  }
  
  updateMessageSuggestions();
};

function getRuleTypeDescription(typeId: string): string {
  const descriptions: { [key: string]: string } = {
    'X002^001': 'Memeriksa kode ICD diagnosis/prosedur',
    'X002^002': 'Memeriksa kelengkapan dokumen berdasarkan diagnosis',
    'X002^003': 'Dokumen wajib untuk semua klaim (universal)'
  };
  return descriptions[typeId] || 'Tipe pemeriksaan';
}

function getRequiredConditionsTitle(): string {
  if (isUniversalRule.value) return 'Dokumen Wajib Universal';
  return form.value.gc_required_type === 'X002^001' ? 'Kode yang Diperlukan' : 'Dokumen yang Diperlukan';
}

function getRequiredConditionsDescription(): string {
  if (isUniversalRule.value) {
    return 'Tentukan dokumen apa yang wajib ada untuk SEMUA klaim, tanpa memandang diagnosis atau tindakan.';
  }
  return form.value.gc_required_type === 'X002^001' 
    ? 'Tentukan kode medis apa yang harus ada ketika kondisi pemicu terpenuhi.' 
    : 'Tentukan dokumen apa yang harus lengkap ketika diagnosis ditemukan.';
}

function getRuleTypeBadgeClass(ruleType: any): string {
  const classes: { [key: string]: string } = {
    'X002^001': 'px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800',
    'X002^002': 'px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800',
    'X002^003': 'px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800'
  };
  return classes[ruleType] || 'px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800';
}

function getRuleTypeBadgeText(ruleType: any): string {
  const texts: { [key: string]: string } = {
    'X002^001': 'Kode Medis ICD',
    'X002^002': 'Dokumen Kondisional',
    'X002^003': 'Dokumen Universal'
  };
  return texts[ruleType] || 'Unknown';
}

function getCodeOrDocumentIcon(ruleType: string): string {
  const icons: { [key: string]: string } = {
    'X002^001': '💊',
    'X002^002': '📋',
    'X002^003': '🌐'
  };
  return icons[ruleType] || '📄';
}

function getModeBadgeClass(mode: string): string {
  const classes: { [key: string]: string } = {
    'X003^001': 'ml-2 px-2 py-1 text-xs font-medium rounded bg-purple-100 text-purple-800',
    'X003^002': 'ml-2 px-2 py-1 text-xs font-medium rounded bg-yellow-100 text-yellow-800',
    'X003^003': 'ml-2 px-2 py-1 text-xs font-medium rounded bg-indigo-100 text-indigo-800'
  };
  return classes[mode] || 'ml-2 px-2 py-1 text-xs font-medium rounded bg-gray-100 text-gray-800';
}

function getSeverityBadgeClass(severity: string): string {
  const classes: { [key: string]: string } = {
    'X004^001': 'px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800',
    'X004^002': 'px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800',
    'X004^003': 'px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800'
  };
  return classes[severity] || 'px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800';
}

function getSeverityBadgeText(severity: string): string {
  const texts: { [key: string]: string } = {
    'X004^001': '❌ ERROR',
    'X004^002': '⚠️ WARNING',
    'X004^003': 'ℹ️ INFO'
  };
  return texts[severity] || 'UNKNOWN';
}

function getTriggerCodeDescription(): string {
  const codeDescriptions: { [key: string]: string } = {
    'E11': 'Diabetes Mellitus Tipe 2',
    'I10': 'Hipertensi Esensial', 
    'J45': 'Asma',
    'N18': 'Penyakit Ginjal Kronik',
    'Z01.81': 'Pemeriksaan Pre-Operasi',
    'I25': 'Penyakit Jantung Iskemik',
    'E78': 'Gangguan Metabolisme Lipid',
    'M54': 'Nyeri Punggung'
  }
  return codeDescriptions[form.value.trigger_code_id || ''] || 'Kode diagnosis/prosedur'
}

function getDocumentSystemLabel(): string {
  if (!form.value.required_code_system) return '';
  
  if (form.value.required_code_system === 'DOC') return 'Dokumen Medis';
  if (form.value.required_code_system === 'ADMINISTRATIVE') return 'Dokumen Administratif';
  if (form.value.required_code_system === 'MEDICAL_RECORD') return 'Rekam Medis';
  if (form.value.required_code_system === 'LAB_RESULT') return 'Hasil Laboratorium';
  if (form.value.required_code_system === 'RADIOLOGY') return 'Hasil Radiologi';
  
  return form.value.required_code_system;
}

function getCodeOrDocumentLabel(code: string): string {
  if (form.value.gc_required_type === 'X002^002' || form.value.gc_required_type === 'X002^003') {
    // Cari di universal document options dulu
    const universalDoc = UNIVERSAL_DOCUMENT_OPTIONS.value.find(doc => doc.value === code);
    if (universalDoc) return universalDoc.label;
    
    // Kalau tidak ada, cari di document type options
    return getDocumentTypeLabel(code) || 'Dokumen';
  }
  
  // For medical codes
  const codeDescriptions: { [key: string]: string } = {
    'A10BA': 'Metformin',
    'A10BB': 'Sulfonylurea',
    'A10AC': 'Insulin',
    'C09CA': 'ACE Inhibitor',
    'C07AB': 'Beta Blocker',
    '99213': 'Kunjungan Rawat Jalan',
    '80048': 'Panel Metabolik Dasar'
  }
  return codeDescriptions[code] || 'Kode Medis'
}

function getSeverityImpact(): string {
  const impacts: { [key: string]: string } = {
    'X004^001': 'Akan memblokir proses dan memerlukan tindakan sebelum melanjutkan',
    'X004^002': 'Akan menampilkan peringatan tetapi proses dapat dilanjutkan',
    'X004^003': 'Hanya memberikan informasi tambahan tanpa mengganggu proses'
  }
  return impacts[form.value.gc_severity || ''] || ''
}

function getModeDescription(mode: any) {
  const descriptions: { [key: string]: string } = {
    'X003^001': 'Semua harus ada',
    'X003^002': 'Minimal satu harus ada', 
    'X003^003': 'Harus tepat'
  }
  return descriptions[mode] || getRequiredModeLabel(mode)
}

function getSeverityDescription(severity: string) {
  const descriptions: { [key: string]: string } = {
    'X004^001': 'Akan memblokir proses',
    'X004^002': 'Peringatan saja',
    'X004^003': 'Informasi tambahan'
  }
  return descriptions[severity] || getSeverityLabel(severity)
}

function getMessagePlaceholder(): string {
  if (isUniversalRule.value) {
    return 'Contoh: Dokumen SEP wajib dilampirkan untuk semua klaim';
  }
  return form.value.gc_required_type === 'X002^001' 
    ? 'Contoh: Diagnosis diabetes memerlukan obat diabetes yang sesuai'
    : 'Contoh: Diagnosis hipertensi memerlukan hasil pemeriksaan tekanan darah';
}

function updateMessageSuggestions() {
  const suggestions = [];
  
  if (isUniversalRule.value) {
    const requiredItems = requiredDocuments.value.filter(doc => doc.trim())
      .map(doc => {
        const docOption = UNIVERSAL_DOCUMENT_OPTIONS.value.find(d => d.value === doc);
        return docOption ? docOption.label : doc;
      })
      .join(', ');
    
    if (requiredItems) {
      suggestions.push(
        `Dokumen ${requiredItems} wajib dilampirkan untuk semua klaim`,
        `Pastikan dokumen ${requiredItems} lengkap sebelum proses klaim`,
        `Kelengkapan dokumen ${requiredItems} merupakan syarat wajib semua klaim`
      );
    }
  } else if (form.value.trigger_code_id && form.value.triger_gccode_system && requiredCodes.value.length > 0) {
    const triggerDesc = getTriggerCodeDescription();
    const requiredItems = requiredCodes.value.filter(c => c.trim()).map(code => 
      getCodeOrDocumentLabel(code)
    ).join(', ');
    
    if (form.value.gc_required_type === 'X002^001') {
      suggestions.push(
        `Diagnosis ${triggerDesc} memerlukan ${requiredItems}`,
        `Untuk ${triggerDesc}, pastikan tersedia ${requiredItems}`,
        `${triggerDesc} harus disertai dengan ${requiredItems}`
      );
    } else {
      suggestions.push(
        `Diagnosis ${triggerDesc} memerlukan dokumen ${requiredItems}`,
        `Kelengkapan dokumen ${requiredItems} diperlukan untuk ${triggerDesc}`,
        `Pastikan dokumen ${requiredItems} lengkap untuk pasien ${triggerDesc}`
      );
    }
  }
  
  messageSuggestions.value = suggestions;
}

function addRequiredDocument() {
  requiredDocuments.value.push('');
}

function removeRequiredDocument(index: number) {
  if (requiredDocuments.value.length > 1) {
    requiredDocuments.value.splice(index, 1);
  }
}


const addRequiredCode = () => {
  requiredCodes.value.push('');
  requiredCodeDescriptions.value.push('');
  requiredCodeErrors.value.push('');
};


const removeRequiredCode = (index: number) => {
  if (requiredCodes.value.length > 1) {
    requiredCodes.value.splice(index, 1);
    requiredCodeDescriptions.value.splice(index, 1);
    requiredCodeErrors.value.splice(index, 1);
  }
};


function nextStep() {
  if (currentStep.value < totalSteps.value) {
    currentStep.value++;
  }
}

function prevStep() {
  if (currentStep.value > 1) {
    currentStep.value--;
  }
}

// Modifikasi submitForm untuk validasi tambahan
const submitForm = () => {
  if (!validateCurrentStep()) {
    return;
  }

  // Validasi khusus untuk ICD rule
  if (isICDRule.value) {
    if (triggerCodeError.value || triggerSystemError.value) {
      alert('Harap perbaiki error pada kode pemicu sebelum menyimpan');
      currentStep.value = 2;
      return;
    }

    if (requiredCodeErrors.value.some(error => error)) {
      alert('Harap perbaiki error pada kode yang diperlukan sebelum menyimpan');
      currentStep.value = requiredConditionsStep.value;
      return;
    }
  }

  // Update required codes dari array
  form.value.required_codes = requiredCodes.value.filter(code => code.trim());

  // Validate JSON fields
  if (jsonError.value.condition_json) {
    return;
  }

  // Validate required codes
  if (form.value.required_codes && form.value.required_codes.length === 0) {
    alert('Harap tambahkan minimal satu kode/dokumen yang diperlukan');
    currentStep.value = requiredConditionsStep.value;
    return;
  }
  alert(form.value)
  console.log(form.value)
  emit('save', form.value);
};


function validateCurrentStep(): boolean {
  switch (currentStep.value) {
    case 1:
      if (!form.value.rule_name?.trim()) {
        alert('Harap isi nama rule');
        return false;
      }
      if (!form.value.gc_required_type) {
        alert('Harap pilih tipe rule');
        return false;
      }
      break;
    case 2:
      if (!isUniversalRule.value) {
        if (!form.value.trigger_code_id?.trim()) {
          alert('Harap isi kode pemicu');
          return false;
        }
        if (!form.value.triger_gccode_system) {
          alert('Harap pilih sistem kode');
          return false;
        }
      }
      break;
    case requiredConditionsStep.value:
      if (!form.value.required_code_system?.trim()) {
        alert('Harap isi sistem kode/dokumen yang diperlukan');
        return false;
      }
      if (!form.value.gc_required_mode) {
        alert('Harap pilih mode pemeriksaan');
        return false;
      }
      if (requiredCodes.value.some(code => !code.trim())) {
        alert('Harap isi semua kode/dokumen yang diperlukan');
        return false;
      }
      break;
    case 4:
      if (!form.value.message?.trim()) {
        alert('Harap isi pesan error');
        return false;
      }
      if (!form.value.gc_severity) {
        alert('Harap pilih tingkat keparahan');
        return false;
      }
      break;
  }
  return true;
}

// Watch for rule changes
watch(() => props.rule, (newRule) => {
  if (newRule) {
    form.value = { ...newRule };
    requiredCodes.value = newRule.required_codes ? [...newRule.required_codes] : [''];
    if (requiredCodes.value.length === 0) {
      requiredCodes.value = [''];
    }
  } else {
    form.value = { ...INITIAL_RULE };
    requiredCodes.value = [''];
    currentStep.value = 1;
  }
}, { immediate: true });

// Watch for rule type changes
watch(() => form.value.gc_required_type, (newType) => {
  
  if (newType === 'X002^003') {
    icdSuggestions.value = [];
    selectedICDInfo.value = null;
    showICDSuggestions.value = false;

    // Universal document rule
    form.value.gc_required_type = 'X002^003';
    if (requiredCodes.value.length === 1 && !requiredCodes.value[0]) {
      requiredCodes.value = [''];
    }
  } else if (newType === 'X002^002') {
    icdSuggestions.value = [];
    selectedICDInfo.value = null;
    showICDSuggestions.value = false;

    // Conditional document rule
    form.value.gc_required_type = 'X002^002';
    if (requiredCodes.value.length === 1 && !requiredCodes.value[0]) {
      requiredCodes.value = [''];
    }
  } else if (newType === 'X002^001') {
    icdSuggestions.value = [];
    selectedICDInfo.value = null;
    showICDSuggestions.value = false;

    // Code rule
    form.value.gc_required_type = 'X002^001';
    if (requiredCodes.value.length === 1 && !requiredCodes.value[0]) {
      requiredCodes.value = [''];
    }
  }
  updateMessageSuggestions();
});

// Watch for trigger code changes

// Watch untuk reset errors
watch(() => form.value.trigger_code_id, () => {
  triggerCodeError.value = '';
});

watch(() => form.value.triger_gccode_system, () => {
  triggerSystemError.value = '';
});

watch(() => form.value.required_code_system, () => {
  // Reset required code errors ketika sistem berubah
  requiredCodeErrors.value = requiredCodeErrors.value.map(() => '');
});

// Inisialisasi requiredCodeDescriptions
watch(requiredCodes, (newCodes) => {
  while (requiredCodeDescriptions.value.length < newCodes.length) {
    requiredCodeDescriptions.value.push('');
  }
  while (requiredCodeDescriptions.value.length > newCodes.length) {
    requiredCodeDescriptions.value.pop();
  }
}, { deep: true });


// Watch untuk reset ketika modal ditutup/buka
watch(() => props.show, (newShow) => {
  if (!newShow) {
    // Reset ICD search states ketika modal ditutup
    icdSuggestions.value = [];
    selectedICDInfo.value = null;
    showICDSuggestions.value = false;
    icdSearchQuery.value = '';
    icdPagination.value = {
      skip: 0,
      limit: 20,
      total: 0,
      hasMore: false
    };
  }
});

</script>