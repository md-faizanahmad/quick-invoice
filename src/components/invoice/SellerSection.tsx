import type { Invoice } from "../../types/invoice";
import type { InvoiceUpdater } from "../../types/invoiceUpdater";
import type { ValidationErrors } from "../../types/validation";
import { Building2 } from "lucide-react";

type Props = {
  invoice: Invoice;
  setInvoice: InvoiceUpdater;
  errors: ValidationErrors;
};

export default function SellerSection({ invoice, setInvoice, errors }: Props) {
  const showTaxId = invoice.tax.mode !== "NONE";
  const taxLabel = invoice.tax.label || "Tax";

  return (
    <div className="rounded-2xl bg-white/80 backdrop-blur-md border border-sky-100 shadow-lg overflow-hidden">
      <div className="px-6 py-5 border-b border-sky-100 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center">
          <Building2 className="w-5 h-5 text-sky-600" />
        </div>
        <h2 className="text-lg font-semibold text-indigo-900">
          Seller Details
        </h2>
      </div>

      <div className="p-6 space-y-5">
        {/* Seller Name */}
        <div>
          <label className="block text-sm font-medium text-slate-700">
            Seller Name <span className="text-red-500">*</span>
          </label>

          <input
            type="text"
            inputMode="text"
            maxLength={50}
            placeholder="Company / Full Name"
            className="mt-1 w-full rounded-lg border border-sky-200 px-4 py-3"
            value={invoice.seller.name}
            onChange={(e) =>
              setInvoice((prev) => ({
                ...prev,
                seller: {
                  ...prev.seller,
                  name: e.target.value.replace(/[^A-Za-z .-]/g, ""),
                },
              }))
            }
          />

          {errors["seller.name"] && (
            <p className="text-sm text-red-600 mt-1">{errors["seller.name"]}</p>
          )}
        </div>

        {/* Seller Address */}
        <div>
          <label className="block text-sm font-medium text-slate-700">
            Seller Address <span className="text-red-500">*</span>
          </label>

          <textarea
            className="mt-1 w-full rounded-lg border border-sky-200 px-4 py-3 min-h-20"
            placeholder="Street, City, State, ZIP"
            value={invoice.seller.address}
            onChange={(e) =>
              setInvoice((prev) => ({
                ...prev,
                seller: { ...prev.seller, address: e.target.value },
              }))
            }
          />

          {errors["seller.address"] && (
            <p className="text-sm text-red-600 mt-1">
              {errors["seller.address"]}
            </p>
          )}
        </div>

        {/* Tax ID */}
        {showTaxId && (
          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-700">
              {taxLabel} ID
            </label>

            <input
              type="text"
              inputMode="text"
              maxLength={15}
              placeholder={`${taxLabel} ID`}
              className="w-full rounded-lg border border-sky-200 px-4 py-3
                 focus:outline-none focus:ring-2 focus:ring-sky-400
                 focus:border-sky-400"
              value={invoice.seller.taxId ?? ""}
              onChange={(e) =>
                setInvoice((prev) => ({
                  ...prev,
                  seller: {
                    ...prev.seller,
                    taxId: e.target.value
                      .toUpperCase()
                      .replace(/[^0-9A-Z]/g, ""),
                  },
                }))
              }
            />

            {errors["seller.taxId"] && (
              <p className="text-sm text-red-600 mt-1">
                {errors["seller.taxId"]}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
