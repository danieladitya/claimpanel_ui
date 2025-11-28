 import type { Payor, PayorDetail } from "@/types/Payor";
import api from "./api";

export async function getPayors() {
  const res = await api.get("/payor");
  return res.data.data.payors as Payor[];
}

export async function getPayorDetail(id: number) {
  const res = await api.get(`/payor/${id}`);
  return res.data.data.payor as PayorDetail;
}
