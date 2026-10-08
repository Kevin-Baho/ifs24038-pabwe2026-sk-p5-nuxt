<template>
  <header class="bg-white border-b border-slate-200 sticky top-0 z-30">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16 items-center">
        <!-- Logo / Brand & Mobile Toggle -->
        <div class="flex items-center space-x-3">
          <button
            @click="emit('toggleSidebar')"
            class="p-2 rounded-lg text-slate-600 hover:bg-slate-100 lg:hidden focus:outline-none"
            aria-label="Toggle menu"
            data-testid="toggle-sidebar-button"
          >
            <Menu class="w-6 h-6" />
          </button>
          <router-link to="/" class="flex items-center space-x-2">
            <div class="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
              DC
            </div>
            <span class="text-lg font-bold text-slate-900 tracking-tight hidden sm:inline">Delcom Cash Flow</span>
          </router-link>
        </div>

        <!-- Right Side User & Logout -->
        <div class="flex items-center space-x-4">
          <router-link
            to="/profile"
            class="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            data-testid="navbar-profile-link"
          >
            <div class="w-8 h-8 rounded-full overflow-hidden bg-slate-200 flex items-center justify-center font-bold text-xs text-indigo-600">
              <img
                v-if="currentUser?.photo"
                :src="currentUser.photo"
                :alt="currentUser.name"
                class="w-full h-full object-cover"
                data-testid="navbar-avatar-image"
              />
              <span v-else>{{ userInitial }}</span>
            </div>
            <span class="text-sm font-medium text-slate-700 hidden md:inline">
              {{ currentUser?.name || 'Pengguna' }}
            </span>
          </router-link>

          <button
            @click="handleLogout"
            class="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-rose-600 hover:bg-rose-50 text-sm font-medium transition-colors"
            data-testid="logout-button"
          >
            <LogOut class="w-4 h-4" />
            <span class="hidden sm:inline">Keluar</span>
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { Menu, LogOut } from "lucide-vue-next";
import { useAuthStore } from "../../auth/states/authStore";
import { useUsersStore } from "../../users/states/usersStore";
import { showConfirmDialog } from "../../../helpers/toolsHelper";

const emit = defineEmits<{
  (e: "toggleSidebar"): void;
}>();

const router = useRouter();
const authStore = useAuthStore();
const usersStore = useUsersStore();

const currentUser = computed(() => usersStore.currentUser);
const userInitial = computed(() => {
  return currentUser.value?.name ? currentUser.value.name.charAt(0).toUpperCase() : "U";
});

const handleLogout = async () => {
  const confirmed = await showConfirmDialog("Apakah Anda yakin ingin keluar?", "Konfirmasi Keluar");
  if (confirmed) {
    authStore.logout();
    router.push("/login");
  }
};
</script>

