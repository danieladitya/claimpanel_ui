import { MasterPayor, MasterPayorListResponse, MasterPayorRequest, MasterPayorResponse } from "@/interface/IMasterPayor";
import { Pagination } from "@/interface/IPagination";
import api from "@/services/api";
import { computed, ref } from "vue";

export function useMasterPayor(){
    const payors = ref<MasterPayor[]>([]);
    const loading = ref(false);
    const pagination = ref<Pagination | null>(null);
    const error = ref<string | null>(null);
    const saving = ref(false);

    const fetchMasterPayors = async(page: number, perPage: number) => {
        loading.value = true;
        error.value = null;

        try {
            const response = await api.get<MasterPayorListResponse>('/payor', {
                params: {
                    page,
                    per_page: perPage
                }
            });

            payors.value = response.data.data.payors;
            pagination.value = response.data.data.pagination;
        } catch (err) {
            error.value = 'Failed to fetch master payors.';
        } finally {
            loading.value = false;
        }
    }

    const totalData =  computed(()=> pagination.value ?.total_count || 0);
    const currentPage = computed(()=> pagination.value ?.page || 1);
    const totalPages = computed(()=> pagination.value ?.total_pages || 1);
    const hasNext = computed(()=> pagination.value ?.has_next || false);
    const hasPrevious = computed(() => pagination.value?.has_previous || false);


    const createData = async (data: MasterPayorRequest ) => {
        saving.value = true;
        error.value = null;
        try {
           const response = await api.post<MasterPayorResponse>('/payor/create', data);
           if(response.data.success){
             await fetchMasterPayors(currentPage.value, pagination.value ?.per_page || 10);
             return { success : true, data: response.data.data };
           }
        } catch (err : any) {
            error.value = err.response ?.data ?.message || 'Failed to create.';
            return { success : false, error: error.value };
        } finally {
            saving.value = false;
        }
        
    }

    const updateData = async(id: number, formData: MasterPayorRequest) => {
        saving.value = true;
        error.value = null;
        
        try {
            const response = await api.put<MasterPayorResponse>(`/payor/${id}`, formData);
            
            if (response.data.success) {
                await fetchMasterPayors(currentPage.value, pagination.value?.per_page || 10);
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
            const response = await api.delete(`/payor/${id}`);
            
            if (response.data.success) {
                await fetchMasterPayors(currentPage.value, pagination.value?.per_page || 10);
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
        payors,
        loading,
        pagination,
        error,
        saving,
        fetchMasterPayors, 
        totalData,
        currentPage,
        totalPages,
        hasNext,
        hasPrevious,
        createData, 
        updateData, 
        deleteData,
    };
}