<template>
  <header class="sticky top-0 z-40 bg-white border-b border-gray-200">
    <div class="flex items-center justify-between px-6 py-1">
      <!-- Left Section -->
      <div class="flex items-center space-x-4">
        <button
          @click="$emit('toggle-sidebar')"
          class="p-2 transition-colors rounded-lg hover:bg-gray-100 lg:hidden"
          aria-label="Toggle sidebar"
        >
          <Bars3Icon class="w-5 h-5 text-gray-600" />
        </button>

        <!-- Breadcrumb -->
        <nav class="flex items-center space-x-2 text-sm text-gray-500">
          <router-link to="/admin" class="hover:text-gray-700">Admin</router-link>
          <span class="text-gray-400">/</span>
          <span class="font-medium text-gray-900">{{ currentPage }}</span>
        </nav>
      </div>

      <!-- Right Section -->
      <div class="flex items-center space-x-4">
        <!-- Search -->
        <div class="relative hidden md:block">
          <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <MagnifyingGlassIcon class="w-4 h-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search..."
            class="py-2 pl-10 pr-4 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <!-- Notifications -->
        <button class="relative p-2 rounded-lg hover:bg-gray-100" aria-label="Notifications">
          <BellIcon class="w-5 h-5 text-gray-600" />
          <span class="absolute w-2 h-2 bg-red-500 rounded-full top-1 right-1"></span>
        </button>

        <!-- User Menu -->
        <div class="relative" ref="userMenu">
          <button
            @click="toggleUserMenu"
            :aria-expanded="isUserMenuOpen.toString()"
            class="flex items-center p-2 space-x-3 rounded-lg hover:bg-gray-100"
          >
            <div
              class="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600"
            >
              <span class="text-sm font-semibold text-white">
                {{ userInitials }}
              </span>
            </div>
            <div class="hidden text-left md:block">
              <p class="text-sm font-medium text-gray-900">{{ user?.fullname || 'Guest' }}</p>
              <p class="text-xs text-gray-500">{{ user?.username || '' }}</p>
            </div>
            <ChevronDownIcon class="w-4 h-4 text-gray-500" />
          </button>

          <!-- Dropdown Menu -->
          <transition
            enter-active-class="transition duration-100 ease-out"
            enter-from-class="transform scale-95 opacity-0"
            enter-to-class="transform scale-100 opacity-100"
            leave-active-class="transition duration-75 ease-in"
            leave-from-class="transform scale-100 opacity-100"
            leave-to-class="transform scale-95 opacity-0"
          >
            <div
              v-if="isUserMenuOpen"
              class="absolute right-0 z-50 w-48 py-1 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg"
              role="menu"
            >
              <a href="#" role="menuitem" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Profile</a>
              <a href="#" role="menuitem" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Settings</a>
              <div class="my-1 border-t border-gray-100"></div>
              <a
                href="#"
                role="menuitem"
                class="block px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                @click.prevent="logout"
              >
                Logout
              </a>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </header>
</template>
<script>
import {
  Bars3Icon,
  BellIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon
} from '@heroicons/vue/24/outline'

import api from '@/services/api' // axios instance

export default {
  name: 'AppHeader',
  components: {
    Bars3Icon,
    BellIcon,
    MagnifyingGlassIcon,
    ChevronDownIcon
  },
  props: {
    isSidebarCollapsed: Boolean
  },
  data() {
    return {
      isUserMenuOpen: false,
      user: null
    }
  },
  computed: {
    currentPage() {
      const routeName = this.$route.name || ''
      return routeName.charAt(0).toUpperCase() + routeName.slice(1)
    },
    userInitials() {
      if (!this.user?.fullname) return 'U'
      return this.user.fullname
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
    }
  },
  methods: {
    toggleUserMenu() {
      this.isUserMenuOpen = !this.isUserMenuOpen
    },
    handleKeydown(event) {
      if (event.key === 'Escape') {
        this.isUserMenuOpen = false
      }
    },
    handleClickOutside(event) {
      if (this.$refs.userMenu && !this.$refs.userMenu.contains(event.target)) {
        this.isUserMenuOpen = false
      }
    },
    async fetchUser() {
      try {
        const res = await api.get('/user/me')
        this.user = res.data.data   // ⬅️ sesuaikan ke "data"
        localStorage.setItem('user', JSON.stringify(this.user))
      } catch (err) {
        console.error('Failed to fetch user:', err)
      }
    },
    async logout() {
      try {
        await api.post('/auth/logout')
      } catch (err) {
        console.warn('Logout failed (probably token expired):', err)
      } finally {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        this.$router.push({ name: 'Login' })
      }
    }
  },
  mounted() {
    document.addEventListener('click', this.handleClickOutside)
    document.addEventListener('keydown', this.handleKeydown)

    // coba ambil dari localStorage dulu biar lebih cepat
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      this.user = JSON.parse(storedUser)
    } else {
      this.fetchUser()
    }
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside)
    document.removeEventListener('keydown', this.handleKeydown)
  }
}
</script>
