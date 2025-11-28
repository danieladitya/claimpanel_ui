import { MasterDocument, MasterDocumentListResponse, MasterDocumentRequest, MasterDocumentResponse } from "@/interface/IMasterDocument";
import api from "@/services/api";
import { computed, ref } from "vue";
import { Pagination } from '../interface/IPagination';
import { type Filters } from '@/utils/constants';

export function useMasterDocument() {
    const documents = ref<MasterDocument[]> ([]);
    const loading  = ref(false);
    const pagination = ref<Pagination | null>(null);
    const error = ref<string | null>(null);
    const saving = ref(false);

    const showDocumentSuggestions = ref(false)

    const documentSuggestions  =   ref<MasterDocument[]>([])
    const selectedDocumentInfo = ref<MasterDocument>()
    const documentPagination = ref({
      skip: 0,
      limit: 20,
      total: 0,
      hasMore: false
    })
  
    const searchingDocument = ref(false)
    const documentSearchQuery = ref('')


    const fetchMasterDocuments = async (page: number = 1, perPage: number = 10) => {        loading.value = true;
        error.value = null;

        try {
            const response = await api.get<MasterDocumentListResponse>('/master_document', {
                params: {
                    page,
                    per_page: perPage
                }
            });
            documents.value = response.data.data.documents;
            pagination.value =response.data.data.pagination;
        } catch (err) {
            error.value = 'Failed to fetch master documents.';
        } finally {
            loading.value = false;
        }
    }

    const totalDocuments =  computed(()=> pagination.value ?.total_count || 0);
    const currentPage = computed(()=> pagination.value ?.page || 1);
    const totalPages = computed(()=> pagination.value ?.total_pages || 1);
    const hasNext = computed(()=> pagination.value ?.has_next || false);
    const hasPrevious = computed(() => pagination.value?.has_previous || false);

    const createData = async (data: MasterDocumentRequest ) => {
        saving.value = true;
        error.value = null;
        try {
           const response = await api.post<MasterDocumentResponse>('/master_document/create', data);
           if(response.data.success){
             await fetchMasterDocuments(currentPage.value, pagination.value ?.per_page || 10);
             return { success : true, data: response.data.data };
           }
        } catch (err : any) {
            error.value = err.response ?.data ?.message || 'Failed to create master document.';
            return { success : false, error: error.value };
        } finally {
            saving.value = false;
        }
        
    }

    const updateData = async(id: number, formData: MasterDocumentRequest) => {
        saving.value = true;
        error.value = null;
        
        try {
            const response = await api.put<MasterDocumentResponse>(`/master_document/${id}`, formData);
            
            if (response.data.success) {
                await fetchMasterDocuments(currentPage.value, pagination.value?.per_page || 10);
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
            const response = await api.delete(`/master_document/${id}`);
            
            if (response.data.success) {
                await fetchMasterDocuments(currentPage.value, pagination.value?.per_page || 10);
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
    const searchDocument = async (keyword: string, page: number = 1, per_page: number = 10) => {
        try {
          const response = await api.get('/master_document/search', {
            params: { keyword, page, per_page }
          });
          return response.data;
        } catch (error) {
          console.error('Error searching documents:', error);
          throw error;
        }
      };
       
    const fetchAllDocuments = async () => {
        loading.value = true;
        try {
          const response = await api.get('/master_document', {
            params: { page: 1, per_page: 99 }
          });
       
          documents.value = response.data.data.documents;
          
        } catch (err) {
          console.error('Failed to load documents dropdown');
        } finally {
            loading.value = false;
        }
      };

    return {
        documents,
        loading,
        error,
        fetchMasterDocuments,
        totalDocuments,
        currentPage,
        totalPages,
        hasNext,
        hasPrevious,
        pagination, 
        createData,
        updateData,
        deleteData,
        saving, 

        searchDocument,
        showDocumentSuggestions,
        documentSuggestions,
        selectedDocumentInfo,
        documentPagination,
        searchingDocument,
        documentSearchQuery, 
        fetchAllDocuments

    }
}

