<template>
  <div class="space-y-6">
    <!-- Header Page & Action Buttons -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h2 class="text-2xl font-bold text-slate-800">Ringkasan Arus Kas</h2>
        <p class="text-sm text-slate-500 mt-1">Pantau pergerakan arus kas masuk dan keluar secara terperinci</p>
      </div>
      <div class="flex items-center gap-2">
        <button
          @click="handleReset"
          class="px-3.5 py-2 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl text-sm font-semibold transition-colors flex items-center space-x-1.5"
          data-testid="reset-button"
        >
          <RotateCcw class="w-4 h-4" />
          <span>Reset Kas</span>
        </button>
        <button
          @click="openAddModal"
          class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-sm transition-colors flex items-center space-x-1.5"
          data-testid="add-transaction-button"
        >
          <Plus class="w-4 h-4" />
          <span>Tambah Transaksi</span>
        </button>
      </div>
    </div>

    <!-- Summary Balance Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-5" data-testid="stats-cards">
      <!-- Total Saldo -->
      <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div>
          <span class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Saldo Bersih</span>
          <h3 class="text-2xl font-bold text-slate-900 mt-1" data-testid="balance-amount">{{ formatRupiah(stats.balance) }}</h3>
        </div>
        <div class="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
          <Wallet class="w-6 h-6" />
        </div>
      </div>

      <!-- Total Pemasukan -->
      <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div>
          <span class="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Total Pemasukan</span>
          <h3 class="text-2xl font-bold text-emerald-600 mt-1" data-testid="inflow-amount">{{ formatRupiah(stats.total_inflow) }}</h3>
        </div>
        <div class="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
          <TrendingUp class="w-6 h-6" />
        </div>
      </div>

      <!-- Total Pengeluaran -->
      <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div>
          <span class="text-xs font-semibold text-rose-600 uppercase tracking-wider">Total Pengeluaran</span>
          <h3 class="text-2xl font-bold text-rose-600 mt-1" data-testid="outflow-amount">{{ formatRupiah(stats.total_outflow) }}</h3>
        </div>
        <div class="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
          <TrendingDown class="w-6 h-6" />
        </div>
      </div>
    </div>

    <!-- Filter Bar -->
    <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
      <div class="flex items-center justify-between">
        <span class="text-xs font-bold uppercase tracking-wider text-slate-500">Filter Data</span>
        <button
          @click="resetFilters"
          class="text-xs text-indigo-600 hover:text-indigo-800 font-semibold"
          data-testid="reset-filter-btn"
        >
          Bersihkan Filter
        </button>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
        <!-- Filter Tipe -->
        <div>
          <select
            v-model="filters.type"
            @change="applyFilters"
            class="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-indigo-500"
            data-testid="filter-type"
          >
            <option value="">Semua Tipe</option>
            <option value="inflow">Pemasukan (Inflow)</option>
            <option value="outflow">Pengeluaran (Outflow)</option>
          </select>
        </div>

        <!-- Filter Sumber -->
        <div>
          <select
            v-model="filters.source"
            @change="applyFilters"
            class="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-indigo-500"
            data-testid="filter-source"
          >
            <option value="">Semua Sumber</option>
            <option value="cash">Tunai (Cash)</option>
            <option value="savings">Tabungan (Savings)</option>
            <option value="loans">Pinjaman (Loans)</option>
          </select>
        </div>

        <!-- Filter Label -->
        <div>
          <input
            type="text"
            v-model="filters.label"
            @input="applyFilters"
            placeholder="Cari label/kategori..."
            class="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-indigo-500"
            data-testid="filter-label"
          />
        </div>

        <!-- Start Date -->
        <div>
          <input
            type="date"
            v-model="filters.start_date"
            @change="applyFilters"
            class="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-indigo-500"
            data-testid="filter-start-date"
          />
        </div>

        <!-- End Date -->
        <div>
          <input
            type="date"
            v-model="filters.end_date"
            @change="applyFilters"
            class="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-indigo-500"
            data-testid="filter-end-date"
          />
        </div>
      </div>
    </div>

    <!-- Cash Flows Table -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      <div v-if="isLoading" class="p-12 text-center" data-testid="loading-indicator">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent"></div>
        <p class="text-sm text-slate-500 mt-2">Memuat catatan transaksi...</p>
      </div>

      <div v-else-if="cashFlows.length === 0" class="p-12 text-center" data-testid="empty-cashflow">
        <p class="text-slate-500">Belum ada catatan arus kas yang ditemukan.</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse" data-testid="cashflow-table">
          <thead>
            <tr class="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-500">
              <th class="py-3 px-4">Tanggal</th>
              <th class="py-3 px-4">Kategori / Label</th>
              <th class="py-3 px-4">Sumber</th>
              <th class="py-3 px-4">Nominal</th>
              <th class="py-3 px-4">Lampiran</th>
              <th class="py-3 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-sm">
            <tr
              v-for="item in cashFlows"
              :key="item.id"
              class="hover:bg-slate-50/60 transition-colors"
              :data-testid="`row-${item.id}`"
            >
              <td class="py-3.5 px-4 text-xs text-slate-500 whitespace-nowrap">
                {{ formatDate(item.created_at) }}
              </td>
              <td class="py-3.5 px-4 font-medium text-slate-800">
                <router-link :to="`/detail/${item.id}`" class="hover:text-indigo-600 hover:underline">
                  {{ item.label }}
                </router-link>
              </td>
              <td class="py-3.5 px-4 text-xs capitalize text-slate-600">
                <span class="px-2 py-0.5 rounded-md bg-slate-100 font-medium">
                  {{ item.source }}
                </span>
              </td>
              <td class="py-3.5 px-4 font-semibold whitespace-nowrap" :class="item.type === 'inflow' ? 'text-emerald-600' : 'text-rose-600'">
                {{ item.type === 'inflow' ? '+' : '-' }} {{ formatRupiah(item.amount) }}
              </td>
              <td class="py-3.5 px-4">
                <a
                  v-if="item.photo"
                  :href="item.photo"
                  target="_blank"
                  class="text-xs text-indigo-600 hover:underline flex items-center space-x-1"
                  data-testid="attachment-link"
                >
                  <Paperclip class="w-3.5 h-3.5" />
                  <span>Foto Bukti</span>
                </a>
                <span v-else class="text-xs text-slate-400">-</span>
              </td>
              <td class="py-3.5 px-4 text-right whitespace-nowrap">
                <div class="inline-flex items-center space-x-1">
                  <router-link
                    :to="`/detail/${item.id}`"
                    class="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100 transition-colors"
                    title="Detail"
                    :data-testid="`detail-btn-${item.id}`"
                  >
                    <Eye class="w-4 h-4" />
                  </router-link>
                  <button
                    @click="openChangeModal(item)"
                    class="p-1.5 text-slate-400 hover:text-amber-600 rounded-lg hover:bg-slate-100 transition-colors"
                    title="Edit"
                    :data-testid="`edit-btn-${item.id}`"
                  >
                    <Edit3 class="w-4 h-4" />
                  </button>
                  <button
                    @click="handleDeleteItem(item.id)"
                    class="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 transition-colors"
                    title="Hapus"
                    :data-testid="`delete-btn-${item.id}`"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modals -->
    <AddModal
      :is-open="isAddOpen"
      @close="isAddOpen = false"
      @success="loadData"
    />

    <ChangeModal
      :is-open="isChangeOpen"
      :cash-flow="selectedItem"
      @close="isChangeOpen = false"
      @success="loadData"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Plus,
  RotateCcw,
  Paperclip,
  Eye,
  Edit3,
  Trash2
} from "lucide-vue-next";
import { useCashFlowsStore } from "../states/cashFlowsStore";
import { formatRupiah, formatDate, showConfirmDialog, showSuccessDialog, showErrorDialog } from "../../../helpers/toolsHelper";
import AddModal from "../modals/AddModal.vue";
import ChangeModal from "../modals/ChangeModal.vue";
import type { CashFlow } from "../api/cashFlowApi";

const cashFlowsStore = useCashFlowsStore();

const cashFlows = computed(() => cashFlowsStore.cashFlows);
const stats = computed(() => cashFlowsStore.stats);
const isLoading = computed(() => cashFlowsStore.isLoading);

const isAddOpen = ref(false);
const isChangeOpen = ref(false);
const selectedItem = ref<CashFlow | null>(null);

const filters = reactive({
  type: "",
  source: "",
  label: "",
  start_date: "",
  end_date: ""
});

const loadData = async () => {
  try {
    await cashFlowsStore.fetchCashFlows(filters);
    await cashFlowsStore.fetchStats();
  } catch (err: any) {
    showErrorDialog(err.message || "Gagal memuat data");
  }
};

const applyFilters = () => {
  loadData();
};

const resetFilters = () => {
  filters.type = "";
  filters.source = "";
  filters.label = "";
  filters.start_date = "";
  filters.end_date = "";
  loadData();
};

const openAddModal = () => {
  isAddOpen.value = true;
};

const openChangeModal = (item: CashFlow) => {
  selectedItem.value = item;
  isChangeOpen.value = true;
};

const handleDeleteItem = async (id: string) => {
  const confirmed = await showConfirmDialog("Apakah Anda yakin ingin menghapus catatan ini?", "Konfirmasi Hapus");
  if (confirmed) {
    try {
      await cashFlowsStore.deleteCashFlow(id);
      await showSuccessDialog("Catatan arus kas berhasil dihapus!");
      await loadData();
    } catch (err: any) {
      showErrorDialog(err.message || "Gagal menghapus catatan");
    }
  }
};

const handleReset = async () => {
  const confirmed = await showConfirmDialog(
    "Seluruh data catatan arus kas akan dihapus permanen. Lanjutkan?",
    "Peringatan Reset Kas"
  );
  if (confirmed) {
    try {
      await cashFlowsStore.resetCashFlows();
      await showSuccessDialog("Data kas berhasil direset!");
      await loadData();
    } catch (err: any) {
      showErrorDialog(err.message || "Gagal mereset kas");
    }
  }
};

onMounted(() => {
  loadData();
});
</script>

