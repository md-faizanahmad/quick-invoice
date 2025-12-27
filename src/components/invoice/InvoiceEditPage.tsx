import { motion } from "framer-motion";
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
import InvoiceActions from "../../pages/InvoiceActions";
import InvoiceTemplateSelector from "../InvoiceTemplate/InvoiceTemplateSelector";
import InvoiceLogoUploader from "../InvoiceTemplate/InvoiceLogoUploader";

// Animation variants (same as create page for consistency)
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function InvoiceEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [confirmSave, setConfirmSave] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (!id) return;
    getInvoiceById(id).then((inv) => {
      if (inv) setInvoice(inv);
    });
  }, [id]);

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
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Top Bar */}
        <motion.div
          variants={itemVariants}
          className="flex items-center justify-between"
        >
          <InvoiceActions
            invoice={invoice}
            showDownload={false}
            showPreview={false}
            showDuplicate={false}
            showShare={false}
            showEdit={false}
          />

          <span className="text-sm text-slate-500">Editing invoice</span>
        </motion.div>

        {/* Header */}
        <motion.div variants={itemVariants}>
          <InvoiceHeader invoice={invoice} setInvoice={updateInvoice} />
        </motion.div>

        {/* Template + Logo - grouped */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h3 className="mb-5 text-lg font-semibold text-slate-800">
            Invoice Design
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InvoiceTemplateSelector
              invoice={invoice}
              setInvoice={updateInvoice}
            />
            <InvoiceLogoUploader invoice={invoice} setInvoice={updateInvoice} />
          </div>
        </motion.div>

        {/* Seller + Customer */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div variants={itemVariants}>
            <SellerSection
              invoice={invoice}
              setInvoice={updateInvoice}
              errors={errors}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <CustomerSection
              invoice={invoice}
              setInvoice={updateInvoice}
              errors={errors}
            />
          </motion.div>
        </div>

        {/* Items */}
        <motion.div variants={itemVariants}>
          <ItemsSection
            invoice={invoice}
            setInvoice={updateInvoice}
            errors={errors}
          />
        </motion.div>

        {/* Totals */}
        <motion.div variants={itemVariants}>
          <TotalsSection invoice={invoice} setInvoice={updateInvoice} />
        </motion.div>

        {/* Actions */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col-reverse gap-4 sm:flex-row sm:justify-between pt-6 border-t border-gray-200"
        >
          <button
            onClick={() => setConfirmDelete(true)}
            className="rounded-lg border border-red-500 px-5 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            Delete Invoice
          </button>

          <button
            onClick={handleSaveRequest}
            className="rounded-lg bg-sky-600 px-6 py-3 text-sm font-medium text-white hover:bg-sky-700 transition-colors"
          >
            Save Changes
          </button>
        </motion.div>
      </div>

      {/* Save Confirm Modal */}
      {confirmSave && (
        <Modal
          title="Save changes?"
          description="This will update the invoice and keep the same invoice number."
          onCancel={() => setConfirmSave(false)}
          onConfirm={handleConfirmSave}
          confirmText="Save"
        />
      )}

      {/* Delete Confirm Modal */}
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
    </motion.div>
  );
}

/* Modal Component */
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
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-sm rounded-xl bg-white p-6 shadow-2xl"
      >
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        <p className="mt-2 text-sm text-slate-600">{description}</p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className={`rounded-lg px-4 py-2 text-sm font-medium text-white ${
              danger
                ? "bg-red-600 hover:bg-red-700"
                : "bg-sky-600 hover:bg-sky-700"
            }`}
          >
            {confirmText}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
