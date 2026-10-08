import { describe, it, expect, vi, beforeEach } from "vitest";
import Swal from "sweetalert2";
import {
  formatRupiah,
  formatDate,
  showSuccessDialog,
  showErrorDialog,
  showConfirmDialog
} from "./toolsHelper";

vi.mock("sweetalert2", () => ({
  default: {
    fire: vi.fn()
  }
}));

describe("toolsHelper", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("formatRupiah", () => {
    it("should format valid numbers correctly", () => {
      const result = formatRupiah(100000);
      expect(result).toMatch(/Rp\s*100\.000/);
    });

    it("should format string numbers correctly", () => {
      const result = formatRupiah("50000");
      expect(result).toMatch(/Rp\s*50\.000/);
    });

    it("should return Rp 0 for invalid inputs", () => {
      expect(formatRupiah("abc")).toBe("Rp 0");
    });
  });

  describe("formatDate", () => {
    it("should format ISO string date properly", () => {
      const dateStr = "2026-03-10T14:30:00Z";
      const result = formatDate(dateStr);
      expect(result).not.toBe("-");
      expect(typeof result).toBe("string");
    });

    it("should return '-' for empty or falsy date string", () => {
      expect(formatDate("")).toBe("-");
    });

    it("should return '-' for invalid date string", () => {
      expect(formatDate("invalid-date-string")).toBe("-");
    });
  });

  describe("Dialogs", () => {
    it("should call Swal.fire with success configuration", async () => {
      (Swal.fire as any).mockResolvedValue({ isConfirmed: true });
      await showSuccessDialog("Operasi berhasil", "Sukses");

      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: "success",
          title: "Sukses",
          text: "Operasi berhasil"
        })
      );
    });

    it("should call Swal.fire with error configuration", async () => {
      (Swal.fire as any).mockResolvedValue({ isConfirmed: true });
      await showErrorDialog("Terjadi kegagalan");

      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: "error",
          title: "Terjadi Kesalahan",
          text: "Terjadi kegagalan"
        })
      );
    });

    it("should return true when confirm dialog is confirmed", async () => {
      (Swal.fire as any).mockResolvedValue({ isConfirmed: true });
      const confirmed = await showConfirmDialog("Hapus data ini?");

      expect(confirmed).toBe(true);
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: "warning",
          text: "Hapus data ini?",
          showCancelButton: true
        })
      );
    });

    it("should return false when confirm dialog is cancelled", async () => {
      (Swal.fire as any).mockResolvedValue({ isConfirmed: false });
      const confirmed = await showConfirmDialog("Hapus data ini?", "Konfirmasi", "Ya, Hapus");

      expect(confirmed).toBe(false);
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          confirmButtonText: "Ya, Hapus"
        })
      );
    });
  });
});

