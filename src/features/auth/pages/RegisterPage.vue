<template>
  <div>
    <h3 class="text-xl font-bold text-slate-900 mb-6 text-center">Buat Akun Baru</h3>
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label for="name" class="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap</label>
        <input
          id="name"
          type="text"
          required
          :value="name"
          @input="onNameChange"
          placeholder="Nama Anda"
          class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div>
        <label for="email" class="block text-sm font-medium text-slate-700 mb-1">Email</label>
        <input
          id="email"
          type="email"
          required
          :value="email"
          @input="onEmailChange"
          placeholder="nama@email.com"
          class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div>
        <label for="password" class="block text-sm font-medium text-slate-700 mb-1">Kata Sandi</label>
        <input
          id="password"
          type="password"
          required
          :value="password"
          @input="onPasswordChange"
          placeholder="••••••••"
          class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <button
        type="submit"
        :disabled="isLoading"
        class="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
      >
        <span v-if="isLoading">Mendaftarkan...</span>
        <span v-else>Daftar Sekarang</span>
      </button>

      <div class="text-center mt-4">
        <p class="text-sm text-slate-600">
          Sudah memiliki akun?
          <router-link to="/login" class="font-semibold text-indigo-600 hover:text-indigo-500 ml-1">
            Masuk
          </router-link>
        </p>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../states/authStore";
import { useInput } from "../../../hooks/useInput";
import { showErrorDialog, showSuccessDialog } from "../../../helpers/toolsHelper";

const router = useRouter();
const authStore = useAuthStore();

const [name, onNameChange] = useInput("");
const [email, onEmailChange] = useInput("");
const [password, onPasswordChange] = useInput("");

const isLoading = computed(() => authStore.isLoading);

const handleSubmit = async () => {
  try {
    await authStore.register({
      name: name.value,
      email: email.value,
      password: password.value
    });
    await showSuccessDialog("Pendaftaran berhasil! Silakan masuk ke akun Anda.");
    router.push("/login");
  } catch (err: any) {
    await showErrorDialog(err.message || "Gagal mendaftar");
  }
};
</script>

