const DB_NAME = "invoice-db";
const VERSION = 2; // ⬅️ IMPORTANT: bump version

export function openInvoiceDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, VERSION);

    req.onupgradeneeded = () => {
      const db = req.result;

      // invoices store
      if (!db.objectStoreNames.contains("invoices")) {
        const store = db.createObjectStore("invoices", {
          keyPath: "id",
        });
        store.createIndex("createdAt", "createdAt");
      }

      // invoice counters store
      if (!db.objectStoreNames.contains("invoice-counters")) {
        db.createObjectStore("invoice-counters", {
          keyPath: "key",
        });
      }
    };

    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}
