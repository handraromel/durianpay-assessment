export function formatCurrency(value: number | string): string {
  const numValue = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(numValue)) return "Rp0";

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(numValue)
    .replace("IDR", "Rp");
}

export function parseCurrencyInput(value: string): number {
  const cleaned = value.replace(/[^\d]/g, "");
  return parseInt(cleaned, 10) || 0;
}

export function formatCurrencyInput(value: number): string {
  if (!value || value === 0) return "";
  return new Intl.NumberFormat("id-ID").format(value);
}
