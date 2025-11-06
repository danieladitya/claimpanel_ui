<template>
    <AdminLayout>
      <CrossCheckRulesCreateForm :isEditing="false" />
    </AdminLayout>
  </template>
  
  <script lang="ts" setup>
  import CrossCheckRulesCreateForm from '@/components/crossCheckRules/CrossCheckRulesCreateForm.vue';
  import AdminLayout from '@/layouts/AdminLayout.vue';
  </script>