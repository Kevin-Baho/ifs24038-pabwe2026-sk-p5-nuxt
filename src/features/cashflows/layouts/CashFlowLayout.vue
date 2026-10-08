<template>
  <div class="min-h-screen bg-slate-50 flex flex-col">
    <!-- Navbar -->
    <NavbarComponent @toggle-sidebar="toggleSidebar" />

    <!-- Backdrop for Mobile -->
    <div
      v-if="isSidebarOpen"
      @click="closeSidebar"
      class="fixed inset-0 z-30 bg-slate-900/40 lg:hidden"
      data-testid="sidebar-backdrop"
    ></div>

    <!-- Main Content Area with Sidebar -->
    <div class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex">
      <SidebarComponent :is-open="isSidebarOpen" @close-sidebar="closeSidebar" />

      <main class="flex-1 lg:pl-8 min-w-0">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import NavbarComponent from "../components/NavbarComponent.vue";
import SidebarComponent from "../components/SidebarComponent.vue";

const isSidebarOpen = ref(false);

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const closeSidebar = () => {
  isSidebarOpen.value = false;
};
</script>

