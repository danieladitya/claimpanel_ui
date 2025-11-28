<script setup lang="ts">
import { onMounted } from "vue";
import PayorList from "@/components/mappingPayorDocument/PayorList.vue";
import DocumentMapping from "@/components/mappingPayorDocument/DocumentMapping.vue";
import { usePayor } from "@/composables/usePayor";
import AdminLayout from '@/layouts/AdminLayout.vue';

const { payors, selectedPayor, fetchPayors, selectPayor } = usePayor();
function refreshPayorDetail(){
  if(selectedPayor.value?.id){
    selectPayor(selectedPayor.value.id)
  }
}
onMounted(fetchPayors);
</script>

<template>
  <AdminLayout>
  <div class="container flex flex-col gap-6 p-6 mx-auto lg:flex-row">

    <PayorList
      :items="payors"
      :selectedId="selectedPayor?.id || null"
      @select="selectPayor"
    />

    <DocumentMapping :payor="selectedPayor"
      @saved = "refreshPayorDetail"
    />
  </div>
</AdminLayout>

</template>
