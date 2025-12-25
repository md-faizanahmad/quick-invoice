import type { Invoice } from "../types/invoice";
import { INVOICE_PRESETS } from "../config/invoicePresets";

export function createEmptyInvoice(presetKey: string): Invoice {
  const preset = INVOICE_PRESETS.find((p) => p.key === presetKey);
  if (!preset) throw new Error("Invalid invoice preset");

  return {
    id: crypto.randomUUID(),
    invoiceNumber: "",
    presetKey: preset.key,
    tax: preset.tax,

    currency: {
      code: "INR",
      locale: "en-IN",
    },

    seller: {
      name: "",
      address: "",
      taxId: preset.tax.mode === "NONE" ? undefined : "",
    },

    customer: {
      name: "",
      address: "",
      taxId: preset.tax.mode === "NONE" ? undefined : "",
    },

    items: [],
    totals: {
      subtotal: 0,
      taxAmount: preset.tax.mode === "NONE" ? undefined : 0,
      total: 0,
    },

    qrEnabled: false,
    createdAt: Date.now(),
  };
}
