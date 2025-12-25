export type TaxMode = "NONE" | "GST" | "VAT" | "SALES_TAX";

export interface TaxConfig {
  mode: TaxMode;
  rate: number; // 0.18, 0.20, 0.05, etc
  label: string; // "GST", "VAT", "Sales Tax"
}
