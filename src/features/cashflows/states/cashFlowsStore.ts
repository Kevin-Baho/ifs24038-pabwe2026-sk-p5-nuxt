import { defineStore } from "pinia";
import { ref } from "vue";
import {
  cashFlowApi,
  type CashFlow,
  type CreateCashFlowPayload,
  type UpdateCashFlowPayload,
  type CashFlowFilterParams,
  type CashFlowStats
} from "../api/cashFlowApi";

export const useCashFlowsStore = defineStore("cashflows", () => {
  const cashFlows = ref<CashFlow[]>([]);
  const currentCashFlow = ref<CashFlow | null>(null);
  const labels = ref<string[]>([]);
  const stats = ref<CashFlowStats>({
    total_inflow: 0,
    total_outflow: 0,
    balance: 0
  });
  const isLoading = ref<boolean>(false);
  const error = ref<string | null>(null);

  const fetchCashFlows = async (params?: CashFlowFilterParams) => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await cashFlowApi.getAll(params);
      cashFlows.value = response.data;
      return response.data;
    } catch (err: any) {
      error.value = err.message || "Gagal memuat catatan arus kas";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const fetchCashFlowById = async (id: string) => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await cashFlowApi.getById(id);
      currentCashFlow.value = response.data;
      return response.data;
    } catch (err: any) {
      error.value = err.message || "Gagal memuat rincian arus kas";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const createCashFlow = async (payload: CreateCashFlowPayload) => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await cashFlowApi.create(payload);
      await fetchStats();
      return response;
    } catch (err: any) {
      error.value = err.message || "Gagal menambahkan catatan arus kas";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const updateCashFlow = async (id: string, payload: UpdateCashFlowPayload) => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await cashFlowApi.update(id, payload);
      await fetchStats();
      return response;
    } catch (err: any) {
      error.value = err.message || "Gagal memperbarui catatan arus kas";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const deleteCashFlow = async (id: string) => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await cashFlowApi.delete(id);
      cashFlows.value = cashFlows.value.filter((item) => item.id !== id);
      await fetchStats();
      return response;
    } catch (err: any) {
      error.value = err.message || "Gagal menghapus arus kas";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const resetCashFlows = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await cashFlowApi.reset();
      cashFlows.value = [];
      stats.value = {
        total_inflow: 0,
        total_outflow: 0,
        balance: 0
      };
      return response;
    } catch (err: any) {
      error.value = err.message || "Gagal mereset arus kas";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const fetchLabels = async () => {
    try {
      const response = await cashFlowApi.getLabels();
      labels.value = response.data;
      return response.data;
    } catch (err: any) {
      // Non-blocking
      return [];
    }
  };

  const fetchStats = async () => {
    try {
      const response = await cashFlowApi.getStats();
      stats.value = response.data;
      return response.data;
    } catch (err: any) {
      // Non-blocking
      return null;
    }
  };

  return {
    cashFlows,
    currentCashFlow,
    labels,
    stats,
    isLoading,
    error,
    fetchCashFlows,
    fetchCashFlowById,
    createCashFlow,
    updateCashFlow,
    deleteCashFlow,
    resetCashFlows,
    fetchLabels,
    fetchStats
  };
});

