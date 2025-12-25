import type { Invoice } from "../../types/invoice";
import { openInvoiceDB } from "./openInvoiceDB";

const DB_NAME = "invoice-db";
const STORE = "invoices";
const VERSION = 2;

/* ---------- DB OPEN ---------- */
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, VERSION);

    req.onupgradeneeded = () => {
      const db = req.result;

      if (!db.objectStoreNames.contains(STORE)) {
        const store = db.createObjectStore(STORE, {
          keyPath: "id",
        });

        store.createIndex("createdAt", "createdAt");
      }
    };

    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

/* ---------- CREATE or UPDATE ---------- */
export async function saveInvoice(invoice: Invoice): Promise<void> {
  const db = await openInvoiceDB();
  const tx = db.transaction("invoices", "readwrite");
  tx.objectStore("invoices").put(invoice);

  return new Promise((resolve, reject) => {
    tx.oncomplete = () => {
      window.dispatchEvent(new Event("invoices-updated"));
      resolve();
    };
    tx.onerror = () => reject(tx.error);
  });
}

/* ---------- GET ONE (Edit) ---------- */
export async function getInvoiceById(id: string): Promise<Invoice | undefined> {
  const db = await openDB();
  const tx = db.transaction(STORE, "readonly");
  const req = tx.objectStore(STORE).get(id);

  return new Promise((resolve) => {
    req.onsuccess = () => resolve(req.result);
  });
}

/* ---------- LIST RECENT (latest first) ---------- */
export async function getRecentInvoices(limit = 5): Promise<Invoice[]> {
  const db = await openDB();
  const tx = db.transaction(STORE, "readonly");
  const store = tx.objectStore(STORE);
  const index = store.index("createdAt");

  return new Promise((resolve) => {
    const invoices: Invoice[] = [];
    const req = index.openCursor(null, "prev");

    req.onsuccess = () => {
      const cursor = req.result;
      if (cursor && invoices.length < limit) {
        invoices.push(cursor.value);
        cursor.continue();
      } else {
        resolve(invoices);
      }
    };
  });
}
export async function deleteInvoice(id: string): Promise<void> {
  const db = await openInvoiceDB();
  const tx = db.transaction("invoices", "readwrite");
  tx.objectStore("invoices").delete(id);

  return new Promise((resolve, reject) => {
    tx.oncomplete = () => {
      window.dispatchEvent(new Event("invoices-updated"));
      resolve();
    };
    tx.onerror = () => reject(tx.error);
  });
}
