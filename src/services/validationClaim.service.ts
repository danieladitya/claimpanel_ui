import { MergeDocument, ValidationClaim } from "@/types/ValidationClaim";
import api from "./api";
 

export async function sentValidation(claim_payor_id : string){
    const resp = await api.get(`/claim_validation/${claim_payor_id}`);
    
    return resp.data.data as ValidationClaim; 
}

export async function getMergeDocument(claim_payor_id : string) {
    
    const resp = await api.get(`/claim/${claim_payor_id}/merge-pdf`);
    return resp.data.data as MergeDocument
}

