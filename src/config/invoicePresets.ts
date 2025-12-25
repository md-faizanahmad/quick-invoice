import type { TaxConfig } from "../types/tax";

export type InvoicePresetKey =
  | "INDIA_GST"
  | "UK_VAT"
  | "UAE_VAT"
  | "SAUDI_VAT"
  | "US_SALES"
  | "NO_TAX";

export interface InvoicePreset {
  key: InvoicePresetKey;
  label: string;
  tax: TaxConfig;
}

export const INVOICE_PRESETS: InvoicePreset[] = [
  {
    key: "INDIA_GST",
    label: "GST Invoice (India)",
    tax: { mode: "GST", rate: 0.18, label: "GST" },
  },
  {
    key: "UK_VAT",
    label: "VAT Invoice (UK / EU)",
    tax: { mode: "VAT", rate: 0.2, label: "VAT" },
  },
  {
    key: "UAE_VAT",
    label: "VAT Invoice (UAE)",
    tax: { mode: "VAT", rate: 0.05, label: "VAT" },
  },
  {
    key: "SAUDI_VAT",
    label: "VAT Invoice (Saudi Arabia)",
    tax: { mode: "VAT", rate: 0.15, label: "VAT" },
  },
  {
    key: "US_SALES",
    label: "Sales Tax Invoice (USA)",
    tax: { mode: "SALES_TAX", rate: 0.07, label: "Sales Tax" },
  },
  {
    key: "NO_TAX",
    label: "Simple Invoice (No Tax)",
    tax: { mode: "NONE", rate: 0, label: "No Tax" },
  },
];
