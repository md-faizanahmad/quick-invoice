import type { Invoice } from "../../types/invoice";
import type { InvoiceUpdater } from "../../types/invoiceUpdater";
import { ImagePlus, Trash2 } from "lucide-react";
import { useMemo } from "react";

type Props = {
  invoice: Invoice;
  setInvoice: InvoiceUpdater;
};

const MAX_SIZE = 1_000_000; // 1MB

export default function InvoiceLogoUploader({ invoice, setInvoice }: Props) {
  const previewUrl = useMemo(() => {
    if (!invoice.logo) return null;
    return URL.createObjectURL(invoice.logo.blob);
  }, [invoice.logo]);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Only image files allowed");
      return;
    }
    if (file.size > MAX_SIZE) {
      alert("Image must be under 1MB");
      return;
    }

    setInvoice((prev) => ({
      ...prev,
      logo: {
        blob: file,
        type: file.type,
      },
    }));
  };

  return (
    <div className="rounded-2xl bg-white border border-sky-100 p-6 space-y-4">
      <h3 className="text-sm font-semibold text-slate-800">Invoice Logo</h3>

      {previewUrl ? (
        <div className="flex items-center gap-4">
          <img
            src={previewUrl}
            alt="Invoice Logo"
            className="h-16 max-w-40 object-contain border rounded"
          />

          <button
            onClick={() => setInvoice((prev) => ({ ...prev, logo: undefined }))}
            className="text-sm text-red-600 flex items-center gap-1"
          >
            <Trash2 className="h-4 w-4" />
            Remove
          </button>
        </div>
      ) : (
        <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-sky-300 p-4 hover:bg-sky-50">
          <ImagePlus className="h-5 w-5 text-sky-600" />
          <span className="text-sm text-slate-600">Upload logo</span>
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />
        </label>
      )}
    </div>
  );
}
