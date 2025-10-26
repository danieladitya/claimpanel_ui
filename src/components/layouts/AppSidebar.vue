<template>
  <aside 
    :class="[
      'bg-white border-r border-gray-200 transition-all duration-300 ease-in-out flex flex-col',
      isCollapsed ? 'w-20' : 'w-64'
    ]"
    class="min-h-screen"
  >
    <!-- Logo -->
    <div class="p-4 border-b border-gray-200">
      <div class="flex items-center space-x-3">
        <div class="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-lg">
          <span class="text-sm font-bold text-white">CP</span>
        </div>
        <transition name="fade" mode="out-in">
          <h1 v-if="!isCollapsed" class="text-xl font-bold text-gray-800">ClaimPanel</h1>
        </transition>
      </div>
    </div>
    
    <!-- Navigation -->
    <nav class="flex-1 p-4 space-y-1">
      <template v-for="item in navigation" :key="item.name">
        
        <!-- Jika punya children (submenu) -->
        <div v-if="item.children" class="space-y-1">
          <button
            @click="toggleMenu(item.name)"
            class="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-600 transition-colors rounded-lg group hover:bg-gray-50 hover:text-gray-900"
          >
            <component :is="item.icon" class="w-5 h-5 text-gray-400 group-hover:text-gray-500" />
            <transition name="fade" mode="out-in">
              <span v-if="!isCollapsed" class="flex-1 ml-3 text-left">{{ item.name }}</span>
            </transition>
            <ChevronLeftIcon
              v-if="!isCollapsed"
              :class="[
                'h-4 w-4 text-gray-400 transition-transform',
                openMenus.includes(item.name) ? 'rotate-90' : ''
              ]"
            />
          </button>

          <!-- Submenu -->
          <transition name="fade">
            <div v-if="openMenus.includes(item.name) && !isCollapsed" class="ml-8 space-y-1">
              <router-link
                v-for="sub in item.children"
                :key="sub.name"
                :to="sub.path"
                :class="[
                  'block px-3 py-2 text-sm rounded-lg transition-colors',
                  $route.path === sub.path
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                ]"
              >
                {{ sub.name }}
              </router-link>
            </div>
          </transition>
        </div>

        <!-- Jika tidak punya children -->
        <router-link
          v-else
          :to="item.path"
          :class="[
            'group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
            $route.path === item.path 
              ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' 
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          ]"
        >
          <component 
            :is="item.icon" 
            :class="[
              'flex-shrink-0 h-5 w-5',
              $route.path === item.path ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'
            ]" 
          />
          <transition name="fade" mode="out-in">
            <span v-if="!isCollapsed" class="ml-3">{{ item.name }}</span>
          </transition>
        </router-link>
      </template>
    </nav>
    
    <!-- Collapse Button -->
    <div class="p-4 mt-auto border-t border-gray-200">
      <button
        @click="$emit('toggle')"
        class="flex items-center justify-center w-full p-2 transition-colors bg-gray-100 rounded-lg hover:bg-gray-200"
        :title="isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'"
      >
        <ChevronLeftIcon 
          :class="[
            'h-4 w-4 text-gray-600 transition-transform',
            isCollapsed ? 'rotate-180' : ''
          ]" 
        />
      </button>
    </div>
  </aside>
</template>

<script>
import {
  HomeIcon,
  CogIcon,
  ChevronLeftIcon,
  BookOpenIcon
} from '@heroicons/vue/24/outline'

export default {
  name: 'AppSidebar',
  components: {
    ChevronLeftIcon
  },
  props: {
    isCollapsed: Boolean
  },
  data() {
    return {
      openMenus: [],
      navigation: [
        { name: 'Dashboard', path: '/admin', icon: HomeIcon },
        { name: 'Klaim', path: '/admin/claim', icon: BookOpenIcon },
        {
          name: 'Pengaturan',
          icon: CogIcon,
          children: [
            { name: 'User', path: '/admin/settings/users' },
            { name: 'Dokumen Klaim', path: '/admin/settings/master_document' },
            { name: 'Penjamin Klaim', path: '/admin/settings/master_payor' },
            {name: 'Aturan Cross Check', path: '/admin/settings/cross_check_rules' }
          ]
        }
      ]
    }
  },
  methods: {
    toggleMenu(name) {
      if (this.openMenus.includes(name)) {
        this.openMenus = this.openMenus.filter(m => m !== name)
      } else {
        this.openMenus.push(name)
      }
    }
  }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
