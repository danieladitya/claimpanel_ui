import { BPJSSaveSEPClaimRequest, BPJSSepClaimRequest, SEP } from "@/interface/IClaim";
import api from "@/services/api";
import { ref } from "vue";

export function useBridgingPayor() {
    const payor_claims = ref<SEP[]>([]);
    const loading  = ref(false);
    const error = ref<string | null>(null);

    const fecthBridgingPayor = async (data : BPJSSepClaimRequest ) => {
        loading.value = true;
        error.value = null;
        try {
            
            const response = await api.post('/bpjs/get_klaim', data);
            
            if(response.data.success){
                payor_claims.value = response.data.data.sep;    
            }
        } catch (err) {
            error.value = 'Failed to fetch master data.';

            throw err;
        } finally{
            loading.value = false;
        }
    }

    const createPayorClaim = async (data : BPJSSaveSEPClaimRequest) => {
        loading.value = true;
        error.value = null;
        try {
            const response = await api.post('/claim/create/bridging', data);
            return response.data;
        } catch (err) {
            error.value = 'Failed to fetch master data.';

            throw err;
        } finally{
            loading.value = false;
        }
    }


    return {
        payor_claims,
        fecthBridgingPayor, 
        loading,
        error,
        createPayorClaim
    }
}