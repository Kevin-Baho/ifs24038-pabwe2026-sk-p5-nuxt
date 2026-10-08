import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import ChangeModal from "./ChangeModal.vue";
import { useCashFlowsStore } from "../states/cashFlowsStore";
import * as toolsHelper from "../../../helpers/toolsHelper";
import type { CashFlow } from "../api/cashFlowApi";

describe("ChangeModal.vue", () => {
  const dummyItem: CashFlow = {
    id: "item-1",
    type: "inflow",
    source: "savings",
    label: "Bonus Project",
    amount: 150000,
    description: "Kompensasi lembur",
    photo: "https://example.com/receipt.jpg",
    created_at: "2026-03-01"
  };

  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it("does not render when isOpen is false", () => {
    const wrapper = mount(ChangeModal, {
      props: { isOpen: false, cashFlow: dummyItem }
    });
    expect(wrapper.find("[data-testid='change-modal']").exists()).toBe(false);
  });

  it("pre-fills form with existing cash flow data", () => {
    const wrapper = mount(ChangeModal, {
      props: { isOpen: true, cashFlow: dummyItem }
    });

    const labelInput = wrapper.find("[data-testid='label-input']");
    const amountInput = wrapper.find("[data-testid='amount-input']");
    const descriptionInput = wrapper.find("[data-testid='description-input']");

    expect((labelInput.element as HTMLInputElement).value).toBe("Bonus Project");
    expect((amountInput.element as HTMLInputElement).value).toBe("150000");
    expect((descriptionInput.element as HTMLTextAreaElement).value).toBe("Kompensasi lembur");
    expect(wrapper.find("[data-testid='photo-preview']").exists()).toBe(true);
  });

  it("changes source selection", async () => {
    const wrapper = mount(ChangeModal, {
      props: { isOpen: true, cashFlow: dummyItem }
    });

    const select = wrapper.find("[data-testid='source-select']");
    await select.setValue("loans");
    expect((select.element as HTMLSelectElement).value).toBe("loans");
  });

  it("handles photo change, size validation (>2MB), and cancel preview", async () => {
    const showErrorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockResolvedValue({} as any);
    const wrapper = mount(ChangeModal, {
      props: { isOpen: true, cashFlow: dummyItem }
    });

    const fileInput = wrapper.find("[data-testid='photo-input']");

    // File > 2MB
    const largeFile = new File(["a".repeat(100)], "big.png", { type: "image/png" });
    Object.defineProperty(largeFile, "size", { value: 3 * 1024 * 1024 });
    Object.defineProperty(fileInput.element, "files", { value: [largeFile], configurable: true });
    await fileInput.trigger("change");
    expect(showErrorSpy).toHaveBeenCalledWith("Ukuran file maksimal adalah 2MB");

    // Valid file
    const validFile = new File(["valid"], "new_receipt.jpg", { type: "image/jpeg" });
    Object.defineProperty(validFile, "size", { value: 200 * 1024 });
    Object.defineProperty(fileInput.element, "files", { value: [validFile] });
    await fileInput.trigger("change");

    expect(wrapper.find("[data-testid='clear-photo-btn']").exists()).toBe(true);
    await wrapper.find("[data-testid='clear-photo-btn']").trigger("click");
    expect(wrapper.find("[data-testid='clear-photo-btn']").exists()).toBe(false);
  });

  it("submits update successfully and emits success and close", async () => {
    const store = useCashFlowsStore();
    vi.spyOn(store, "updateCashFlow").mockResolvedValue({
      success: true,
      message: "Updated",
      data: dummyItem
    });
    const showSuccessSpy = vi.spyOn(toolsHelper, "showSuccessDialog").mockResolvedValue({} as any);

    const wrapper = mount(ChangeModal, {
      props: { isOpen: true, cashFlow: dummyItem }
    });

    await wrapper.find("[data-testid='type-outflow-btn']").trigger("click");
    await wrapper.find("[data-testid='label-input']").setValue("Bonus Updated");
    await wrapper.find("form").trigger("submit.prevent");
    await flushPromises();

    expect(store.updateCashFlow).toHaveBeenCalledWith(
      "item-1",
      expect.objectContaining({
        type: "outflow",
        label: "Bonus Updated"
      })
    );
    expect(showSuccessSpy).toHaveBeenCalledWith("Catatan arus kas berhasil diperbarui!");
    expect(wrapper.emitted("success")).toBeTruthy();
    expect(wrapper.emitted("close")).toBeTruthy();
  });

  it("validates empty label or amount before submission", async () => {
    const showErrorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockResolvedValue({} as any);
    const wrapper = mount(ChangeModal, {
      props: { isOpen: true, cashFlow: dummyItem }
    });

    await wrapper.find("[data-testid='label-input']").setValue("");
    await wrapper.find("form").trigger("submit.prevent");

    expect(showErrorSpy).toHaveBeenCalledWith("Kategori dan nominal wajib diisi");
  });

  it("does nothing on submit if cashFlow prop is null", async () => {
    const store = useCashFlowsStore();
    const updateSpy = vi.spyOn(store, "updateCashFlow");
    const wrapper = mount(ChangeModal, {
      props: { isOpen: true, cashFlow: null }
    });

    await wrapper.find("form").trigger("submit.prevent");
    expect(updateSpy).not.toHaveBeenCalled();
  });

  it("handles update failure and shows error dialog", async () => {
    const store = useCashFlowsStore();
    vi.spyOn(store, "updateCashFlow").mockRejectedValue(new Error("Gagal update"));
    const showErrorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockResolvedValue({} as any);

    const wrapper = mount(ChangeModal, {
      props: { isOpen: true, cashFlow: dummyItem }
    });

    await wrapper.find("form").trigger("submit.prevent");
    await flushPromises();

    expect(showErrorSpy).toHaveBeenCalledWith("Gagal update");
  });
});

