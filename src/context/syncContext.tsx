import { createContext } from "react";
import type { SyncStatus } from "../types/sync";

export type SyncContextValue = {
  status: SyncStatus;
  setStatus: (s: SyncStatus) => void;
};

export const SyncContext = createContext<SyncContextValue | null>(null);
