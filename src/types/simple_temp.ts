import type { InvoiceTemplate } from "./invoiceTemplates";

export const SIMPLE_TEMPLATE: InvoiceTemplate = {
  key: "simple",
  label: "Simple",
  description: "Clean and minimal invoice with no heavy styling",
  layout: {
    header: "left",
    bordered: false,
  },

  colors: {
    accent: "#000000",
    text: "#111827",
  },

  typography: {
    heading: 18,
    body: 9,
  },

  show: {
    logo: true,
    qr: false,
    tableHeaderBg: false,
  },
};
