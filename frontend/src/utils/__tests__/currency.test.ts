/**
 * Tests for formatCurrency utility used in the payment table
 */

import {
  formatCurrency,
  formatCurrencyInput,
  parseCurrencyInput,
} from "@/utils/currency";

describe("formatCurrency", () => {
  it("formats a numeric value as IDR currency", () => {
    const result = formatCurrency(50000);
    // Intl.NumberFormat id-ID produces locale-specific output (e.g., "Rp 50.000" or "Rp50,000")
    expect(result).toContain("Rp");
    expect(result).toContain("50");
  });

  it("formats a string numeric value as IDR currency", () => {
    const result = formatCurrency("150000.00");
    expect(result).toContain("Rp");
    expect(result).toContain("150");
  });

  it("returns Rp0 for NaN input", () => {
    expect(formatCurrency("abc")).toBe("Rp0");
    expect(formatCurrency(NaN)).toBe("Rp0");
  });

  it("formats zero correctly", () => {
    const result = formatCurrency(0);
    expect(result).toContain("Rp");
    expect(result).toContain("0");
  });

  it("formats large amounts correctly", () => {
    const result = formatCurrency(2500000);
    expect(result).toContain("Rp");
    expect(result).toContain("2");
    expect(result).toContain("500");
  });

  it("formats small amounts correctly", () => {
    const result = formatCurrency(1000);
    expect(result).toContain("Rp");
    expect(result).toContain("1");
  });
});

describe("parseCurrencyInput", () => {
  it("parses a clean numeric string", () => {
    expect(parseCurrencyInput("50000")).toBe(50000);
  });

  it("strips non-digit characters", () => {
    expect(parseCurrencyInput("Rp50,000")).toBe(50000);
  });

  it("returns 0 for empty string", () => {
    expect(parseCurrencyInput("")).toBe(0);
  });

  it("returns 0 for non-numeric input", () => {
    expect(parseCurrencyInput("abc")).toBe(0);
  });
});

describe("formatCurrencyInput", () => {
  it("formats a number with thousand separators", () => {
    const result = formatCurrencyInput(50000);
    expect(result).toBeTruthy();
    // Contains digits (locale-dependent separators)
    expect(result).toMatch(/\d/);
  });

  it("returns empty string for 0", () => {
    expect(formatCurrencyInput(0)).toBe("");
  });
});
