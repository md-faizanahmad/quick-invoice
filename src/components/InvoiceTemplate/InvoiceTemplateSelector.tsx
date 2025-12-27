import { generateInvoicePdf } from "../../utils/generateInvoicePdf";
import type { Invoice } from "../../types/invoice";
import type { InvoiceUpdater } from "../../types/invoiceUpdater";
import {
  INVOICE_TEMPLATES,
  type InvoiceTemplateKey,
} from "../../types/invoiceTemplates";

type Props = {
  invoice: Invoice;
  setInvoice: InvoiceUpdater;
};

export default function InvoiceTemplateSelector({
  invoice,
  setInvoice,
}: Props) {
  return (
    <div className="rounded-2xl bg-white border border-sky-100 p-6 space-y-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-slate-800">
          Invoice Template
        </h3>
        <p className="text-xs text-slate-500">Click a card to select</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(INVOICE_TEMPLATES).map(([templateKey, tpl]) => {
          const isActive = invoice.template === templateKey;

          const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
            // Prevent selection when clicking the preview button
            if (
              e.target instanceof HTMLElement &&
              e.target.closest('button[type="button"]')
            ) {
              return;
            }
            setInvoice((prev) => ({
              ...prev,
              template: templateKey as InvoiceTemplateKey,
            }));
          };

          return (
            <div
              key={templateKey}
              onClick={handleCardClick}
              className={`
                group relative rounded-xl border p-5 transition-all duration-300 cursor-pointer
                bg-white
                hover:shadow-md hover:-translate-y-1 hover:border-sky-300
                focus-within:shadow-md focus-within:-translate-y-1 focus-within:border-sky-300
                ${
                  isActive
                    ? "border-sky-500 ring-2 ring-sky-200/70 shadow-md scale-[1.02]"
                    : "border-slate-200"
                }
              `}
              tabIndex={0}
              role="button"
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setInvoice((prev) => ({
                    ...prev,
                    template: templateKey as InvoiceTemplateKey,
                  }));
                }
              }}
            >
              {/* Active badge */}
              {isActive && (
                <span className="absolute -top-2 -right-2 bg-sky-600 text-white text-xs px-2.5 py-1 rounded-full font-medium shadow-sm">
                  Active
                </span>
              )}

              {/* Template label */}
              <div className="text-sm font-semibold text-slate-800 mb-2">
                {tpl.label}
              </div>

              {/* Description */}
              <p className="text-xs text-slate-500 line-clamp-3">
                {tpl.description}
              </p>

              {/* Preview button */}
              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={async (e) => {
                    e.stopPropagation(); // Prevent card click from firing
                    const previewInvoice: Invoice = {
                      ...invoice,
                      template: templateKey as InvoiceTemplateKey,
                    };
                    const blob = await generateInvoicePdf(previewInvoice);
                    const url = URL.createObjectURL(blob);
                    window.open(url, "_blank");
                    setTimeout(() => URL.revokeObjectURL(url), 60000);
                  }}
                  className="
                    rounded-lg border m-auto border-slate-200 p-2 text-sky-600
                    hover:bg-sky-50 hover:border-sky-300 hover:text-sky-700
                    focus:outline-none focus:ring-2 focus:ring-sky-200 focus:ring-offset-2
                    transition-colors
                  "
                  title="Preview this template"
                >
                  View
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
