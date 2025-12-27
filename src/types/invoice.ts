import type { InvoiceTemplateKey } from "./invoiceTemplates";
import type { TaxConfig } from "./tax";

export type CurrencyCode = "INR" | "USD" | "EUR" | "GBP" | "AED" | "SAR";

export interface Currency {
  code: CurrencyCode;
  locale: string;
}

export interface InvoiceItem {
  id: string;
  name: string;
  hsn?: string;
  qty: number;
  price: number;
}

export interface Invoice {
  id: string; // UUID
  invoiceNumber: string; // 2025-GST-0007

  presetKey: string; // INDIA_GST, UK_VAT, etc
  tax: TaxConfig;

  currency: Currency;

  seller: {
    name: string;
    address: string;
    taxId?: string; // GSTIN / VAT ID / EIN etc
  };

  customer: {
    name: string;
    address: string;
    taxId?: string;
  };

  items: InvoiceItem[];

  totals: {
    subtotal: number;
    taxAmount?: number;
    total: number;
  };

  // new logo
  template: InvoiceTemplateKey;
  logo?: {
    blob: Blob; // actual image data
    type: string; // image/png, image/jpeg
  };
  qrEnabled: boolean;
  createdAt: number;
}
