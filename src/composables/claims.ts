import api from "@/services/api";
import { computed, ref } from "vue";
import { Pagination } from '../interface/IPagination';
import { type Filters } from '@/utils/constants';
import { IClaimData, IClaimListResponse, IClaimRequest, IClaimResponse } from "@/interface/IClaim";

export function useClaims() {
    const claims = ref<IClaimData[]> ([]);
    const loading  = ref(false);
    const pagination = ref<Pagination | null>(null);
    const error = ref<string | null>(null);
    const saving = ref(false);
    
    const fetchData = async( page: number, perPage: number ) => {
        loading.value = true;
        error.value = null;

        try {
            const response = await api.get<IClaimListResponse>('/claim', {
                params: {
                    page,
                    per_page: perPage
                }
            });
            
            claims.value = response.data.data.claim;
            pagination.value =response.data.data.pagination;
        } catch (err) {
            error.value = 'Failed to fetch master data.';
        } finally {
            loading.value = false;
        }
    }

    const totaldata =  computed(()=> pagination.value ?.total_count || 0);
    const currentPage = computed(()=> pagination.value ?.page || 1);
    const totalPages = computed(()=> pagination.value ?.total_pages || 1);
    const hasNext = computed(()=> pagination.value ?.has_next || false);
    const hasPrevious = computed(() => pagination.value?.has_previous || false);

    const createData = async (data: IClaimRequest ) => {
        saving.value = true;
        error.value = null;
        try {
           const response = await api.post<IClaimResponse>('/claim/create', data);
           if(response.data.success){
             await fetchData(currentPage.value, pagination.value ?.per_page || 10);
             return { success : true, data: response.data.data };
           }
        } catch (err : any) {
            error.value = err.response ?.data ?.message || 'Failed to create master document.';
            return { success : false, error: error.value };
        } finally {
            saving.value = false;
        }
        
    }

    const updateData = async(id: number, formData: IClaimRequest) => {
        saving.value = true;
        error.value = null;
        
        try {
            const response = await api.put<IClaimResponse>(`/claim/${id}`, formData);
            
            if (response.data.success) {
                await fetchData(currentPage.value, pagination.value?.per_page || 10);
                return { success: true, data: response.data.data };
            } else {
                throw new Error(response.data.message);
            }
        } catch (err: any) {
            error.value = err.response?.data?.message || 'Failed to update document';
            return { success: false, error: error.value };
        } finally {
            saving.value = false;
        }
    }

    const deleteData = async(id: number) => {
        loading.value = true;
        error.value = null;
        
        try {
            const response = await api.delete(`/claim/${id}`);
            
            if (response.data.success) {
                await fetchData(currentPage.value, pagination.value?.per_page || 10);
                return { success: true };
            } else {
                throw new Error(response.data.message);
            }
        } catch (err: any) {
            error.value = err.response?.data?.message || 'Failed to delete document';
            return { success: false, error: error.value };
        } finally {
            loading.value = false;
        }
    }

    
    return {
        claims,
        loading,
        error,
        fetchData,
        totaldata,
        currentPage,
        totalPages,
        hasNext,
        hasPrevious,
        pagination, 
        createData,
        updateData,
        deleteData,
        saving
    }
}

