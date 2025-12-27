import type { InvoiceTemplate } from "./invoiceTemplates";

export const PREMIUM_TEMPLATE: InvoiceTemplate = {
  key: "premium",
  label: "Premium",

  layout: {
    header: "center",
    bordered: true,
  },

  colors: {
    accent: "#7c3aed", // violet-600
    text: "#1f2937",
    background: "#faf5ff",
  },

  typography: {
    heading: 22,
    body: 10,
  },

  show: {
    logo: true,
    qr: true,
    tableHeaderBg: true,
  },
};
