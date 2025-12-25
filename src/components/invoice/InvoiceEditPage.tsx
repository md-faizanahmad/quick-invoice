import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Invoice } from "../../types/invoice";
import type { ValidationErrors } from "../../types/validation";

import {
  deleteInvoice,
  getInvoiceById,
  saveInvoice,
} from "../../lib/db/invoiceRepo";

import { calculateTotals } from "../../utils/calculateTotals";
import { validateInvoice } from "../../utils/validateInvoice";

import InvoiceHeader from "../../components/invoice/InvoiceHeader";
import SellerSection from "../../components/invoice/SellerSection";
import CustomerSection from "../../components/invoice/CustomerSection";
import ItemsSection from "../../components/invoice/ItemsSection";
import TotalsSection from "../../components/invoice/TotalsSection";

/* ---------------------------------- */

export default function InvoiceEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [confirmSave, setConfirmSave] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  /* ---------- Load invoice ---------- */
  useEffect(() => {
    if (!id) return;
    getInvoiceById(id).then((inv) => {
      if (inv) setInvoice(inv);
    });
  }, [id]);

  /* ---------- Central updater ---------- */
  const updateInvoice = (updater: (prev: Invoice) => Invoice) => {
    setInvoice((prev) => {
      if (!prev) return prev;
      const updated = updater(prev);
      return {
        ...updated,
        totals: calculateTotals(updated),
      };
    });
  };

  /* ---------- Save flow ---------- */
  const handleSaveRequest = () => {
    if (!invoice) return;

    const validationErrors = validateInvoice(invoice);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setErrors({});
    setConfirmSave(true);
  };

  const handleConfirmSave = async () => {
    if (!invoice) return;
    await saveInvoice(invoice);
    setConfirmSave(false);
    navigate(`/invoice/view/${invoice.id}`);
  };

  /* ---------- Delete flow ---------- */
  const handleConfirmDelete = async () => {
    if (!invoice) return;
    await deleteInvoice(invoice.id);
    setConfirmDelete(false);
    navigate("/");
  };

  if (!invoice) {
    return (
      <div className="p-6 text-center text-slate-500">Loading invoice…</div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Top Bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-sky-600 hover:underline"
          >
            ← Back
          </button>

          <span className="text-sm text-slate-500">Editing invoice</span>
        </div>

        {/* Sections */}
        <InvoiceHeader invoice={invoice} setInvoice={updateInvoice} />

        <SellerSection
          invoice={invoice}
          setInvoice={updateInvoice}
          errors={errors}
        />

        <CustomerSection
          invoice={invoice}
          setInvoice={updateInvoice}
          errors={errors}
        />

        <ItemsSection
          invoice={invoice}
          setInvoice={updateInvoice}
          errors={errors}
        />

        <TotalsSection invoice={invoice} setInvoice={updateInvoice} />

        {/* Actions */}
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
          <button
            onClick={() => setConfirmDelete(true)}
            className="rounded-lg border border-red-500 px-5 py-3 text-red-600 hover:bg-red-50"
          >
            Delete Invoice
          </button>

          <button
            onClick={handleSaveRequest}
            className="rounded-lg bg-sky-600 px-6 py-3 font-medium text-white hover:bg-sky-700"
          >
            Save Changes
          </button>
        </div>
      </div>

      {/* ---------- Save Confirm Modal ---------- */}
      {confirmSave && (
        <Modal
          title="Save changes?"
          description="This will update the invoice and keep the same invoice number."
          onCancel={() => setConfirmSave(false)}
          onConfirm={handleConfirmSave}
          confirmText="Save"
        />
      )}

      {/* ---------- Delete Confirm Modal ---------- */}
      {confirmDelete && (
        <Modal
          title="Delete invoice?"
          description="This action cannot be undone."
          danger
          onCancel={() => setConfirmDelete(false)}
          onConfirm={handleConfirmDelete}
          confirmText="Delete"
        />
      )}
    </div>
  );
}

/* ========================================= */
/* =============== MODAL ==================== */
/* ========================================= */

type ModalProps = {
  title: string;
  description: string;
  confirmText: string;
  danger?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

function Modal({
  title,
  description,
  confirmText,
  danger,
  onCancel,
  onConfirm,
}: ModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        <p className="mt-2 text-sm text-slate-600">{description}</p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="rounded-lg  border px-4 py-2 text-sm"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className={`rounded-lg px-4 py-2 text-sm text-white ${
              danger
                ? "bg-red-600 hover:bg-red-700"
                : "bg-sky-600 hover:bg-sky-700"
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
