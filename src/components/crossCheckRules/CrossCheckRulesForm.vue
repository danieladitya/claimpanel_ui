<template>
  <Modal :show="show" @close="$emit('close')" size="xl">
    <template #title>
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-xl font-semibold text-gray-900">
            {{ isEditing ? 'Edit Cross Check Rule' : 'Buat Rule Pemeriksaan Silang Baru' }}
          </h3>
          <p class="mt-1 text-sm text-gray-500">
            Step {{ currentStep }} of 4: {{ stepTitle }}
          </p>
        </div>
        <div class="flex items-center space-x-2">
          <span class="text-sm text-gray-500">ID: {{ form.id || 'New' }}</span>
          <span :class="[
            'px-2 py-1 text-xs font-medium rounded-full',
            form.gcrule_type === 'code' 
              ? 'bg-blue-100 text-blue-800' 
              : 'bg-green-100 text-green-800'
          ]">
            {{ form.gcrule_type === 'code' ? 'Kode Medis' : 'Dokumen' }}
          </span>
        </div>
      </div>
    </template>

    <template #body>
      <!-- Progress Steps -->
      <div class="mb-8">
        <div class="flex justify-between">
          <div v-for="(step, index) in steps" :key="index" class="flex items-center">
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
              v-if="index < steps.length - 1"
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
              <div class="grid grid-cols-2 gap-4">
                <div
                  v-for="type in RULE_TYPE_OPTIONS"
                  :key="type.value"
                  :class="[
                    'border rounded-lg p-4 cursor-pointer transition-all',
                    form.gcrule_type === type.value
                      ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                      : 'border-gray-300 hover:border-gray-400'
                  ]"
                  @click="form.gcrule_type = type.value"
                >
                  <div class="flex items-center">
                    <div
                      :class="[
                        'w-4 h-4 rounded-full border mr-3',
                        form.gcrule_type === type.value
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-400'
                      ]"
                    ></div>
                    <div>
                      <div class="font-medium text-gray-900">{{ type.label }}</div>
                      <div class="mt-1 text-xs text-gray-500">
                        {{ type.value === 'code' ? 'Memeriksa kode diagnosis/prosedur' : 'Memeriksa kelengkapan dokumen' }}
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

        <!-- Step 2: Trigger Condition -->
        <div v-if="currentStep === 2" class="space-y-6">
          <div class="p-4 border border-blue-200 rounded-lg bg-blue-50">
            <div class="flex">
              <div class="flex-shrink-0">
                <LightningBoltIcon class="w-5 h-5 text-blue-400" />
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-blue-800">
                  Kondisi Pemicu
                </h3>
                <p class="mt-1 text-sm text-blue-700">
                  Tentukan kode diagnosis atau prosedur yang akan memicu pemeriksaan ini.
                </p>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label class="block mb-1 text-sm font-medium text-gray-700">
                Kode Pemicu *
                <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.trigger_code_id"
                type="text"
                required
                class="w-full px-3 py-2 transition-colors border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                :placeholder="form.gcrule_type === 'code' ? 'Contoh: E11, I10, A10' : 'Contoh: E11, I10 (diagnosis yang memerlukan dokumen)'"
              />
              <p class="mt-1 text-xs text-gray-500">
                {{ form.gcrule_type === 'code' 
                  ? 'Kode diagnosis atau prosedur yang memicu rule' 
                  : 'Kode diagnosis yang memerlukan kelengkapan dokumen' 
                }}
              </p>
            </div>

            <div>
              <label class="block mb-1 text-sm font-medium text-gray-700">
                Sistem Kode *
              </label>
              <select
                v-model="form.trigger_code_system"
                required
                class="w-full px-3 py-2 transition-colors border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Pilih Sistem Kode</option>
                <option 
                  v-for="system in CODE_SYSTEM_OPTIONS" 
                  :key="system.value" 
                  :value="system.value"
                >
                  {{ system.label }}
                </option>
              </select>
              <p class="mt-1 text-xs text-gray-500">
                Standar sistem kode yang digunakan
              </p>
            </div>
          </div>

          <div class="p-4 rounded-lg bg-gray-50">
            <h4 class="mb-2 text-sm font-medium text-gray-900">Contoh Kode Diagnosis:</h4>
            <div class="space-y-1 text-sm text-gray-600">
              <p>• <strong>E11</strong> - Diabetes Mellitus Tipe 2</p>
              <p>• <strong>I10</strong> - Hipertensi Esensial</p>
              <p>• <strong>J45</strong> - Asma</p>
              <p>• <strong>N18</strong> - Penyakit Ginjal Kronik</p>
            </div>
          </div>
        </div>

        <!-- Step 3: Required Conditions -->
        <div v-if="currentStep === 3" class="space-y-6">
          <div class="p-4 border border-blue-200 rounded-lg bg-blue-50">
            <div class="flex">
              <div class="flex-shrink-0">
                <CheckCircleIcon class="w-5 h-5 text-blue-400" />
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-blue-800">
                  {{ form.gcrule_type === 'code' ? 'Kode yang Diperlukan' : 'Dokumen yang Diperlukan' }}
                </h3>
                <p class="mt-1 text-sm text-blue-700">
                  {{ form.gcrule_type === 'code' 
                    ? 'Tentukan kode medis apa yang harus ada ketika kondisi pemicu terpenuhi.' 
                    : 'Tentukan dokumen apa yang harus lengkap ketika diagnosis ditemukan.'
                  }}
                </p>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label class="block mb-1 text-sm font-medium text-gray-700">
                {{ form.gcrule_type === 'code' ? 'Sistem Kode yang Diperlukan *' : 'Sistem Dokumen *' }}
              </label>
              <input
                v-if="form.gcrule_type === 'code'"
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
                {{ form.gcrule_type === 'code' 
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
                v-model="form.required_mode"
                required
                class="w-full px-3 py-2 transition-colors border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option 
                  v-for="mode in REQUIRED_MODE_OPTIONS" 
                  :key="mode.value" 
                  :value="mode.value"
                >
                  {{ mode.label }}
                </option>
              </select>
              <p class="mt-1 text-xs text-gray-500">
                Cara pemeriksaan {{ form.gcrule_type === 'code' ? 'kode' : 'dokumen' }} yang diperlukan
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
                Minimal berapa {{ form.gcrule_type === 'code' ? 'item' : 'dokumen' }} yang harus ada
              </p>
            </div>
          </div>

          <div>
            <label class="block mb-1 text-sm font-medium text-gray-700">
              {{ form.gcrule_type === 'code' ? 'Kode yang Diperlukan *' : 'Jenis Dokumen yang Diperlukan *' }}
              <span class="text-red-500">*</span>
            </label>
            <div class="space-y-2">
              <div
                v-for="(code, index) in requiredCodes"
                :key="index"
                class="flex items-center space-x-2"
              >
                <input
                  v-if="form.gcrule_type === 'code'"
                  v-model="requiredCodes[index]"
                  type="text"
                  class="flex-1 px-3 py-2 transition-colors border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan kode medis"
                />
                <select
                  v-else
                  v-model="requiredCodes[index]"
                  class="flex-1 px-3 py-2 transition-colors border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Pilih Jenis Dokumen</option>
                  <option 
                    v-for="docType in DOCUMENT_TYPE_OPTIONS" 
                    :key="docType.value" 
                    :value="docType.value"
                  >
                    {{ docType.label }}
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
                Tambah {{ form.gcrule_type === 'code' ? 'Kode' : 'Dokumen' }}
              </button>
            </div>
            <p class="mt-2 text-xs text-gray-500">
              Mode <strong>{{ getModeDescription(form.required_mode) }}</strong>
            </p>
          </div>

          <!-- Examples Section -->
          <div class="p-4 border border-yellow-200 rounded-lg bg-yellow-50">
            <div class="flex">
              <div class="flex-shrink-0">
                <ExclamationIcon class="w-5 h-5 text-yellow-400" />
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-yellow-800">
                  {{ form.gcrule_type === 'code' ? 'Contoh Kode Medis' : 'Contoh Dokumen Medis' }}
                </h3>
                <div class="mt-1 space-y-1 text-sm text-yellow-700">
                  <div v-if="form.gcrule_type === 'code'">
                    <p><strong>ATC:</strong> A10BA (Metformin), A10BB (Sulfonylurea)</p>
                    <p><strong>CPT:</strong> 99213 (Visit), 80048 (Basic Metabolic Panel)</p>
                    <p><strong>LOINC:</strong> 4548-4 (HBA1c), 2160-0 (Creatinine)</p>
                  </div>
                  <div v-else>
                    <p><strong>Rekam Medis:</strong> Anamnesis, Pemeriksaan Fisik, Diagnosis</p>
                    <p><strong>Hasil Lab:</strong> Darah Lengkap, Kimia Darah, Urinalisis</p>
                    <p><strong>Dokumen Pendukung:</strong> Surat Rujukan, Persetujuan Tindakan</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="p-4 border border-green-200 rounded-lg bg-green-50">
            <div class="flex">
              <div class="flex-shrink-0">
                <CheckCircleIcon class="w-5 h-5 text-green-400" />
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-green-800">
                  Penjelasan Mode Pemeriksaan
                </h3>
                <div class="mt-1 space-y-1 text-sm text-green-700">
                  <p><strong>Semua harus ada:</strong> {{ form.gcrule_type === 'code' ? 'Semua kode harus ada dalam rekam medis' : 'Semua dokumen harus lengkap' }}</p>
                  <p><strong>Minimal satu harus ada:</strong> {{ form.gcrule_type === 'code' ? 'Minimal satu kode harus ada' : 'Minimal satu dokumen harus ada' }}</p>
                  <p><strong>Harus tepat:</strong> {{ form.gcrule_type === 'code' ? 'Harus ada tepat kode yang ditentukan' : 'Harus ada tepat dokumen yang ditentukan' }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

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

          <!-- Rule Summary Card -->
          <div class="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div class="px-6 py-4 border-b border-gray-200">
              <h4 class="text-lg font-semibold text-gray-900">📋 Ringkasan Rule Pemeriksaan</h4>
              <p class="mt-1 text-sm text-gray-600">Berikut adalah rule yang akan dibuat:</p>
            </div>
            
            <div class="p-6 space-y-4">
              <!-- Rule Type Badge -->
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-gray-700">Jenis Pemeriksaan:</span>
                <span :class="[
                  'px-3 py-1 text-sm font-medium rounded-full',
                  form.gcrule_type === 'code' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-green-100 text-green-800'
                ]">
                  {{ form.gcrule_type === 'code' ? '🔬 Pemeriksaan Kode Medis' : '📄 Kelengkapan Dokumen' }}
                </span>
              </div>

              <!-- Trigger Condition -->
              <div class="py-2 pl-4 border-l-4 border-blue-500 bg-blue-50">
                <p class="text-sm font-medium text-gray-900">🎯 Kondisi Pemicu:</p>
                <p class="mt-1 text-sm text-gray-700">
                  <strong>Jika</strong> ditemukan kode 
                  <code class="px-2 py-1 mx-1 font-mono text-sm text-blue-800 bg-blue-100 rounded">{{ form.trigger_code_id }}</code>
                  dari sistem 
                  <code class="px-2 py-1 mx-1 text-sm text-blue-800 bg-blue-100 rounded">{{ form.trigger_code_system }}</code>
                </p>
                <p class="mt-1 text-xs text-gray-600">
                  {{ getTriggerCodeDescription() }}
                </p>
              </div>

              <!-- Required Conditions -->
              <div class="py-2 pl-4 border-l-4 border-green-500 bg-green-50">
                <p class="text-sm font-medium text-gray-900">✅ Yang Diperlukan:</p>
                <div class="mt-2 space-y-2">
                  <p class="text-sm text-gray-700">
                    <strong>Maka harus ada</strong>
                    <span v-if="form.gcrule_type === 'code'">
                      kode dari sistem <code class="px-2 py-1 mx-1 text-sm text-green-800 bg-green-100 rounded">{{ form.required_code_system }}</code>:
                    </span>
                    <span v-else>
                      dokumen dari kategori <code class="px-2 py-1 mx-1 text-sm text-green-800 bg-green-100 rounded">{{ getDocumentSystemLabel() }}</code>:
                    </span>
                  </p>
                  
                  <div class="flex flex-wrap gap-2 mt-2">
                    <span
                      v-for="(code, index) in requiredCodes.filter(c => c.trim())"
                      :key="index"
                      class="inline-flex items-center px-3 py-1 text-sm font-medium text-green-800 bg-green-100 rounded-full"
                    >
                      {{ form.gcrule_type === 'code' ? '💊' : '📋' }}
                      {{ getCodeOrDocumentLabel(code) }}
                      <code class="px-1 ml-1 text-xs bg-green-200 rounded">{{ code }}</code>
                    </span>
                  </div>

                  <p class="mt-2 text-sm text-gray-700">
                    <strong>Mode:</strong> 
                    <span :class="[
                      'ml-2 px-2 py-1 text-xs font-medium rounded',
                      form.required_mode === 'all' ? 'bg-purple-100 text-purple-800' :
                      form.required_mode === 'any' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-indigo-100 text-indigo-800'
                    ]">
                      {{ getModeDescription(form.required_mode) }}
                    </span>
                    <span v-if="form.required_n > 1" class="ml-2 text-sm text-gray-600">
                      (minimal {{ form.required_n }} item)
                    </span>
                  </p>
                </div>
              </div>

              <!-- Error Message & Severity -->
              <div class="py-2 pl-4 border-l-4 border-orange-500 bg-orange-50">
                <p class="text-sm font-medium text-gray-900">⚠️ Pesan Peringatan:</p>
                <div class="flex items-start mt-2 space-x-3">
                  <span :class="[
                    'px-2 py-1 text-xs font-medium rounded-full',
                    form.severity === 'error' ? 'bg-red-100 text-red-800' :
                    form.severity === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  ]">
                    {{ form.severity === 'error' ? '❌ ERROR' : form.severity === 'warning' ? '⚠️ WARNING' : 'ℹ️ INFO' }}
                  </span>
                  <p class="flex-1 text-sm text-gray-700">
                    "{{ form.message }}"
                  </p>
                </div>
                <p class="mt-2 text-xs text-gray-600">
                  {{ getSeverityImpact() }}
                </p>
              </div>

              <!-- Status -->
              <div class="flex items-center justify-between pt-2 border-t border-gray-200">
                <span class="text-sm font-medium text-gray-700">Status Rule:</span>
                <span :class="[
                  'px-3 py-1 text-sm font-medium rounded-full',
                  form.active 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                ]">
                  {{ form.active ? '🟢 AKTIF' : '🔴 NON-AKTIF' }}
                </span>
              </div>
            </div>
          </div>

          <!-- Configuration Options -->
          <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
            <!-- Severity Configuration -->
            <div class="p-4 rounded-lg bg-gray-50">
              <h5 class="mb-3 text-sm font-medium text-gray-900">Tingkat Keparahan *</h5>
              <div class="space-y-2">
                <div
                  v-for="severity in SEVERITY_OPTIONS"
                  :key="severity.value"
                  :class="[
                    'border rounded-lg p-3 cursor-pointer transition-all',
                    form.severity === severity.value
                      ? `border-${severity.color}-500 bg-${severity.color}-50 ring-2 ring-${severity.color}-200`
                      : 'border-gray-300 hover:border-gray-400'
                  ]"
                  @click="form.severity = severity.value"
                >
                  <div class="flex items-center">
                    <div
                      :class="[
                        'w-4 h-4 rounded-full border mr-3',
                        form.severity === severity.value
                          ? `border-${severity.color}-500 bg-${severity.color}-500`
                          : 'border-gray-400'
                      ]"
                    ></div>
                    <div>
                      <div class="font-medium text-gray-900">{{ severity.label }}</div>
                      <div class="mt-1 text-xs text-gray-500">
                        {{ getSeverityDescription(severity.value) }}
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
                placeholder="Contoh: Diagnosis diabetes memerlukan obat diabetes yang sesuai"
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

            <div>
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
            v-if="currentStep < 4"
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
import { ref, computed, watch } from 'vue'
import Modal from '@/components/ui/Modal.vue'
import {
  SEVERITY_OPTIONS,
  RULE_TYPE_OPTIONS,
  REQUIRED_MODE_OPTIONS,
  CODE_SYSTEM_OPTIONS,
  DOCUMENT_TYPE_OPTIONS,
  STATUS_OPTIONS,
  INITIAL_RULE,
  type CrossCheckRule
} from '@/utils/constants'

// Icons
const InformationCircleIcon = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"/></svg>`
}

const LightningBoltIcon = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>`
}

const CheckCircleIcon = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`
}

const CogIcon = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15a3 3 0 100-6 3 3 0 000 6z"/></svg>`
}

const ExclamationIcon = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"/></svg>`
}

const PlusIcon = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>`
}

const TrashIcon = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>`
}
const props = defineProps({
  show: Boolean,
  rule: {
    type: Object as () => CrossCheckRule | null,
    default: null
  },
  isEditing: Boolean,
  submitting: Boolean
})

const emit = defineEmits(['save', 'close'])

// Form state
const form = ref<CrossCheckRule>({ ...INITIAL_RULE })
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

const stepTitle = computed(() => {
  if (currentStep.value === 3) {
    return form.value.gcrule_type === 'code' ? 'Kode Diperlukan' : 'Dokumen Diperlukan'
  }
  return steps[currentStep.value - 1]
})

// Computed
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
        form.value.condition_json = null
        jsonError.value.condition_json = ''
      }
    } catch (e) {
      jsonError.value.condition_json = (e as Error).message
    }
  }
})
const isFormValid = computed(() => {
  if (!form.value.rule_name.trim()) return false
  if (!form.value.trigger_code_id.trim()) return false
  if (!form.value.trigger_code_system) return false
  if (!form.value.required_code_system.trim()) return false
  if (requiredCodes.value.length === 0 || requiredCodes.value.some(code => !code.trim())) return false
  if (!form.value.message.trim()) return false
  
  return true
})

// Watch for rule changes
watch(() => props.rule, (newRule) => {
  if (newRule) {
    form.value = { ...newRule }
    requiredCodes.value = [...newRule.required_codes]
    if (requiredCodes.value.length === 0) {
      requiredCodes.value = ['']
    }
  } else {
    form.value = { ...INITIAL_RULE }
    requiredCodes.value = ['']
    currentStep.value = 1
  }
}, { immediate: true })

// Watch for rule type changes
watch(() => form.value.gcrule_type, (newType) => {
  if (newType === 'document') {
    form.value.required_code_system = 'DOC'
    if (requiredCodes.value.length === 1 && !requiredCodes.value[0]) {
      requiredCodes.value = ['medical_record']
    }
  } else {
    form.value.required_code_system = ''
    if (requiredCodes.value.length === 1 && requiredCodes.value[0] === 'medical_record') {
      requiredCodes.value = ['']
    }
  }
  updateMessageSuggestions()
})

// Watch for trigger code changes
watch(() => form.value.trigger_code_id, () => {
  updateMessageSuggestions()
})

// Methods
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
  return codeDescriptions[form.value.trigger_code_id] || 'Kode diagnosis/prosedur'
}

function getDocumentSystemLabel(): string {
  const systemLabels: { [key: string]: string } = {
    'DOC': 'Dokumen Medis',
    'MEDICAL_RECORD': 'Rekam Medis',
    'LAB_RESULT': 'Hasil Laboratorium',
    'RADIOLOGY': 'Hasil Radiologi'
  }
  return systemLabels[form.value.required_code_system] || form.value.required_code_system
}

function getCodeOrDocumentLabel(code: string): string {
  if (form.value.gcrule_type === 'document') {
    const docLabels: { [key: string]: string } = {
      'medical_record': 'Rekam Medis',
      'lab_result': 'Hasil Lab',
      'radiology_report': 'Laporan Radiologi',
      'prescription': 'Resep Obat',
      'referral_letter': 'Surat Rujukan',
      'consent_form': 'Form Persetujuan',
      'discharge_summary': 'Ringkasan Pulang',
      'operation_report': 'Laporan Operasi',
      'progress_note': 'Catatan Perkembangan',
      'consultation_note': 'Catatan Konsultasi'
    }
    return docLabels[code] || 'Dokumen'
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
    error: 'Akan memblokir proses dan memerlukan tindakan sebelum melanjutkan',
    warning: 'Akan menampilkan peringatan tetapi proses dapat dilanjutkan',
    info: 'Hanya memberikan informasi tambahan tanpa mengganggu proses'
  }
  return impacts[form.value.severity] || ''
}

function updateMessageSuggestions() {
  const suggestions = []
  
  if (form.value.trigger_code_id && form.value.required_code_system && requiredCodes.value.length > 0) {
    const triggerDesc = getTriggerCodeDescription()
    const requiredItems = requiredCodes.value.filter(c => c.trim()).map(code => 
      getCodeOrDocumentLabel(code)
    ).join(', ')
    
    if (form.value.gcrule_type === 'code') {
      suggestions.push(
        `Diagnosis ${triggerDesc} memerlukan ${requiredItems}`,
        `Untuk ${triggerDesc}, pastikan tersedia ${requiredItems}`,
        `${triggerDesc} harus disertai dengan ${requiredItems}`
      )
    } else {
      suggestions.push(
        `Diagnosis ${triggerDesc} memerlukan dokumen ${requiredItems}`,
        `Kelengkapan dokumen ${requiredItems} diperlukan untuk ${triggerDesc}`,
        `Pastikan dokumen ${requiredItems} lengkap untuk pasien ${triggerDesc}`
      )
    }
  }
  
  messageSuggestions.value = suggestions
}

function getModeDescription(mode: string) {
  const descriptions: { [key: string]: string } = {
    all: 'Semua harus ada',
    any: 'Minimal satu harus ada', 
    exact: 'Harus tepat'
  }
  return descriptions[mode] || mode
}

function getSeverityDescription(severity: string) {
  const descriptions: { [key: string]: string } = {
    error: 'Akan memblokir proses',
    warning: 'Peringatan saja',
    info: 'Informasi tambahan'
  }
  return descriptions[severity] || severity
}

function getSeverityColor(severity: string) {
  const severityOption = SEVERITY_OPTIONS.find(s => s.value === severity)
  return severityOption?.color || 'gray'
}


// Methods
function nextStep() {
  if (currentStep.value < 4) {
    currentStep.value++
  }
}

function prevStep() {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

function addRequiredCode() {
  requiredCodes.value.push('')
}

function removeRequiredCode(index: number) {
  if (requiredCodes.value.length > 1) {
    requiredCodes.value.splice(index, 1)
  }
}
  

function submitForm() {
  // Validate current step
  if (!validateCurrentStep()) {
    return
  }

  // Update required codes from array
  form.value.required_codes = requiredCodes.value.filter(code => code.trim())

  // Validate JSON fields
  if (jsonError.value.condition_json) {
    return
  }

  // Validate required codes
  if (form.value.required_codes.length === 0) {
    alert('Harap tambahkan minimal satu kode yang diperlukan')
    currentStep.value = 3
    return
  }

  emit('save', form.value)
}

function validateCurrentStep(): boolean {
  switch (currentStep.value) {
    case 1:
      if (!form.value.rule_name.trim()) {
        alert('Harap isi nama rule')
        return false
      }
      if (!form.value.gcrule_type) {
        alert('Harap pilih tipe rule')
        return false
      }
      break
    case 2:
      if (!form.value.trigger_code_id.trim()) {
        alert('Harap isi kode pemicu')
        return false
      }
      if (!form.value.trigger_code_system) {
        alert('Harap pilih sistem kode')
        return false
      }
      break
    case 3:
      if (!form.value.required_code_system.trim()) {
        alert('Harap isi sistem kode yang diperlukan')
        return false
      }
      if (requiredCodes.value.some(code => !code.trim())) {
        alert('Harap isi semua kode yang diperlukan')
        return false
      }
      break
    case 4:
      if (!form.value.message.trim()) {
        alert('Harap isi pesan error')
        return false
      }
      break
  }
  return true
}
</script>