import api from "./api";

export async function createDocumentRule(payload: any) {
  return api.post("/cross-check-document-rules", payload);
}

export async function updateDocumentRule(id: number, payload: any) {
  return api.put(`/cross-check-document-rules/${id}`, payload);
}

export async function deleteDocumentRule(id: number) {
  return api.delete(`/cross-check-document-rules/${id}`);
}
