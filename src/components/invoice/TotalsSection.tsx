// src/components/invoice/TotalsSection.tsx
import type { Invoice } from "../../types/invoice";
import type { InvoiceUpdater } from "../../types/invoiceUpdater";
import { formatMoney } from "../../utils/formatMoney";
import { QrCode, Calculator } from "lucide-react";

type Props = {
  invoice: Invoice;
  setInvoice: InvoiceUpdater;
};

export default function TotalsSection({ invoice, setInvoice }: Props) {
  const { subtotal, taxAmount, total } = invoice.totals;

  return (
    <div className="rounded-2xl bg-white/80 backdrop-blur-md border border-sky-100 shadow-lg overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-sky-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center">
            <Calculator className="w-5 h-5 text-sky-600" />
          </div>
          <h2 className="text-lg font-semibold text-indigo-900">Totals</h2>
        </div>
      </div>

      {/* Totals Display */}
      <div className="p-6 space-y-4">
        <div className="space-y-3">
          {/* Subtotal */}
          <div className="flex justify-between items-center text-slate-700">
            <span className="font-medium">Subtotal</span>
            <span className="text-lg font-medium text-slate-800">
              {formatMoney(subtotal, invoice.currency)}
            </span>
          </div>

          {/* Tax (if applicable) */}
          {invoice.tax.mode !== "NONE" && (
            <div className="flex justify-between items-center text-slate-700">
              <span className="font-medium">{invoice.tax.label}</span>
              <span className="text-lg font-medium text-slate-800">
                {formatMoney(taxAmount ?? 0, invoice.currency)}
              </span>
            </div>
          )}

          {/* Grand Total */}
          <div className="flex justify-between items-center pt-3 border-t border-sky-200">
            <span className="font-semibold text-indigo-900 text-lg">
              Grand Total
            </span>
            <span className="font-bold text-xl text-indigo-700">
              {formatMoney(total, invoice.currency)}
            </span>
          </div>
        </div>

        {/* QR Code Option */}
        <div className="mt-6 pt-4 border-t border-sky-100">
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative">
              <input
                type="checkbox"
                checked={invoice.qrEnabled}
                onChange={(e) =>
                  setInvoice((prev) => ({
                    ...prev,
                    qrEnabled: e.target.checked,
                  }))
                }
                className="w-5 h-5 rounded border-sky-300 text-sky-600 
                           focus:ring-sky-500 cursor-pointer"
              />
              <div className="absolute inset-0 rounded border border-sky-200 group-hover:border-sky-300 transition-colors pointer-events-none" />
            </div>
            <div className="flex items-center gap-2 text-sm">
              <QrCode className="w-5 h-5 text-sky-600" />
              <span className="text-slate-700 font-medium">
                Include QR code in invoice
              </span>
            </div>
          </label>
          <p className="mt-1 text-xs text-slate-500 italic">
            QR code will link to payment details or invoice verification
          </p>
        </div>
      </div>
    </div>
  );
}
