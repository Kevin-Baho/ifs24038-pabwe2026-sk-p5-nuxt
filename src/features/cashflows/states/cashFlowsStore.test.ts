import { describe, it, expect, beforeEach, vi } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useCashFlowsStore } from "./cashFlowsStore";
import { cashFlowApi, type CashFlow } from "../api/cashFlowApi";

describe("cashFlowsStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.restoreAllMocks();
  });

  it("initializes with default values", () => {
    const store = useCashFlowsStore();
    expect(store.cashFlows).toEqual([]);
    expect(store.currentCashFlow).toBeNull();
    expect(store.labels).toEqual([]);
    expect(store.stats).toEqual({ total_inflow: 0, total_outflow: 0, balance: 0 });
    expect(store.isLoading).toBe(false);
    expect(store.error).toBeNull();
  });

  describe("fetchCashFlows", () => {
    it("successfully fetches list", async () => {
      const store = useCashFlowsStore();
      const mockList: CashFlow[] = [
        {
          id: "1",
          type: "inflow",
          source: "cash",
          label: "Gaji",
          amount: 5000000,
          created_at: "2026-03-01"
        }
      ];
      vi.spyOn(cashFlowApi, "getAll").mockResolvedValue({ success: true, data: mockList });

      const res = await store.fetchCashFlows();
      expect(res).toEqual(mockList);
      expect(store.cashFlows).toEqual(mockList);
    });

    it("handles error during fetchCashFlows with custom and fallback message", async () => {
      const store = useCashFlowsStore();
      vi.spyOn(cashFlowApi, "getAll").mockRejectedValue(new Error("Custom error"));

      await expect(store.fetchCashFlows()).rejects.toThrow("Custom error");
      expect(store.error).toBe("Custom error");

      vi.spyOn(cashFlowApi, "getAll").mockRejectedValue({});
      await expect(store.fetchCashFlows()).rejects.toEqual({});
      expect(store.error).toBe("Gagal memuat catatan arus kas");
    });
  });

  describe("fetchCashFlowById", () => {
    it("successfully fetches single item", async () => {
      const store = useCashFlowsStore();
      const item: CashFlow = {
        id: "1",
        type: "inflow",
        source: "cash",
        label: "Bonus",
        amount: 200000,
        created_at: "2026-03-01"
      };
      vi.spyOn(cashFlowApi, "getById").mockResolvedValue({ success: true, data: item });

      const res = await store.fetchCashFlowById("1");
      expect(res).toEqual(item);
      expect(store.currentCashFlow).toEqual(item);
    });

    it("handles error during fetchCashFlowById", async () => {
      const store = useCashFlowsStore();
      vi.spyOn(cashFlowApi, "getById").mockRejectedValue({});

      await expect(store.fetchCashFlowById("1")).rejects.toEqual({});
      expect(store.error).toBe("Gagal memuat rincian arus kas");
    });
  });

  describe("createCashFlow", () => {
    it("successfully creates item and updates stats", async () => {
      const store = useCashFlowsStore();
      const item: CashFlow = {
        id: "2",
        type: "inflow",
        source: "savings",
        label: "Bunga",
        amount: 10000,
        created_at: "2026-03-01"
      };
      vi.spyOn(cashFlowApi, "create").mockResolvedValue({
        success: true,
        message: "Created",
        data: item
      });
      const getStatsSpy = vi.spyOn(cashFlowApi, "getStats").mockResolvedValue({
        success: true,
        data: { total_inflow: 10000, total_outflow: 0, balance: 10000 }
      });

      const res = await store.createCashFlow({
        type: "inflow",
        source: "savings",
        label: "Bunga",
        amount: 10000
      });

      expect(res.data).toEqual(item);
      expect(getStatsSpy).toHaveBeenCalled();
    });

    it("handles create error", async () => {
      const store = useCashFlowsStore();
      vi.spyOn(cashFlowApi, "create").mockRejectedValue({});

      await expect(
        store.createCashFlow({
          type: "inflow",
          source: "savings",
          label: "Bunga",
          amount: 10000
        })
      ).rejects.toEqual({});
      expect(store.error).toBe("Gagal menambahkan catatan arus kas");
    });
  });

  describe("updateCashFlow", () => {
    it("successfully updates item and updates stats", async () => {
      const store = useCashFlowsStore();
      const item: CashFlow = {
        id: "2",
        type: "inflow",
        source: "savings",
        label: "Bunga Updated",
        amount: 15000,
        created_at: "2026-03-01"
      };
      vi.spyOn(cashFlowApi, "update").mockResolvedValue({
        success: true,
        message: "Updated",
        data: item
      });
      const getStatsSpy = vi.spyOn(cashFlowApi, "getStats").mockResolvedValue({
        success: true,
        data: { total_inflow: 15000, total_outflow: 0, balance: 15000 }
      });

      const res = await store.updateCashFlow("2", {
        type: "inflow",
        source: "savings",
        label: "Bunga Updated",
        amount: 15000
      });

      expect(res.data).toEqual(item);
      expect(getStatsSpy).toHaveBeenCalled();
    });

    it("handles update error", async () => {
      const store = useCashFlowsStore();
      vi.spyOn(cashFlowApi, "update").mockRejectedValue({});

      await expect(
        store.updateCashFlow("2", {
          type: "inflow",
          source: "savings",
          label: "Bunga Updated",
          amount: 15000
        })
      ).rejects.toEqual({});
      expect(store.error).toBe("Gagal memperbarui catatan arus kas");
    });
  });

  describe("deleteCashFlow", () => {
    it("successfully deletes item and filters local list", async () => {
      const store = useCashFlowsStore();
      store.cashFlows = [
        { id: "1", type: "inflow", source: "cash", label: "A", amount: 10, created_at: "" },
        { id: "2", type: "inflow", source: "cash", label: "B", amount: 20, created_at: "" }
      ];
      vi.spyOn(cashFlowApi, "delete").mockResolvedValue({ success: true, message: "Deleted" });
      const getStatsSpy = vi.spyOn(cashFlowApi, "getStats").mockResolvedValue({
        success: true,
        data: { total_inflow: 20, total_outflow: 0, balance: 20 }
      });

      const res = await store.deleteCashFlow("1");
      expect(res.success).toBe(true);
      expect(store.cashFlows.length).toBe(1);
      expect(store.cashFlows[0].id).toBe("2");
      expect(getStatsSpy).toHaveBeenCalled();
    });

    it("handles delete error", async () => {
      const store = useCashFlowsStore();
      vi.spyOn(cashFlowApi, "delete").mockRejectedValue({});

      await expect(store.deleteCashFlow("1")).rejects.toEqual({});
      expect(store.error).toBe("Gagal menghapus arus kas");
    });
  });

  describe("resetCashFlows", () => {
    it("successfully resets all cash flows and stats", async () => {
      const store = useCashFlowsStore();
      store.cashFlows = [
        { id: "1", type: "inflow", source: "cash", label: "A", amount: 10, created_at: "" }
      ];
      vi.spyOn(cashFlowApi, "reset").mockResolvedValue({ success: true, message: "Reset" });

      const res = await store.resetCashFlows();
      expect(res.success).toBe(true);
      expect(store.cashFlows).toEqual([]);
      expect(store.stats).toEqual({ total_inflow: 0, total_outflow: 0, balance: 0 });
    });

    it("handles reset error", async () => {
      const store = useCashFlowsStore();
      vi.spyOn(cashFlowApi, "reset").mockRejectedValue({});

      await expect(store.resetCashFlows()).rejects.toEqual({});
      expect(store.error).toBe("Gagal mereset arus kas");
    });
  });

  describe("fetchLabels", () => {
    it("fetches and sets labels list", async () => {
      const store = useCashFlowsStore();
      vi.spyOn(cashFlowApi, "getLabels").mockResolvedValue({
        success: true,
        data: ["Makanan", "Transport"]
      });

      const res = await store.fetchLabels();
      expect(res).toEqual(["Makanan", "Transport"]);
      expect(store.labels).toEqual(["Makanan", "Transport"]);
    });

    it("returns empty array on fetchLabels error", async () => {
      const store = useCashFlowsStore();
      vi.spyOn(cashFlowApi, "getLabels").mockRejectedValue(new Error("fail"));

      const res = await store.fetchLabels();
      expect(res).toEqual([]);
    });
  });

  describe("fetchStats", () => {
    it("fetches and sets stats", async () => {
      const store = useCashFlowsStore();
      const mockStats = { total_inflow: 100, total_outflow: 40, balance: 60 };
      vi.spyOn(cashFlowApi, "getStats").mockResolvedValue({ success: true, data: mockStats });

      const res = await store.fetchStats();
      expect(res).toEqual(mockStats);
      expect(store.stats).toEqual(mockStats);
    });

    it("returns null on fetchStats error", async () => {
      const store = useCashFlowsStore();
      vi.spyOn(cashFlowApi, "getStats").mockRejectedValue(new Error("fail"));

      const res = await store.fetchStats();
      expect(res).toBeNull();
    });
  });
});

