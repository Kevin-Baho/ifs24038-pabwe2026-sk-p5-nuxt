import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import AddModal from "./AddModal.vue";
import { useCashFlowsStore } from "../states/cashFlowsStore";
import * as toolsHelper from "../../../helpers/toolsHelper";

describe("AddModal.vue", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it("does not render when isOpen is false", () => {
    const wrapper = mount(AddModal, {
      props: { isOpen: false }
    });
    expect(wrapper.find("[data-testid='add-modal']").exists()).toBe(false);
  });

  it("renders when isOpen is true and emits close on cancel/close button", async () => {
    const wrapper = mount(AddModal, {
      props: { isOpen: true }
    });
    expect(wrapper.find("[data-testid='add-modal']").exists()).toBe(true);

    await wrapper.find("[data-testid='close-button']").trigger("click");
    expect(wrapper.emitted("close")).toBeTruthy();

    await wrapper.find("[data-testid='cancel-btn']").trigger("click");
    expect(wrapper.emitted("close")?.length).toBe(2);
  });

  it("switches type between inflow and outflow", async () => {
    const wrapper = mount(AddModal, {
      props: { isOpen: true }
    });

    const outflowBtn = wrapper.find("[data-testid='type-outflow-btn']");
    const inflowBtn = wrapper.find("[data-testid='type-inflow-btn']");

    await outflowBtn.trigger("click");
    expect(outflowBtn.classes()).toContain("bg-rose-50");

    await inflowBtn.trigger("click");
    expect(inflowBtn.classes()).toContain("bg-emerald-50");
  });

  it("changes source selection", async () => {
    const wrapper = mount(AddModal, {
      props: { isOpen: true }
    });

    const select = wrapper.find("[data-testid='source-select']");
    await select.setValue("savings");
    expect((select.element as HTMLSelectElement).value).toBe("savings");
  });

  it("handles photo upload validation and preview", async () => {
    const showErrorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockResolvedValue({} as any);
    const wrapper = mount(AddModal, {
      props: { isOpen: true }
    });

    const fileInput = wrapper.find("[data-testid='photo-input']");

    // File > 2MB
    const largeFile = new File(["a".repeat(100)], "big.png", { type: "image/png" });
    Object.defineProperty(largeFile, "size", { value: 3 * 1024 * 1024 });
    Object.defineProperty(fileInput.element, "files", { value: [largeFile], configurable: true });
    await fileInput.trigger("change");
    expect(showErrorSpy).toHaveBeenCalledWith("Ukuran file maksimal adalah 2MB");

    // Valid file
    const validFile = new File(["valid"], "receipt.jpg", { type: "image/jpeg" });
    Object.defineProperty(validFile, "size", { value: 200 * 1024 });
    Object.defineProperty(fileInput.element, "files", { value: [validFile] });
    await fileInput.trigger("change");

    expect(wrapper.find("[data-testid='photo-preview']").exists()).toBe(true);

    // Clear photo
    await wrapper.find("[data-testid='clear-photo-btn']").trigger("click");
    expect(wrapper.find("[data-testid='photo-preview']").exists()).toBe(false);
  });

  it("validates empty label or amount before submission", async () => {
    const showErrorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockResolvedValue({} as any);
    const wrapper = mount(AddModal, {
      props: { isOpen: true }
    });

    await wrapper.find("form").trigger("submit.prevent");
    expect(showErrorSpy).toHaveBeenCalledWith("Kategori dan nominal wajib diisi");
  });

  it("creates cashflow successfully and emits success and close", async () => {
    const store = useCashFlowsStore();
    vi.spyOn(store, "createCashFlow").mockResolvedValue({
      success: true,
      message: "Created",
      data: {} as any
    });
    const showSuccessSpy = vi.spyOn(toolsHelper, "showSuccessDialog").mockResolvedValue({} as any);

    const wrapper = mount(AddModal, {
      props: { isOpen: true }
    });

    await wrapper.find("[data-testid='label-input']").setValue("Belanja");
    await wrapper.find("[data-testid='amount-input']").setValue("75000");
    await wrapper.find("[data-testid='description-input']").setValue("Belanja pasar");
    await wrapper.find("form").trigger("submit.prevent");
    await flushPromises();

    expect(store.createCashFlow).toHaveBeenCalledWith(
      expect.objectContaining({
        label: "Belanja",
        amount: 75000,
        description: "Belanja pasar"
      })
    );
    expect(showSuccessSpy).toHaveBeenCalledWith("Arus kas berhasil dicatat!");
    expect(wrapper.emitted("success")).toBeTruthy();
    expect(wrapper.emitted("close")).toBeTruthy();
  });

  it("handles failure during createCashFlow", async () => {
    const store = useCashFlowsStore();
    vi.spyOn(store, "createCashFlow").mockRejectedValue(new Error("Server error"));
    const showErrorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockResolvedValue({} as any);

    const wrapper = mount(AddModal, {
      props: { isOpen: true }
    });

    await wrapper.find("[data-testid='label-input']").setValue("Gaji");
    await wrapper.find("[data-testid='amount-input']").setValue("1000000");
    await wrapper.find("form").trigger("submit.prevent");
    await flushPromises();

    expect(showErrorSpy).toHaveBeenCalledWith("Server error");
  });
});

