import { ref } from "vue";
import { createDocumentRule, deleteDocumentRule, updateDocumentRule } from "@/services/document-rule.service";

export function useDocumentRule() {
  const form = ref({
    id: null as number | null,
    payor_id: 0,
    document_id: 0,
    gcclaim_service_type: "",
    is_active: 1
  });

  const loading = ref(false);

  function setFormData(data: any) {
    form.value = {
      id: data?.id || null,
      payor_id: data?.payor_id || 0,
      document_id: data?.document_id || 0,
      gcclaim_service_type: data?.gcclaim_service_type || "",
      is_active: data?.is_active ?? 1
    };
  }

  async function submit() {
    loading.value = true;

    if (form.value.id) {
      await updateDocumentRule(form.value.id, form.value);
    } else {
      await createDocumentRule(form.value);
    }

    loading.value = false;
  }
  
 

  return {
    form,
    loading,
    setFormData,
    submit
  };
}
