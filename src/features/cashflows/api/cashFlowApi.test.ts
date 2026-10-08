import { describe, it, expect, vi, beforeEach } from "vitest";
import { cashFlowApi, type CashFlow } from "./cashFlowApi";
import * as apiHelper from "../../../helpers/apiHelper";

describe("cashFlowApi", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("calls getAll without parameters", async () => {
    const mockData: CashFlow[] = [];
    const fetchApiSpy = vi
      .spyOn(apiHelper, "fetchApi")
      .mockResolvedValue({ success: true, data: mockData });

    const result = await cashFlowApi.getAll();
    expect(fetchApiSpy).toHaveBeenCalledWith("/cash-flows");
    expect(result.data).toEqual(mockData);
  });

  it("calls getAll with all filter parameters", async () => {
    const fetchApiSpy = vi
      .spyOn(apiHelper, "fetchApi")
      .mockResolvedValue({ success: true, data: [] });

    await cashFlowApi.getAll({
      type: "inflow",
      source: "cash",
      label: "Gaji",
      start_date: "2026-01-01",
      end_date: "2026-01-31"
    });

    expect(fetchApiSpy).toHaveBeenCalledWith(
      "/cash-flows?type=inflow&source=cash&label=Gaji&start_date=2026-01-01&end_date=2026-01-31"
    );
  });

  it("calls getById", async () => {
    const mockItem = { id: "123", amount: 1000 } as CashFlow;
    const fetchApiSpy = vi
      .spyOn(apiHelper, "fetchApi")
      .mockResolvedValue({ success: true, data: mockItem });

    const result = await cashFlowApi.getById("123");
    expect(fetchApiSpy).toHaveBeenCalledWith("/cash-flows/123");
    expect(result.data).toEqual(mockItem);
  });

  it("creates cash flow with description and photo", async () => {
    const mockCreated = { id: "99", amount: 50000 } as CashFlow;
    const fetchApiSpy = vi
      .spyOn(apiHelper, "fetchApi")
      .mockResolvedValue({ success: true, message: "Created", data: mockCreated });

    const file = new File(["dummy"], "receipt.jpg", { type: "image/jpeg" });
    const result = await cashFlowApi.create({
      type: "outflow",
      source: "savings",
      label: "Belanja",
      amount: 50000,
      description: "Belanja mingguan",
      photo: file
    });

    expect(fetchApiSpy).toHaveBeenCalledWith(
      "/cash-flows",
      expect.objectContaining({
        method: "POST",
        body: expect.any(FormData)
      })
    );
    expect(result.data).toEqual(mockCreated);
  });

  it("creates cash flow without description and photo", async () => {
    const fetchApiSpy = vi
      .spyOn(apiHelper, "fetchApi")
      .mockResolvedValue({ success: true, message: "Created", data: {} as CashFlow });

    await cashFlowApi.create({
      type: "inflow",
      source: "cash",
      label: "Hadiah",
      amount: 20000
    });

    expect(fetchApiSpy).toHaveBeenCalledWith(
      "/cash-flows",
      expect.objectContaining({
        method: "POST"
      })
    );
  });

  it("updates cash flow with optional fields", async () => {
    const mockUpdated = { id: "10", amount: 75000 } as CashFlow;
    const fetchApiSpy = vi
      .spyOn(apiHelper, "fetchApi")
      .mockResolvedValue({ success: true, message: "Updated", data: mockUpdated });

    const file = new File(["dummy"], "receipt_new.jpg", { type: "image/jpeg" });
    const result = await cashFlowApi.update("10", {
      type: "outflow",
      source: "loans",
      label: "Cicilan",
      amount: 75000,
      description: "Cicilan ke-2",
      photo: file
    });

    expect(fetchApiSpy).toHaveBeenCalledWith(
      "/cash-flows/10",
      expect.objectContaining({
        method: "PUT",
        body: expect.any(FormData)
      })
    );
    expect(result.data).toEqual(mockUpdated);
  });

  it("updates cash flow without optional fields", async () => {
    const fetchApiSpy = vi
      .spyOn(apiHelper, "fetchApi")
      .mockResolvedValue({ success: true, message: "Updated", data: {} as CashFlow });

    await cashFlowApi.update("10", {
      type: "outflow",
      source: "loans",
      label: "Cicilan",
      amount: 75000
    });

    expect(fetchApiSpy).toHaveBeenCalledWith(
      "/cash-flows/10",
      expect.objectContaining({
        method: "PUT"
      })
    );
  });

  it("deletes a single cash flow item", async () => {
    const fetchApiSpy = vi
      .spyOn(apiHelper, "fetchApi")
      .mockResolvedValue({ success: true, message: "Deleted" });

    const result = await cashFlowApi.delete("123");
    expect(fetchApiSpy).toHaveBeenCalledWith("/cash-flows/123", {
      method: "DELETE"
    });
    expect(result.success).toBe(true);
  });

  it("resets all cash flow data", async () => {
    const fetchApiSpy = vi
      .spyOn(apiHelper, "fetchApi")
      .mockResolvedValue({ success: true, message: "Reset all" });

    const result = await cashFlowApi.reset();
    expect(fetchApiSpy).toHaveBeenCalledWith("/cash-flows", {
      method: "DELETE"
    });
    expect(result.success).toBe(true);
  });

  it("fetches labels list", async () => {
    const mockLabels = ["Makan", "Gaji"];
    const fetchApiSpy = vi
      .spyOn(apiHelper, "fetchApi")
      .mockResolvedValue({ success: true, data: mockLabels });

    const result = await cashFlowApi.getLabels();
    expect(fetchApiSpy).toHaveBeenCalledWith("/cash-flows/labels");
    expect(result.data).toEqual(mockLabels);
  });

  it("fetches cash flow stats", async () => {
    const mockStats = { total_inflow: 5000, total_outflow: 2000, balance: 3000 };
    const fetchApiSpy = vi
      .spyOn(apiHelper, "fetchApi")
      .mockResolvedValue({ success: true, data: mockStats });

    const result = await cashFlowApi.getStats();
    expect(fetchApiSpy).toHaveBeenCalledWith("/cash-flows/stats");
    expect(result.data).toEqual(mockStats);
  });
});

