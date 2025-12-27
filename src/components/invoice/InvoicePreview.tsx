import { motion } from "framer-motion";
import type { Invoice } from "../../types/invoice";
import { CURRENCY_SYMBOLS } from "../../utils/currencySymbols";
import { ReceiptText, QrCode } from "lucide-react";

type Props = {
  invoice: Invoice;
};

const fadeIn = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function InvoicePreview({ invoice }: Props) {
  const symbol = CURRENCY_SYMBOLS[invoice.currency.code];
  const logoUrl = invoice.logo ? URL.createObjectURL(invoice.logo.blob) : null;
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="rounded-2xl bg-white border border-sky-200/50 shadow-md overflow-hidden"
    >
      {/* Header */}
      <div className="bg-sky-50/70 px-5 py-4 sm:px-6 border-b border-sky-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-100 text-sky-600">
              <ReceiptText className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-sky-900">
                {invoice.tax.mode === "NONE"
                  ? "Invoice"
                  : `${invoice.tax.label} Invoice`}
              </h2>
              <p className="text-xs text-slate-600">
                Invoice No:{" "}
                <span className="font-medium">{invoice.invoiceNumber}</span>
              </p>
            </div>
          </div>

          <div className="text-right text-xs text-slate-600">
            <div>{new Date(invoice.createdAt).toLocaleDateString()}</div>
            <div className="font-medium">
              {symbol} ({invoice.currency.code})
            </div>
          </div>
        </div>
      </div>

      {/* Parties */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-5 sm:p-6 border-b border-sky-100">
        <div>
          <h3 className="text-sm font-semibold text-slate-800 mb-2">
            {" "}
            Seller Logo
          </h3>
          {logoUrl && (
            <img
              src={logoUrl}
              alt="Invoice Logo"
              className="h-14 max-w-40 object-contain"
              onLoad={() => URL.revokeObjectURL(logoUrl)}
            />
          )}
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-800 mb-2">Seller</h3>
          <p className="font-medium text-slate-900">{invoice.seller.name}</p>
          <p className="text-sm text-slate-600 mt-1 whitespace-pre-line">
            {invoice.seller.address}
          </p>
          {invoice.seller.taxId && (
            <p className="text-xs text-slate-600 mt-1">
              {invoice.tax.label} ID: {invoice.seller.taxId}
            </p>
          )}
        </div>

        <div>
          <h3 className="text-sm font-semibold text-slate-800 mb-2">
            Customer
          </h3>
          <p className="font-medium text-slate-900">{invoice.customer.name}</p>
          <p className="text-sm text-slate-600 mt-1 whitespace-pre-line">
            {invoice.customer.address}
          </p>
          {invoice.customer.taxId && (
            <p className="text-xs text-slate-600 mt-1">
              {invoice.tax.label} ID: {invoice.customer.taxId}
            </p>
          )}
        </div>
      </div>

      {/* Items Table */}
      <div className="p-5 sm:p-6 border-b border-sky-100">
        <h3 className="text-sm font-semibold text-slate-800 mb-3">Items</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-125">
            <thead className="bg-sky-50/70">
              <tr className="border-b border-sky-100">
                <th className="p-3 text-left font-medium text-slate-700">
                  Item
                </th>
                <th className="p-3 text-right font-medium text-slate-700">
                  Qty
                </th>
                <th className="p-3 text-right font-medium text-slate-700">
                  Price
                </th>
                <th className="p-3 text-right font-medium text-slate-700">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-sky-50 last:border-none"
                >
                  <td className="p-3 text-slate-800">{item.name}</td>
                  <td className="p-3 text-right text-slate-700">{item.qty}</td>
                  <td className="p-3 text-right text-slate-700">
                    {symbol} {item.price.toFixed(2)}
                  </td>
                  <td className="p-3 text-right font-medium text-slate-800">
                    {symbol} {(item.qty * item.price).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Totals */}
      <div className="p-5 sm:p-6 bg-sky-50/30">
        <div className="flex justify-end">
          <div className="w-full sm:w-72 space-y-2 text-sm">
            <div className="flex justify-between text-slate-700">
              <span>Subtotal</span>
              <span>
                {symbol} {invoice.totals.subtotal.toFixed(2)}
              </span>
            </div>

            {invoice.totals.taxAmount !== undefined && (
              <div className="flex justify-between text-slate-700">
                <span>{invoice.tax.label}</span>
                <span>
                  {symbol} {invoice.totals.taxAmount.toFixed(2)}
                </span>
              </div>
            )}

            <div className="flex justify-between pt-3 border-t border-sky-200 font-semibold text-slate-900">
              <span className="text-base">Grand Total</span>
              <span className="text-lg">
                {symbol} {invoice.totals.total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* QR Code Indicator */}
        {invoice.qrEnabled && (
          <div className="mt-6 flex items-center gap-2 text-xs text-slate-500">
            <QrCode className="h-4 w-4 text-sky-600" />
            <span>QR code will be included in the final PDF</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
