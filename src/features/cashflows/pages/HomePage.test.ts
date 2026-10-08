import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import HomePage from "./HomePage.vue";
import { useCashFlowsStore } from "../states/cashFlowsStore";
import * as toolsHelper from "../../../helpers/toolsHelper";
import type { CashFlow } from "../api/cashFlowApi";

describe("HomePage.vue", () => {
  const dummyList: CashFlow[] = [
    {
      id: "cf-1",
      type: "inflow",
      source: "cash",
      label: "Gaji Pokok",
      amount: 5000000,
      photo: "https://photos/gaji.jpg",
      created_at: "2026-03-01T08:00:00Z"
    },
    {
      id: "cf-2",
      type: "outflow",
      source: "savings",
      label: "Belanja Pasar",
      amount: 250000,
      photo: null,
      created_at: "2026-03-02T10:00:00Z"
    }
  ];

  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it("loads and displays transactions and summary cards on mount", async () => {
    const store = useCashFlowsStore();
    vi.spyOn(store, "fetchCashFlows").mockImplementation(async () => {
      store.cashFlows = dummyList;
      return dummyList;
    });
    vi.spyOn(store, "fetchStats").mockImplementation(async () => {
      store.stats = { total_inflow: 5000000, total_outflow: 250000, balance: 4750000 };
      return store.stats;
    });

    const wrapper = mount(HomePage, {
      global: {
        stubs: {
          RouterLink: {
            template: "<a><slot /></a>"
          },
          AddModal: true,
          ChangeModal: true
        }
      }
    });

    await flushPromises();

    expect(wrapper.find("[data-testid='cashflow-table']").exists()).toBe(true);
    expect(wrapper.text()).toContain("Gaji Pokok");
    expect(wrapper.text()).toContain("Belanja Pasar");
    expect(wrapper.find("[data-testid='attachment-link']").exists()).toBe(true);
  });

  it("handles empty state when no cash flows are available", async () => {
    const store = useCashFlowsStore();
    vi.spyOn(store, "fetchCashFlows").mockResolvedValue([]);
    vi.spyOn(store, "fetchStats").mockResolvedValue(null as any);

    const wrapper = mount(HomePage, {
      global: {
        stubs: { RouterLink: true, AddModal: true, ChangeModal: true }
      }
    });
    await flushPromises();

    expect(wrapper.find("[data-testid='empty-cashflow']").exists()).toBe(true);
  });

  it("applies and resets filters", async () => {
    const store = useCashFlowsStore();
    const fetchSpy = vi.spyOn(store, "fetchCashFlows").mockResolvedValue([]);
    vi.spyOn(store, "fetchStats").mockResolvedValue(null as any);

    const wrapper = mount(HomePage, {
      global: {
        stubs: { RouterLink: true, AddModal: true, ChangeModal: true }
      }
    });
    await flushPromises();

    // Change type filter
    await wrapper.find("[data-testid='filter-type']").setValue("inflow");
    await wrapper.find("[data-testid='filter-type']").trigger("change");
    expect(fetchSpy).toHaveBeenCalled();

    // Reset filters
    await wrapper.find("[data-testid='reset-filter-btn']").trigger("click");
    expect(fetchSpy).toHaveBeenCalled();
  });

  it("opens AddModal and ChangeModal on button clicks", async () => {
    const store = useCashFlowsStore();
    store.cashFlows = dummyList;
    vi.spyOn(store, "fetchCashFlows").mockResolvedValue(dummyList);
    vi.spyOn(store, "fetchStats").mockResolvedValue(null as any);

    const wrapper = mount(HomePage, {
      global: {
        stubs: { RouterLink: true, AddModal: true, ChangeModal: true }
      }
    });
    await flushPromises();

    await wrapper.find("[data-testid='add-transaction-button']").trigger("click");
    await wrapper.find("[data-testid='edit-btn-cf-1']").trigger("click");
  });

  it("deletes a cash flow item when confirmed", async () => {
    const store = useCashFlowsStore();
    store.cashFlows = dummyList;
    vi.spyOn(store, "fetchCashFlows").mockResolvedValue(dummyList);
    vi.spyOn(store, "fetchStats").mockResolvedValue(null as any);
    const deleteSpy = vi.spyOn(store, "deleteCashFlow").mockResolvedValue({ success: true, message: "Deleted" });
    vi.spyOn(toolsHelper, "showConfirmDialog").mockResolvedValue(true);
    const showSuccessSpy = vi.spyOn(toolsHelper, "showSuccessDialog").mockResolvedValue({} as any);

    const wrapper = mount(HomePage, {
      global: {
        stubs: { RouterLink: true, AddModal: true, ChangeModal: true }
      }
    });
    await flushPromises();

    await wrapper.find("[data-testid='delete-btn-cf-1']").trigger("click");
    await flushPromises();

    expect(deleteSpy).toHaveBeenCalledWith("cf-1");
    expect(showSuccessSpy).toHaveBeenCalledWith("Catatan arus kas berhasil dihapus!");
  });

  it("handles delete failure", async () => {
    const store = useCashFlowsStore();
    store.cashFlows = dummyList;
    vi.spyOn(store, "fetchCashFlows").mockResolvedValue(dummyList);
    vi.spyOn(store, "fetchStats").mockResolvedValue(null as any);
    vi.spyOn(store, "deleteCashFlow").mockRejectedValue(new Error("Hapus gagal"));
    vi.spyOn(toolsHelper, "showConfirmDialog").mockResolvedValue(true);
    const showErrorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockResolvedValue({} as any);

    const wrapper = mount(HomePage, {
      global: {
        stubs: { RouterLink: true, AddModal: true, ChangeModal: true }
      }
    });
    await flushPromises();

    await wrapper.find("[data-testid='delete-btn-cf-1']").trigger("click");
    await flushPromises();

    expect(showErrorSpy).toHaveBeenCalledWith("Hapus gagal");
  });

  it("resets all cash flows when confirmed", async () => {
    const store = useCashFlowsStore();
    vi.spyOn(store, "fetchCashFlows").mockResolvedValue([]);
    vi.spyOn(store, "fetchStats").mockResolvedValue(null as any);
    const resetSpy = vi.spyOn(store, "resetCashFlows").mockResolvedValue({ success: true, message: "Reset" });
    vi.spyOn(toolsHelper, "showConfirmDialog").mockResolvedValue(true);
    const showSuccessSpy = vi.spyOn(toolsHelper, "showSuccessDialog").mockResolvedValue({} as any);

    const wrapper = mount(HomePage, {
      global: {
        stubs: { RouterLink: true, AddModal: true, ChangeModal: true }
      }
    });
    await flushPromises();

    await wrapper.find("[data-testid='reset-button']").trigger("click");
    await flushPromises();

    expect(resetSpy).toHaveBeenCalled();
    expect(showSuccessSpy).toHaveBeenCalledWith("Data kas berhasil direset!");
  });

  it("handles reset failure", async () => {
    const store = useCashFlowsStore();
    vi.spyOn(store, "fetchCashFlows").mockResolvedValue([]);
    vi.spyOn(store, "fetchStats").mockResolvedValue(null as any);
    vi.spyOn(store, "resetCashFlows").mockRejectedValue(new Error("Reset error"));
    vi.spyOn(toolsHelper, "showConfirmDialog").mockResolvedValue(true);
    const showErrorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockResolvedValue({} as any);

    const wrapper = mount(HomePage, {
      global: {
        stubs: { RouterLink: true, AddModal: true, ChangeModal: true }
      }
    });
    await flushPromises();

    await wrapper.find("[data-testid='reset-button']").trigger("click");
    await flushPromises();

    expect(showErrorSpy).toHaveBeenCalledWith("Reset error");
  });

  it("handles loadData error gracefully", async () => {
    const store = useCashFlowsStore();
    vi.spyOn(store, "fetchCashFlows").mockRejectedValue(new Error("Gagal load kas"));
    const showErrorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockResolvedValue({} as any);

    mount(HomePage, {
      global: {
        stubs: { RouterLink: true, AddModal: true, ChangeModal: true }
      }
    });
    await flushPromises();

    expect(showErrorSpy).toHaveBeenCalledWith("Gagal load kas");
  });

  it("applies start_date and end_date filters", async () => {
    const store = useCashFlowsStore();
    const fetchSpy = vi.spyOn(store, "fetchCashFlows").mockResolvedValue([]);
    vi.spyOn(store, "fetchStats").mockResolvedValue(null as any);

    const wrapper = mount(HomePage, {
      global: {
        stubs: { RouterLink: true, AddModal: true, ChangeModal: true }
      }
    });
    await flushPromises();

    await wrapper.find("[data-testid='filter-start-date']").setValue("2026-03-01");
    await wrapper.find("[data-testid='filter-start-date']").trigger("change");
    await wrapper.find("[data-testid='filter-end-date']").setValue("2026-03-31");
    await wrapper.find("[data-testid='filter-end-date']").trigger("change");
    await wrapper.find("[data-testid='filter-label']").setValue("Belanja");
    await wrapper.find("[data-testid='filter-label']").trigger("input");
    await flushPromises();

    expect(fetchSpy).toHaveBeenCalled();
  });
});

