import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import DetailPage from "./DetailPage.vue";
import { useCashFlowsStore } from "../states/cashFlowsStore";
import * as toolsHelper from "../../../helpers/toolsHelper";
import type { CashFlow } from "../api/cashFlowApi";

const mockPush = vi.fn();
let mockRouteParams = { id: "cf-100" };

vi.mock("vue-router", () => ({
  useRoute: () => ({
    params: mockRouteParams
  }),
  useRouter: () => ({
    push: mockPush
  })
}));

describe("DetailPage.vue", () => {
  const dummyItem: CashFlow = {
    id: "cf-100",
    type: "inflow",
    source: "cash",
    label: "Penjualan Barang",
    amount: 150000,
    description: "Jual printer bekas",
    photo: "https://photos/printer.jpg",
    created_at: "2026-03-01T08:00:00Z"
  };

  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
    mockRouteParams = { id: "cf-100" };
  });

  it("fetches and renders detail information successfully", async () => {
    const store = useCashFlowsStore();
    vi.spyOn(store, "fetchCashFlowById").mockImplementation(async () => {
      store.currentCashFlow = dummyItem;
      return dummyItem;
    });

    const wrapper = mount(DetailPage, {
      global: {
        stubs: { RouterLink: true, ChangeModal: true }
      }
    });
    await flushPromises();

    expect(store.fetchCashFlowById).toHaveBeenCalledWith("cf-100");
    expect(wrapper.find("[data-testid='detail-card']").exists()).toBe(true);
    expect(wrapper.find("[data-testid='detail-label']").text()).toBe("Penjualan Barang");
    expect(wrapper.find("[data-testid='detail-photo']").exists()).toBe(true);
  });

  it("renders empty state when currentCashFlow is not found", async () => {
    const store = useCashFlowsStore();
    vi.spyOn(store, "fetchCashFlowById").mockResolvedValue(null as any);
    store.currentCashFlow = null;

    const wrapper = mount(DetailPage, {
      global: {
        stubs: { RouterLink: true, ChangeModal: true }
      }
    });
    await flushPromises();

    expect(wrapper.find("[data-testid='empty-state']").exists()).toBe(true);
  });

  it("opens ChangeModal on edit button click", async () => {
    const store = useCashFlowsStore();
    store.currentCashFlow = dummyItem;
    vi.spyOn(store, "fetchCashFlowById").mockResolvedValue(dummyItem);

    const wrapper = mount(DetailPage, {
      global: {
        stubs: { RouterLink: true, ChangeModal: true }
      }
    });
    await flushPromises();

    await wrapper.find("[data-testid='edit-detail-button']").trigger("click");
  });

  it("deletes transaction when confirmed and redirects to '/'", async () => {
    const store = useCashFlowsStore();
    store.currentCashFlow = dummyItem;
    vi.spyOn(store, "fetchCashFlowById").mockResolvedValue(dummyItem);
    const deleteSpy = vi.spyOn(store, "deleteCashFlow").mockResolvedValue({ success: true, message: "Deleted" });
    vi.spyOn(toolsHelper, "showConfirmDialog").mockResolvedValue(true);
    const showSuccessSpy = vi.spyOn(toolsHelper, "showSuccessDialog").mockResolvedValue({} as any);

    const wrapper = mount(DetailPage, {
      global: {
        stubs: { RouterLink: true, ChangeModal: true }
      }
    });
    await flushPromises();

    await wrapper.find("[data-testid='delete-detail-button']").trigger("click");
    await flushPromises();

    expect(deleteSpy).toHaveBeenCalledWith("cf-100");
    expect(showSuccessSpy).toHaveBeenCalledWith("Transaksi berhasil dihapus!");
    expect(mockPush).toHaveBeenCalledWith("/");
  });

  it("handles delete failure and shows error dialog", async () => {
    const store = useCashFlowsStore();
    store.currentCashFlow = dummyItem;
    vi.spyOn(store, "fetchCashFlowById").mockResolvedValue(dummyItem);
    vi.spyOn(store, "deleteCashFlow").mockRejectedValue(new Error("Gagal hapus detail"));
    vi.spyOn(toolsHelper, "showConfirmDialog").mockResolvedValue(true);
    const showErrorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockResolvedValue({} as any);

    const wrapper = mount(DetailPage, {
      global: {
        stubs: { RouterLink: true, ChangeModal: true }
      }
    });
    await flushPromises();

    await wrapper.find("[data-testid='delete-detail-button']").trigger("click");
    await flushPromises();

    expect(showErrorSpy).toHaveBeenCalledWith("Gagal hapus detail");
  });

  it("shows loading state when isLoading is true", () => {
    const store = useCashFlowsStore();
    store.isLoading = true;
    const wrapper = mount(DetailPage, {
      global: {
        stubs: { RouterLink: true, ChangeModal: true }
      }
    });
    expect(wrapper.find("[data-testid='loading-state']").exists()).toBe(true);
    expect(wrapper.text()).toContain("Memuat rincian transaksi...");
  });

  it("renders text when item has no photo", async () => {
    const store = useCashFlowsStore();
    const itemWithoutPhoto = { ...dummyItem, photo: null };
    vi.spyOn(store, "fetchCashFlowById").mockResolvedValue(itemWithoutPhoto as any);
    store.currentCashFlow = itemWithoutPhoto as any;

    const wrapper = mount(DetailPage, {
      global: {
        stubs: { RouterLink: true, ChangeModal: true }
      }
    });
    await flushPromises();

    expect(wrapper.text()).toContain("Tidak ada lampiran foto untuk transaksi ini.");
  });

  it("handles fetch detail error and shows error dialog", async () => {
    const store = useCashFlowsStore();
    vi.spyOn(store, "fetchCashFlowById").mockRejectedValue(new Error("Network Error"));
    const showErrorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockResolvedValue({} as any);

    mount(DetailPage, {
      global: {
        stubs: { RouterLink: true, ChangeModal: true }
      }
    });
    await flushPromises();

    expect(showErrorSpy).toHaveBeenCalledWith("Network Error");
  });
});

