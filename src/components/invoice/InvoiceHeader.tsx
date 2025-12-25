// src/components/invoice/InvoiceHeader.tsx
import type { Invoice } from "../../types/invoice";
import type { InvoiceUpdater } from "../../types/invoiceUpdater";
import { CURRENCIES } from "../../config/currencies";
import { CURRENCY_SYMBOLS } from "../../utils/currencySymbols.ts";
import { ReceiptText } from "lucide-react";

type Props = {
  invoice: Invoice;
  setInvoice: InvoiceUpdater;
};

export default function InvoiceHeader({ invoice, setInvoice }: Props) {
  const currency = invoice.currency;
  const symbol = CURRENCY_SYMBOLS[currency.code];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-sky-100 bg-linear-to-br from-sky-50 via-white to-white shadow-md">
      {/* subtle accent bar */}
      <div className="absolute inset-x-0 top-0 h-1 bg-sky-400" />

      <div className="flex flex-col gap-5 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        {/* LEFT — Invoice identity */}
        <div className="flex items-center gap-4 min-w-0">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-100 text-sky-600">
            <ReceiptText className="h-6 w-6" />
          </div>

          <div className="min-w-0">
            <h1 className="truncate text-xl md:text-2xl font-bold text-slate-900">
              {invoice.tax.mode === "NONE"
                ? "Invoice"
                : `${invoice.tax.label} Invoice`}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Offline • No login • PDF ready
            </p>
          </div>
        </div>

        {/* RIGHT — Currency control */}
        <div className="flex items-center gap-3">
          {/* Symbol badge */}
          <div className="flex h-11 min-w-14 items-center justify-center rounded-lg cursor-pointer bg-white text-lg font-semibold text-sky-700 shadow-sm">
            {symbol}
          </div>

          {/* Currency selector */}
          <select
            value={currency.code}
            onChange={(e) => {
              const selected = CURRENCIES.find(
                (c) => c.code === e.target.value
              );
              if (!selected) return;

              setInvoice((prev) => ({
                ...prev,
                currency: selected,
              }));
            }}
            className="
              h-11 rounded-lg border border-sky-200 bg-white cursor-pointer 
              px-4 text-sm font-medium text-slate-700
              shadow-sm
              focus:outline-none focus:ring-2 focus:ring-sky-100 focus:border-sky-100
              hover:border-sky-100 transition
            "
          >
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code} className="cursor-pointer">
                {c.code} — {CURRENCY_SYMBOLS[c.code]}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
