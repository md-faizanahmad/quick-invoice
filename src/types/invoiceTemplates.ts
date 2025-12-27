// src/config/invoiceTemplates.ts

import { MODERN_TEMPLATE } from "./modern_temp";
import { PREMIUM_TEMPLATE } from "./premium_temp";
import { SIMPLE_TEMPLATE } from "./simple_temp";

export type InvoiceTemplateKey = "simple" | "modern" | "premium";

export interface InvoiceTemplate {
  key: InvoiceTemplateKey;
  label: string;
  description: string;
  layout: {
    header: "left" | "center" | "split";
    bordered: boolean;
  };

  colors: {
    accent: string;
    text: string;
    background?: string;
  };

  typography: {
    heading: number;
    body: number;
  };

  show: {
    logo: boolean;
    qr: boolean;
    tableHeaderBg: boolean;
  };
}
export const INVOICE_TEMPLATES: Record<InvoiceTemplateKey, InvoiceTemplate> = {
  simple: SIMPLE_TEMPLATE,
  modern: MODERN_TEMPLATE,
  premium: PREMIUM_TEMPLATE,
};
