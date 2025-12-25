import type { Invoice } from "../../types/invoice";

const DB_NAME = "invoice-db";
const STORE = "invoices";
const VERSION = 1;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, VERSION);

    req.onupgradeneeded = () => {
      const db = req.result;

      if (!db.objectStoreNames.contains(STORE)) {
        const store = db.createObjectStore(STORE, {
          keyPath: "id", // invoice.id
        });

        // For sorting recent invoices
        store.createIndex("createdAt", "createdAt");
      }
    };

    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

/* CREATE or UPDATE */
export async function saveInvoice(invoice: Invoice): Promise<void> {
  const db = await openDB();
  const tx = db.transaction(STORE, "readwrite");
  tx.objectStore(STORE).put(invoice);

  return new Promise((resolve, reject) => {
    tx.oncomplete = () => {
      window.dispatchEvent(new Event("invoices-updated"));
      resolve();
    };
    tx.onerror = () => reject(tx.error);
  });
}

/* DELETE */
export async function deleteInvoice(id: string): Promise<void> {
  const db = await openDB();
  const tx = db.transaction(STORE, "readwrite");
  tx.objectStore(STORE).delete(id);

  return new Promise((resolve, reject) => {
    tx.oncomplete = () => {
      window.dispatchEvent(new Event("invoices-updated"));
      resolve();
    };
    tx.onerror = () => reject(tx.error);
  });
}

/* GET ONE (Edit) */
export async function getInvoiceById(id: string): Promise<Invoice | undefined> {
  const db = await openDB();
  const tx = db.transaction(STORE, "readonly");
  const req = tx.objectStore(STORE).get(id);

  return new Promise((resolve) => {
    req.onsuccess = () => resolve(req.result);
  });
}

/* LIST RECENT (Top 5) */
export async function getRecentInvoices(limit = 5): Promise<Invoice[]> {
  const db = await openDB();

  return new Promise((resolve) => {
    const tx = db.transaction(STORE, "readonly");
    const store = tx.objectStore(STORE);
    const index = store.index("createdAt");

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
