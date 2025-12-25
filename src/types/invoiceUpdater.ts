import type { Invoice } from "../types/invoice";

export type InvoiceUpdater = (updater: (prev: Invoice) => Invoice) => void;
