import { ref } from "vue";
import { getPayors, getPayorDetail } from "@/services/payor.service";
import type { Payor, PayorDetail } from "@/types/Payor";

export function usePayor() {
  const payors = ref<Payor[]>([]);
  const selectedPayor = ref<PayorDetail | null>(null);
  const loading = ref(false);

  async function fetchPayors() {
    loading.value = true;
    payors.value = await getPayors();
    loading.value = false;
  }

  async function selectPayor(id: number) {
    loading.value = true;
    selectedPayor.value = await getPayorDetail(id);
    loading.value = false;
  }

  return {
    payors,
    selectedPayor,
    loading,
    fetchPayors,
    selectPayor
  };
}
