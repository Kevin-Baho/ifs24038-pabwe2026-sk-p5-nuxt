import Swal from "sweetalert2";

export const formatRupiah = (amount: number | string): string => {
  const numericAmount = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(numericAmount)) return "Rp 0";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(numericAmount);
};

export const formatDate = (dateString: string): string => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(date);
};

export const showSuccessDialog = async (message: string, title = "Berhasil!") => {
  return await Swal.fire({
    icon: "success",
    title,
    text: message,
    confirmButtonColor: "#4f46e5"
  });
};

export const showErrorDialog = async (message: string, title = "Terjadi Kesalahan") => {
  return await Swal.fire({
    icon: "error",
    title,
    text: message,
    confirmButtonColor: "#ef4444"
  });
};

export const showConfirmDialog = async (
  message: string,
  title = "Apakah Anda Yakin?",
  confirmText = "Ya, Lanjutkan"
): Promise<boolean> => {
  const result = await Swal.fire({
    icon: "warning",
    title,
    text: message,
    showCancelButton: true,
    confirmButtonColor: "#4f46e5",
    cancelButtonColor: "#64748b",
    confirmButtonText: confirmText,
    cancelButtonText: "Batal"
  });
  return result.isConfirmed;
};

