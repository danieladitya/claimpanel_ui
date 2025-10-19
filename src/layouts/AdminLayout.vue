<template>
  <div class="flex min-h-screen">
 
        <!-- Sidebar -->
    <AppSidebar 
      :is-collapsed="isSidebarCollapsed"
      @toggle="isSidebarCollapsed = !isSidebarCollapsed"
      class="flex-shrink-0"
    />
   
    
    <!-- Main Content -->
    <div class="flex-1 flex flex-col min-w-0">
      <AppHeader 
        :is-sidebar-collapsed="isSidebarCollapsed"
        @toggle-sidebar="isSidebarCollapsed = !isSidebarCollapsed"
        class="border-b border-gray-200 bg-white"
      />

      <!-- Page Content -->
      <main class="flex-1 p-6 bg-gray-50">
          <slot />
         
      </main>

      <AppFooter />
    </div>
  </div>
</template>

<script>
import AppSidebar from '@/components/layouts/AppSidebar.vue'
import AppHeader from '@/components/layouts/AppHeader.vue'
import AppFooter from '@/components/layouts/AppFooter.vue'

export default {
  name: 'AdminLayout',
  components: {
    AppSidebar,
    AppHeader,
    AppFooter
  },
  props: {
    title: { type: String, default: 'Dashboard' },
    subtitle: { type: String, default: 'Overview and statistics' }
  },
  data() {
    return {
      isSidebarCollapsed: false
    }
  }
}
</script>
