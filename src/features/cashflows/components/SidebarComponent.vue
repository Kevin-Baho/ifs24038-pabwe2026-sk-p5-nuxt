<template>
  <aside
    :class="[
      'fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0',
      isOpen ? 'translate-x-0' : '-translate-x-0 lg:translate-x-0 max-lg:-translate-x-full'
    ]"
    data-testid="sidebar-aside"
  >
    <div class="h-full flex flex-col justify-between py-6 px-4">
      <div class="space-y-6">
        <div class="flex items-center justify-between px-2 lg:hidden">
          <span class="font-bold text-slate-800">Menu Navigasi</span>
          <button
            @click="emit('closeSidebar')"
            class="p-1 rounded-md text-slate-500 hover:bg-slate-100"
            data-testid="close-sidebar-button"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <nav class="space-y-1.5" data-testid="sidebar-nav">
          <router-link
            to="/"
            class="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors"
            :class="route?.path === '/' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'"
            data-testid="nav-link-dashboard"
          >
            <LayoutDashboard class="w-5 h-5" />
            <span>Dashboard Kas</span>
          </router-link>

          <router-link
            to="/users"
            class="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors"
            :class="route?.path === '/users' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'"
            data-testid="nav-link-users"
          >
            <Users class="w-5 h-5" />
            <span>Pengguna</span>
          </router-link>

          <router-link
            to="/profile"
            class="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors"
            :class="route?.path === '/profile' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'"
            data-testid="nav-link-profile"
          >
            <UserCircle class="w-5 h-5" />
            <span>Profil Saya</span>
          </router-link>
        </nav>
      </div>

      <div class="p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-500">
        <p class="font-semibold text-slate-700">Delcom Cash Flow</p>
        <p class="mt-1">Praktikum PABWE 2026</p>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { LayoutDashboard, Users, UserCircle, X } from "lucide-vue-next";

defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: "closeSidebar"): void;
}>();

const route = useRoute();
</script>

