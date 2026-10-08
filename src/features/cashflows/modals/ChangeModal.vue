<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs" data-testid="change-modal">
    <div class="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-100 max-h-[90vh] overflow-y-auto">
      <div class="flex items-center justify-between pb-4 border-b border-slate-100">
        <h3 class="text-lg font-bold text-slate-800">Ubah Catatan Arus Kas</h3>
        <button
          @click="emit('close')"
          class="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          data-testid="close-button"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="mt-4 space-y-4">
        <!-- Tipe Transaksi -->
        <div>
          <label class="block text-xs font-semibold text-slate-600 mb-1">Tipe Transaksi</label>
          <div class="grid grid-cols-2 gap-3">
            <button
              type="button"
              @click="type = 'inflow'"
              :class="[
                'py-2 rounded-lg text-sm font-semibold border flex items-center justify-center space-x-1.5 transition-colors',
                type === 'inflow' ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'border-slate-200 text-slate-600'
              ]"
              data-testid="type-inflow-btn"
            >
              <span>Pemasukan (Inflow)</span>
            </button>
            <button
              type="button"
              @click="type = 'outflow'"
              :class="[
                'py-2 rounded-lg text-sm font-semibold border flex items-center justify-center space-x-1.5 transition-colors',
                type === 'outflow' ? 'bg-rose-50 border-rose-500 text-rose-700' : 'border-slate-200 text-slate-600'
              ]"
              data-testid="type-outflow-btn"
            >
              <span>Pengeluaran (Outflow)</span>
            </button>
          </div>
        </div>

        <!-- Sumber Dana -->
        <div>
          <label for="change-source" class="block text-xs font-semibold text-slate-600 mb-1">Sumber Dana</label>
          <select
            id="change-source"
            v-model="source"
            class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            data-testid="source-select"
          >
            <option value="cash">Tunai (Cash)</option>
            <option value="savings">Tabungan (Savings)</option>
            <option value="loans">Pinjaman (Loans)</option>
          </select>
        </div>

        <!-- Label / Kategori -->
        <div>
          <label for="change-label" class="block text-xs font-semibold text-slate-600 mb-1">Kategori / Label</label>
          <input
            id="change-label"
            type="text"
            required
            :value="label"
            @input="onLabelChange"
            placeholder="Contoh: Gaji, Belanja, Transport"
            class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            data-testid="label-input"
          />
        </div>

        <!-- Nominal -->
        <div>
          <label for="change-amount" class="block text-xs font-semibold text-slate-600 mb-1">Nominal (Rp)</label>
          <input
            id="change-amount"
            type="number"
            min="1"
            required
            :value="amount"
            @input="onAmountChange"
            placeholder="Contoh: 50000"
            class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            data-testid="amount-input"
          />
        </div>

        <!-- Deskripsi Catatan -->
        <div>
          <label for="change-description" class="block text-xs font-semibold text-slate-600 mb-1">Deskripsi (Opsional)</label>
          <textarea
            id="change-description"
            rows="2"
            :value="description"
            @input="onDescriptionChange"
            placeholder="Keterangan tambahan..."
            class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            data-testid="description-input"
          ></textarea>
        </div>

        <!-- Lampiran Foto / Nota Baru -->
        <div>
          <label class="block text-xs font-semibold text-slate-600 mb-1">Perbarui Lampiran Foto (Opsional)</label>
          <input
            type="file"
            @change="handleFileChange"
            accept="image/*"
            class="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            data-testid="photo-input"
          />
          <div v-if="photoPreview || existingPhoto" class="mt-2 relative inline-block">
            <img
              :src="photoPreview || existingPhoto || ''"
              alt="Lampiran"
              class="h-20 w-20 object-cover rounded-lg border border-slate-200"
              data-testid="photo-preview"
            />
            <button
              v-if="photoPreview"
              type="button"
              @click="clearNewPhoto"
              class="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full p-0.5 hover:bg-rose-600"
              data-testid="clear-photo-btn"
            >
              <X class="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div class="flex justify-end space-x-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            @click="emit('close')"
            class="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            data-testid="cancel-btn"
          >
            Batal
          </button>
          <button
            type="submit"
            :disabled="isLoading"
            class="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors disabled:opacity-50"
            data-testid="submit-btn"
          >
            <span v-if="isLoading">Menyimpan...</span>
            <span v-else>Perbarui Transaksi</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { X } from "lucide-vue-next";
import { useCashFlowsStore } from "../states/cashFlowsStore";
import { useInput } from "../../../hooks/useInput";
import { showErrorDialog, showSuccessDialog } from "../../../helpers/toolsHelper";
import type { CashFlow } from "../api/cashFlowApi";

const props = defineProps<{
  isOpen: boolean;
  cashFlow: CashFlow | null;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "success"): void;
}>();

const cashFlowsStore = useCashFlowsStore();

const type = ref<"inflow" | "outflow">("inflow");
const source = ref<"cash" | "savings" | "loans">("cash");
const [label, onLabelChange, setLabel] = useInput("");
const [amount, onAmountChange, setAmount] = useInput("");
const [description, onDescriptionChange, setDescription] = useInput("");

const selectedPhoto = ref<File | null>(null);
const photoPreview = ref<string | null>(null);
const existingPhoto = ref<string | null>(null);
const isLoading = ref<boolean>(false);

watch(
  () => props.cashFlow,
  (val) => {
    if (val) {
      type.value = val.type;
      source.value = val.source;
      setLabel(val.label);
      setAmount(val.amount.toString());
      setDescription(val.description || "");
      existingPhoto.value = val.photo || null;
      selectedPhoto.value = null;
      photoPreview.value = null;
    }
  },
  { immediate: true }
);

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    const file = target.files[0];
    if (file.size > 2 * 1024 * 1024) {
      showErrorDialog("Ukuran file maksimal adalah 2MB");
      return;
    }
    selectedPhoto.value = file;
    photoPreview.value = URL.createObjectURL(file);
  }
};

const clearNewPhoto = () => {
  selectedPhoto.value = null;
  photoPreview.value = null;
};

const handleSubmit = async () => {
  if (!props.cashFlow) return;
  if (!label.value.trim() || !amount.value) {
    showErrorDialog("Kategori dan nominal wajib diisi");
    return;
  }

  isLoading.value = true;
  try {
    await cashFlowsStore.updateCashFlow(props.cashFlow.id, {
      type: type.value,
      source: source.value,
      label: label.value.trim(),
      amount: Number(amount.value),
      description: description.value.trim() || undefined,
      photo: selectedPhoto.value || undefined
    });
    await showSuccessDialog("Catatan arus kas berhasil diperbarui!");
    emit("success");
    emit("close");
  } catch (err: any) {
    await showErrorDialog(err.message || "Gagal memperbarui transaksi");
  } finally {
    isLoading.value = false;
  }
};
</script>

