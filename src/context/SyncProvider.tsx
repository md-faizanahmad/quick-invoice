import { useState } from "react";
import { SyncContext } from "./syncContext";
import type { SyncStatus } from "../types/sync";

export function SyncProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<SyncStatus>("idle");

  return (
    <SyncContext.Provider value={{ status, setStatus }}>
      {children}
    </SyncContext.Provider>
  );
}
