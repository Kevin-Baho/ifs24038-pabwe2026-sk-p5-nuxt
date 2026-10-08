<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold text-slate-800">Daftar Pengguna Terdaftar</h2>
        <p class="text-sm text-slate-500 mt-1">Daftar pengguna sistem Delcom Cash Flow</p>
      </div>
      <button
        @click="loadUsers"
        :disabled="isLoading"
        class="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg text-sm font-semibold transition-colors"
        data-testid="refresh-users-button"
      >
        Segarkan
      </button>
    </div>

    <div v-if="isLoading" class="text-center py-12" data-testid="loading-state">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent"></div>
      <p class="text-slate-500 text-sm mt-2">Memuat data pengguna...</p>
    </div>

    <div v-else-if="users.length === 0" class="text-center py-12 bg-white rounded-xl border border-slate-200" data-testid="empty-state">
      <p class="text-slate-500">Tidak ada data pengguna ditemukan.</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="users-grid">
      <div
        v-for="user in users"
        :key="user.id"
        class="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex items-center space-x-4 hover:shadow-md transition-shadow"
      >
        <div class="w-12 h-12 rounded-full overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0 flex items-center justify-center font-bold text-indigo-600">
          <img
            v-if="user.photo"
            :src="user.photo"
            :alt="user.name"
            class="w-full h-full object-cover"
          />
          <span v-else>{{ user.name.charAt(0).toUpperCase() }}</span>
        </div>
        <div class="overflow-hidden">
          <h4 class="font-semibold text-slate-800 truncate">{{ user.name }}</h4>
          <p class="text-sm text-slate-500 truncate">{{ user.email }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useUsersStore } from "../states/usersStore";
import { showErrorDialog } from "../../../helpers/toolsHelper";

const usersStore = useUsersStore();

const users = computed(() => usersStore.users);
const isLoading = computed(() => usersStore.isLoading);

const loadUsers = async () => {
  try {
    await usersStore.fetchUsers();
  } catch (err: any) {
    await showErrorDialog(err.message || "Gagal memuat pengguna");
  }
};

onMounted(() => {
  loadUsers();
});
</script>

