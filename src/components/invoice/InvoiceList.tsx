import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Invoice } from "../../types/invoice";
import { getRecentInvoices, deleteInvoice } from "../../lib/db/invoiceRepo";
import { FileText, Pencil, Trash2, Eye, Clock } from "lucide-react";

/* ===================================== */

export default function InvoiceList() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Invoice | null>(null);

  /* -------- Initial load -------- */
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        const data = await getRecentInvoices(5);
        if (mounted) setInvoices(data);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  /* -------- Listen for updates -------- */
  useEffect(() => {
    const handler = async () => {
      try {
        setLoading(true);
        const data = await getRecentInvoices(5);
        setInvoices(data);
      } finally {
        setLoading(false);
      }
    };

    window.addEventListener("invoices-updated", handler);
    return () => window.removeEventListener("invoices-updated", handler);
  }, []);

  /* -------- UI states -------- */

  if (loading) {
    return (
      <div className="rounded-xl border border-sky-100 bg-white p-4 text-sm text-slate-500">
        Loading invoices…
      </div>
    );
  }

  if (invoices.length === 0) {
    return (
      <div className="rounded-xl  p-6 text-center">
        <FileText className="mx-auto h-10 w-10 text-sky-400" />
        <p className="mt-3 text-sm text-slate-600">No invoices yet</p>
      </div>
    );
  }

  return (
    <>
      {/* List Card */}
      <div className="rounded-xl border border-sky-100 bg-white shadow-sm overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-2 border-b border-sky-100 px-4 py-3">
          <Clock className="h-4 w-4 text-sky-600" />
          <h2 className="text-sm font-semibold text-slate-800">
            Recent Invoices
          </h2>
        </div>

        {/* Rows */}
        <ul className="divide-y divide-sky-100">
          {invoices.map((inv) => (
            <li
              key={inv.id}
              className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-sky-50/50"
            >
              {/* Left */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-100">
                  <FileText className="h-4 w-4 text-sky-600" />
                </div>

                <div className="min-w-0">
                  <div className="truncate text-sm font-medium text-slate-800">
                    {inv.invoiceNumber}
                  </div>
                  <div className="text-xs text-slate-500">
                    {new Date(inv.createdAt).toLocaleDateString()} ·{" "}
                    {inv.tax.mode === "NONE" ? "No Tax" : inv.tax.label}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 sm:gap-2">
                <Link
                  to={`/invoice/view/${inv.id}`}
                  className="rounded-md p-2 text-sky-600 hover:bg-sky-100"
                  title="View"
                >
                  <Eye className="h-4 w-4" />
                </Link>

                <Link
                  to={`/invoice/edit/${inv.id}`}
                  className="rounded-md p-2 text-sky-600 hover:bg-sky-100"
                  title="Edit"
                >
                  <Pencil className="h-4 w-4" />
                </Link>

                <button
                  onClick={() => setDeleteTarget(inv)}
                  className="rounded-md p-2 text-red-600 hover:bg-red-50"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Delete Modal */}
      {deleteTarget && (
        <ConfirmModal
          title="Delete invoice?"
          description={`Invoice ${deleteTarget.invoiceNumber} will be permanently removed.`}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={async () => {
            await deleteInvoice(deleteTarget.id);
            setDeleteTarget(null);
            window.dispatchEvent(new Event("invoices-updated"));
          }}
        />
      )}
    </>
  );
}

/* ===================================== */
/* ============ MODAL =================== */
/* ===================================== */

type ModalProps = {
  title: string;
  description: string;
  onCancel: () => void;
  onConfirm: () => void;
};

function ConfirmModal({ title, description, onCancel, onConfirm }: ModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-sm rounded-xl bg-white p-5 shadow-lg">
        <h3 className="text-base font-semibold text-slate-900">{title}</h3>

        <p className="mt-2 text-sm text-slate-600">{description}</p>

        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="rounded-lg border px-4 py-2 text-sm"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
