<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { useDocumentRule } from "@/composables/useDocumentRule";
import { useSpecificReference } from "@/composables/standardCode";
import { useReferenceData } from '../../composables/useReferenceData';
import { IStandardcode } from '../../interface/IStandardcode';
import { useMasterDocument } from '../../composables/masterDocument';
 
const props = defineProps<{
  visible: boolean;
  payorId: number;
  editData?: any;
}>();
const refJenisLayanan = ref<IStandardcode[]>([])
const emits = defineEmits(["close", "saved"]);

const { form, loading, setFormData, submit } = useDocumentRule();
const {getReferenceByParent } = useReferenceData();
const {documents, fetchAllDocuments} = useMasterDocument()
watch(() => props.visible, (val) => {
  if (val) {
    
    if (props.editData) {
      setFormData(props.editData);
    } else {
      setFormData({ payor_id: props.payorId });
    }

  }
});

onMounted(() => {  
  getReferenceByParent('X008', refJenisLayanan);
  fetchAllDocuments()
})

async function onSubmit() {
  await submit();
  emits("saved");
  emits("close");
}
</script>

<template>
  <div v-if="visible" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
    <div class="w-full max-w-lg p-6 bg-white rounded-lg shadow-lg">
      
      <h2 class="mb-4 text-xl font-semibold">  
        {{ form.id ? 'Edit Mapping Dokumen' : 'Tambah Mapping Dokumen' }}
      </h2>

      <!-- INPUT PAYOR ID (HIDDEN) -->
      <input type="hidden" v-model="form.payor_id" />

      <!-- Document ID -->
      <div class="mb-4">
        <label class="mb-2 form-label">Dokumen</label>
        <select  v-model="form.document_id"    class="form-control form-control-sm">
          <option v-for="i in documents" :key=" i.id" :value="i.id">{{ i.document_name }}</option>
        </select>
        <!-- <input v-model="form.document_id"
               type="number"
               class="form-control form-control-sm"
               placeholder="ID dokumen" /> -->
      </div>

      <!-- Service Type -->
      <div class="mb-4">
        <label class="mb-2 form-label">Layanan</label>
        <select v-model="form.gcclaim_service_type"  class="form-control">
          <option v-for="i in refJenisLayanan" :key="i.standardcode_id" :value="i.standardcode_id">{{ i.standardcode_name }}</option>
                 
              </select>
        <!-- <input v-model="form.gcclaim_service_type"
               type="text"
               class="form-control form-control-sm"
               placeholder="ex: Rawat Jalan / Rawat Inap" /> -->
      </div>

      <!-- Status -->
      <div class="mb-4">
        <label class="mb-2 form-label">Status</label>
        <select v-model="form.is_active" class="form-control form-control-sm">
          <option :value="1">Aktif</option>
          <option :value="0">Nonaktif</option>
        </select>
      </div>

      <div class="flex justify-end mt-4 space-x-2">
        <button class="btn btn-primary"
                @click="$emit('close')">Batal</button>

        <button class="btn btn-primary"
                :disabled="loading"
                @click="onSubmit">
          {{ loading ? 'Menyimpan...' : 'Simpan' }}
        </button>
      </div>

    </div>
  </div>
</template>
