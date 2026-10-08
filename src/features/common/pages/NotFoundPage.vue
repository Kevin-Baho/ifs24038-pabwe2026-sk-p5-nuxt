<template>
  <div class="min-h-screen bg-slate-50 flex items-center justify-center p-4">
    <div class="max-w-md w-full bg-white rounded-2xl p-8 border border-slate-200 text-center shadow-xs">
      <div class="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-4 font-extrabold text-2xl">
        404
      </div>
      <h2 class="text-xl font-bold text-slate-800">Halaman Tidak Ditemukan</h2>
      <p class="text-sm text-slate-500 mt-2 mb-6">
        Halaman yang Anda tuju mungkin telah dipindahkan atau tidak tersedia.
      </p>
      <router-link
        to="/"
        class="inline-flex items-center justify-center px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-colors"
        data-testid="back-home-button"
      >
        Kembali ke Beranda
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
// NotFoundPage component
</script>

