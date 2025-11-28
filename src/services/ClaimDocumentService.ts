import type { MasterPayor } from "@/interface/IMasterPayor";
import type { MasterDocument } from "@/interface/IMasterDocument";
import type { IClaimDocument } from "@/interface/IClaimDocument";

export async function getPayors(): Promise<MasterPayor[]> {
  return fetch("/api/payor").then((r) => r.json());
}

export async function getDocumentsByPayor(payorId: string): Promise<MasterDocument[]> {
  return fetch(`/api/document/payor/${payorId}`).then((r) => r.json());
}

export async function getClaimMapping(payorId: string): Promise<IClaimDocument[]> {
  return fetch(`/api/claim/document/${payorId}`).then((r) => r.json());
}

 
 