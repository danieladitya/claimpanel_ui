<template>
  <AdminLayout>
    <div class="container py-6 mx-auto">
      <!-- Header -->
      <div class="mb-4 card">
          <div class="flex items-center justify-between card-body">
            <h1 class="card-title">Daftar Peraturan Klaim</h1>
            <div class="space-x-2">
              <RouterLink
              class="btn btn-primary"
                :to="{ name: 'create_rule' }"
              > + Tambah Baru</RouterLink>
              
               
            </div>
          </div>
        </div>
        <div class="card">
          <div class="overflow-x-auto card-body">
            <CrossCheckRulesTable/>

          </div>
        </div>

    </div>
  </AdminLayout>
 
</template>

<script lang="ts" setup>
import AdminLayout from '@/layouts/AdminLayout.vue';
import CrossCheckRulesTable from '@/components/crossCheckRules/CrossCheckRulesTable.vue';
import { reactive } from 'vue';

const errors = reactive({
    name: "",
    keyword: ""
  });


</script>
 