import { motion } from "framer-motion";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { Invoice } from "../types/invoice";
import { createEmptyInvoice } from "../utils/createEmptyInvoice";
import { calculateTotals } from "../utils/calculateTotals";
import { validateInvoice } from "../utils/validateInvoice";
import type { ValidationErrors } from "../types/validation";
import type { InvoicePresetKey } from "../config/invoicePresets";
import { ArrowLeft, Save } from "lucide-react";

// Components
import PresetSelector from "../components/invoice/PresetSelector";
import InvoiceHeader from "../components/invoice/InvoiceHeader";
import SellerSection from "../components/invoice/SellerSection";
import CustomerSection from "../components/invoice/CustomerSection";
import ItemsSection from "../components/invoice/ItemsSection";
import TotalsSection from "../components/invoice/TotalsSection";
import InvoiceList from "../components/invoice/InvoiceList";
import { saveInvoice } from "../lib/db/invoiceRepo";
import { generateInvoiceNumber } from "../utils/generateInvoiceNumber";
import InvoiceTemplateSelector from "../components/InvoiceTemplate/InvoiceTemplateSelector";
import InvoiceLogoUploader from "../components/InvoiceTemplate/InvoiceLogoUploader";

// Animation variants
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

export default function InvoiceCreatePage() {
  const [presetKey, setPresetKey] = useState<InvoicePresetKey>("INDIA_GST");
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<Invoice>(
    createEmptyInvoice("INDIA_GST")
  );
  const [errors, setErrors] = useState<ValidationErrors>({});

  const handlePresetChange = (key: InvoicePresetKey) => {
    setPresetKey(key);
    setInvoice(createEmptyInvoice(key));
    setErrors({});
  };

  const updateInvoice = (updater: (prev: Invoice) => Invoice) => {
    setInvoice((prev) => {
      const updated = updater(prev);
      return {
        ...updated,
        totals: calculateTotals(updated),
      };
    });
  };

  const handleGenerate = async () => {
    const validationErrors = validateInvoice(invoice);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    let inv = invoice;
    if (!invoice.invoiceNumber) {
      const number = await generateInvoiceNumber(invoice);
      inv = { ...invoice, invoiceNumber: number };
    }

    await saveInvoice(inv);
    setInvoice(inv);
    navigate(`/invoice/view/${inv.id}`);
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 lg:px-8"
    >
      {/* Top Bar - Sticky on mobile */}
      <div className="sticky top-0 z-10 mb-8 flex items-center justify-between bg-gray-50/90 backdrop-blur-sm py-4 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <motion.div variants={itemVariants}>
          <Link
            to="/"
            className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-gray-50 border border-gray-200 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </motion.div>

        <motion.div variants={itemVariants}>
          <button
            onClick={handleGenerate}
            className="flex items-center gap-2 rounded-lg bg-sky-600 px-5 py-2 text-sm font-medium text-white shadow hover:bg-sky-700 transition-colors"
          >
            <Save className="h-4 w-4" />
            Generate
          </button>
        </motion.div>
      </div>

      <div className="mx-auto max-w-5xl space-y-8">
        {/* 1. Preset + Invoice Header (global choices first) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div variants={itemVariants}>
            <PresetSelector value={presetKey} onChange={handlePresetChange} />
          </motion.div>
          <motion.div variants={itemVariants}>
            <InvoiceHeader invoice={invoice} setInvoice={updateInvoice} />
          </motion.div>
        </div>

        {/* 2. Template + Logo - aligned side by side on larger screens */}
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

        {/* 3. Seller + Customer */}
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

        {/* 4. Items */}
        <motion.div variants={itemVariants}>
          <ItemsSection
            invoice={invoice}
            setInvoice={updateInvoice}
            errors={errors}
          />
        </motion.div>

        {/* 5. Totals */}
        <motion.div variants={itemVariants}>
          <TotalsSection invoice={invoice} setInvoice={updateInvoice} />
        </motion.div>

        {/* 6. Bottom Actions */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row sm:justify-end gap-4 pt-6 border-t border-gray-200"
        >
          <button
            onClick={() => navigate("/")}
            className="rounded-lg border border-gray-300 px-6 py-3 text-sm font-medium text-slate-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleGenerate}
            className="rounded-lg bg-sky-600 px-6 py-3 text-sm font-medium text-white shadow hover:bg-sky-700 transition-colors"
          >
            Generate & Save Invoice
          </button>
        </motion.div>
      </div>

      {/* Recent Invoices - separate section */}
      <motion.section
        variants={itemVariants}
        className="mx-auto max-w-5xl mt-16"
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900">
            Recent Invoices
          </h2>
          <Link
            to="/invoice/history"
            className="text-sm text-sky-600 hover:text-sky-700 hover:underline"
          >
            View All →
          </Link>
        </div>

        <div className="rounded-xl border border-sky-100 bg-white shadow-sm overflow-hidden">
          <InvoiceList />
        </div>
      </motion.section>
    </motion.div>
  );
}
