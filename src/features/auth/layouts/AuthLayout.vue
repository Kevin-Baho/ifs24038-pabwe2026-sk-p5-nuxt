<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md text-center">
      <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600 text-white shadow-lg mb-4">
        <span class="text-2xl font-bold tracking-tight">DC</span>
      </div>
      <h2 class="text-3xl font-extrabold text-slate-900 tracking-tight">Delcom Cash Flow</h2>
      <p class="mt-2 text-sm text-slate-600">Manajemen catatan keuangan pribadi & tim secara praktis</p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
      <div class="bg-white py-8 px-6 shadow-xl rounded-2xl sm:px-10 border border-slate-100">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// AuthLayout component
</script>

