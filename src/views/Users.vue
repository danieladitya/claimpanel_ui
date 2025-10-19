<template>
    <AdminLayout>
      <div class="dashboard-content">
        <h1>Dashboard User</h1>
        <p>Welcome to the admin dashboard!</p>
      </div>
    </AdminLayout>
  </template>

<script>

import AdminLayout from '@/layouts/AdminLayout.vue'

export default {
  name: 'Users',
  components: {
    AdminLayout
  }
}
</script>

<style>

</style>