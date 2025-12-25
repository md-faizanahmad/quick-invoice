import type { Invoice } from "../types/invoice";
import { openInvoiceDB } from "../lib/db/openInvoiceDB";

export async function generateInvoiceNumber(invoice: Invoice): Promise<string> {
  const db = await openInvoiceDB();

  const year = new Date().getFullYear();

  const prefix =
    invoice.tax.mode === "NONE"
      ? "NOTAX"
      : invoice.tax.label.toUpperCase().replace(/\s+/g, "");

  const key = `${year}-${prefix}`;

  const tx = db.transaction("invoice-counters", "readwrite");
  const store = tx.objectStore("invoice-counters");

  const current = await new Promise<{ key: string; count: number } | undefined>(
    (resolve) => {
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result);
    }
  );

  const next = (current?.count ?? 0) + 1;

  store.put({ key, count: next });

  await new Promise<void>((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });

  return `${year}-${prefix}-${String(next).padStart(4, "0")}`;
}
