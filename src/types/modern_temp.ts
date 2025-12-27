import type { InvoiceTemplate } from "./invoiceTemplates";

export const MODERN_TEMPLATE: InvoiceTemplate = {
  key: "modern",
  label: "Modern",
  description: "Modern layout with accent colors and structured sections",
  layout: {
    header: "split",
    bordered: true,
  },

  colors: {
    accent: "#0284c7", // sky-600
    text: "#0f172a",
  },

  typography: {
    heading: 20,
    body: 9,
  },

  show: {
    logo: true,
    qr: true,
    tableHeaderBg: true,
  },
};
