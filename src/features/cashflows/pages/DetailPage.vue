<template>
  <div class="space-y-6">
    <div class="flex items-center space-x-4">
      <router-link
        to="/"
        class="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-slate-600"
        data-testid="back-button"
      >
        <ArrowLeft class="w-5 h-5" />
      </router-link>
      <div>
        <h2 class="text-2xl font-bold text-slate-800">Rincian Arus Kas</h2>
        <p class="text-xs text-slate-500">ID: {{ itemId }}</p>
      </div>
    </div>

    <div v-if="isLoading" class="p-12 text-center bg-white rounded-2xl border border-slate-200" data-testid="loading-state">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent"></div>
      <p class="text-sm text-slate-500 mt-2">Memuat rincian transaksi...</p>
    </div>

    <div v-else-if="!currentCashFlow" class="p-12 text-center bg-white rounded-2xl border border-slate-200" data-testid="empty-state">
      <p class="text-slate-500">Data arus kas tidak ditemukan.</p>
    </div>

    <div v-else class="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6" data-testid="detail-card">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-slate-100 gap-4">
        <div>
          <span
            :class="[
              'px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider',
              currentCashFlow.type === 'inflow' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
            ]"
            data-testid="type-badge"
          >
            {{ currentCashFlow.type === 'inflow' ? 'Pemasukan (Inflow)' : 'Pengeluaran (Outflow)' }}
          </span>
          <h3 class="text-2xl font-bold text-slate-900 mt-2" data-testid="detail-label">{{ currentCashFlow.label }}</h3>
          <p class="text-xs text-slate-400 mt-1">Dicatat pada {{ formatDate(currentCashFlow.created_at) }}</p>
        </div>

        <div class="text-left sm:text-right">
          <span class="text-xs text-slate-500 uppercase tracking-wider">Nominal</span>
          <p
            :class="[
              'text-3xl font-extrabold',
              currentCashFlow.type === 'inflow' ? 'text-emerald-600' : 'text-rose-600'
            ]"
            data-testid="detail-amount"
          >
            {{ currentCashFlow.type === 'inflow' ? '+' : '-' }} {{ formatRupiah(currentCashFlow.amount) }}
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 class="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Informasi Tambahan</h4>
          <dl class="space-y-3 text-sm">
            <div>
              <dt class="text-slate-400 text-xs">Sumber Dana</dt>
              <dd class="font-medium capitalize text-slate-800 mt-0.5">{{ currentCashFlow.source }}</dd>
            </div>
            <div>
              <dt class="text-slate-400 text-xs">Deskripsi</dt>
              <dd class="text-slate-700 whitespace-pre-wrap mt-0.5 bg-slate-50 p-3 rounded-xl border border-slate-100" data-testid="detail-description">
                {{ currentCashFlow.description || 'Tidak ada deskripsi catatan.' }}
              </dd>
            </div>
          </dl>
        </div>

        <div>
          <h4 class="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Bukti / Lampiran Foto</h4>
          <div v-if="currentCashFlow.photo" class="rounded-xl overflow-hidden border border-slate-200 max-w-sm">
            <img :src="currentCashFlow.photo" alt="Lampiran" class="w-full h-auto object-cover max-h-64" data-testid="detail-photo" />
          </div>
          <p v-else class="text-sm text-slate-400 bg-slate-50 p-4 rounded-xl border border-slate-100">
            Tidak ada lampiran foto untuk transaksi ini.
          </p>
        </div>
      </div>

      <div class="flex items-center justify-end space-x-3 pt-6 border-t border-slate-100">
        <button
          @click="openChangeModal"
          class="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-sm font-semibold transition-colors flex items-center space-x-1.5"
          data-testid="edit-detail-button"
        >
          <Edit3 class="w-4 h-4" />
          <span>Ubah Data</span>
        </button>
        <button
          @click="handleDelete"
          class="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-semibold transition-colors flex items-center space-x-1.5"
          data-testid="delete-detail-button"
        >
          <Trash2 class="w-4 h-4" />
          <span>Hapus Transaksi</span>
        </button>
      </div>
    </div>

    <!-- Edit Modal -->
    <ChangeModal
      :is-open="isChangeOpen"
      :cash-flow="currentCashFlow"
      @close="isChangeOpen = false"
      @success="loadDetail"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ArrowLeft, Edit3, Trash2 } from "lucide-vue-next";
import { useCashFlowsStore } from "../states/cashFlowsStore";
import { formatRupiah, formatDate, showConfirmDialog, showSuccessDialog, showErrorDialog } from "../../../helpers/toolsHelper";
import ChangeModal from "../modals/ChangeModal.vue";

const route = useRoute();
const router = useRouter();
const cashFlowsStore = useCashFlowsStore();

const itemId = computed(() => (route.params.id as string) || "");
const currentCashFlow = computed(() => cashFlowsStore.currentCashFlow);
const isLoading = computed(() => cashFlowsStore.isLoading);

const isChangeOpen = ref(false);

const loadDetail = async () => {
  if (!itemId.value) return;
  try {
    await cashFlowsStore.fetchCashFlowById(itemId.value);
  } catch (err: any) {
    showErrorDialog(err.message || "Gagal memuat rincian transaksi");
  }
};

const openChangeModal = () => {
  isChangeOpen.value = true;
};

const handleDelete = async () => {
  const confirmed = await showConfirmDialog("Hapus transaksi ini secara permanen?", "Konfirmasi Hapus");
  if (confirmed) {
    try {
      await cashFlowsStore.deleteCashFlow(itemId.value);
      await showSuccessDialog("Transaksi berhasil dihapus!");
      router.push("/");
    } catch (err: any) {
      showErrorDialog(err.message || "Gagal menghapus transaksi");
    }
  }
};

onMounted(() => {
  loadDetail();
});
</script>

