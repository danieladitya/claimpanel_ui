import type { MasterPayor } from "@/interface/IMasterPayor";
import type { MasterDocument } from "@/interface/IMasterDocument";
import type { IClaimDocument } from "@/interface/IClaimDocument";
import api from "./api";
import { ClaimDocument, ClaimDocumentsResponse } from "@/types/ClaimDocument";

// export async function getPayors(): Promise<MasterPayor[]> {
//   return fetch("/api/payor").then((r) => r.json());
// }

// export async function getDocumentsByPayor(payorId: string): Promise<MasterDocument[]> {
//   return fetch(`/api/document/payor/${payorId}`).then((r) => r.json());
// }

// export async function getClaimMapping(payorId: string): Promise<IClaimDocument[]> {
//   return fetch(`/api/claim/document/${payorId}`).then((r) => r.json());
// }

export async function getClaimDocumentReady(month: string, payor_code: string){
  try{

    const param = {
      month : month, 
      payor_code : payor_code
    }
     const response = await api.get<ClaimDocumentsResponse>(
      `/claim_document/ready-merge?month=$mont`, {
        params : param
      }
     )
     return response.data.data.claim_documents

  }catch (error) {
    console.error("Error fetching claim document ready:", error);
    throw error;
  }
}
 