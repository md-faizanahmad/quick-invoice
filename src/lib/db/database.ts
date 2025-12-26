// src/lib/db/database.ts
const DB_NAME = "invoice-db";
const DB_VERSION = 10; // Bumped to 7 to force a fresh start for both stores

export const STORES = {
  INVOICES: "invoices",
  COUNTERS: "invoice-counters",
};

export function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;

      // Create Invoices Store
      if (!db.objectStoreNames.contains(STORES.INVOICES)) {
        const invoiceStore = db.createObjectStore(STORES.INVOICES, {
          keyPath: "id",
        });
        invoiceStore.createIndex("createdAt", "createdAt");
      }

      // Create Counters Store
      if (!db.objectStoreNames.contains(STORES.COUNTERS)) {
        db.createObjectStore(STORES.COUNTERS, { keyPath: "key" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
