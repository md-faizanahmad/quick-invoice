import type { Invoice } from "../types/invoice";

export function calculateTotals(invoice: Invoice): Invoice["totals"] {
  const subtotal = invoice.items.reduce((sum, i) => sum + i.qty * i.price, 0);

  if (invoice.tax.mode === "NONE") {
    return {
      subtotal,
      total: subtotal,
    };
  }

  const taxAmount = Number((subtotal * invoice.tax.rate).toFixed(2));

  return {
    subtotal,
    taxAmount,
    total: Number((subtotal + taxAmount).toFixed(2)),
  };
}
