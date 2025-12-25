import type { Invoice } from "../../types/invoice";
import { CURRENCY_SYMBOLS } from "../../utils/currencySymbols";

type Props = {
  invoice: Invoice;
};

export default function InvoicePreview({ invoice }: Props) {
  const symbol = CURRENCY_SYMBOLS[invoice.currency.code];

  return (
    <div className="rounded-2xl bg-white p-6 shadow-md space-y-6">
      {/* Header */}
      <div className="flex justify-between">
        <div>
          <h2 className="text-lg font-semibold">
            {invoice.tax.mode === "NONE"
              ? "Invoice"
              : `${invoice.tax.label} Invoice`}
          </h2>
          <p className="text-sm text-slate-500">
            Invoice No: {invoice.invoiceNumber}
          </p>
        </div>

        <div className="text-right text-sm">
          <div>{new Date(invoice.createdAt).toLocaleDateString()}</div>
          <div className="font-medium">
            Currency: {symbol} ({invoice.currency.code})
          </div>
        </div>
      </div>

      {/* Seller & Customer */}
      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-semibold text-slate-700">Seller</h3>
          <p className="mt-1">{invoice.seller.name}</p>
          <p className="text-sm text-slate-600">{invoice.seller.address}</p>
          {invoice.seller.taxId && (
            <p className="text-sm text-slate-600">
              {invoice.tax.label} ID: {invoice.seller.taxId}
            </p>
          )}
        </div>

        <div>
          <h3 className="text-sm font-semibold text-slate-700">Customer</h3>
          <p className="mt-1">{invoice.customer.name}</p>
          <p className="text-sm text-slate-600">{invoice.customer.address}</p>
          {invoice.customer.taxId && (
            <p className="text-sm text-slate-600">
              {invoice.tax.label} ID: {invoice.customer.taxId}
            </p>
          )}
        </div>
      </div>

      {/* Items */}
      <div>
        <h3 className="text-sm font-semibold text-slate-700 mb-2">Items</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border">
            <thead className="bg-sky-50">
              <tr>
                <th className="p-2 text-left">Item</th>
                <th className="p-2 text-right">Qty</th>
                <th className="p-2 text-right">Price</th>
                <th className="p-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item) => (
                <tr key={item.id} className="border-t">
                  <td className="p-2">{item.name}</td>
                  <td className="p-2 text-right">{item.qty}</td>
                  <td className="p-2 text-right">
                    {symbol} {item.price.toFixed(2)}
                  </td>
                  <td className="p-2 text-right">
                    {symbol} {(item.qty * item.price).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Totals */}
      <div className="flex justify-end">
        <div className="w-full sm:w-64 space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>
              {symbol} {invoice.totals.subtotal.toFixed(2)}
            </span>
          </div>

          {invoice.totals.taxAmount !== undefined && (
            <div className="flex justify-between">
              <span>{invoice.tax.label}</span>
              <span>
                {symbol} {invoice.totals.taxAmount.toFixed(2)}
              </span>
            </div>
          )}

          <div className="flex justify-between font-semibold border-t pt-2">
            <span>Total</span>
            <span>
              {symbol} {invoice.totals.total.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* QR Indicator */}
      {invoice.qrEnabled && (
        <div className="text-xs text-slate-500">
          QR code included in invoice
        </div>
      )}
    </div>
  );
}
