import { useMasterDocument } from "@/composables/masterDocument";

export const { loading, document, fetchMasterDocuments, pagination, error, totalDocuments, currentPage, totalPages, hasNext, hasPrevious
} = useMasterDocument();
