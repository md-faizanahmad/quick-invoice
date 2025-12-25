import { useState } from "react";
import type { Invoice } from "../types/invoice";
import { createEmptyInvoice } from "../utils/createEmptyInvoice";
import { calculateTotals } from "../utils/calculateTotals";
import { validateInvoice } from "../utils/validateInvoice";
import type { ValidationErrors } from "../types/validation";
// import { generateInvoicePdf } from "../utils/generateInvoicePdf";
import type { InvoicePresetKey } from "../config/invoicePresets";

import PresetSelector from "../components/invoice/PresetSelector";
import InvoiceHeader from "../components/invoice/InvoiceHeader";
import SellerSection from "../components/invoice/SellerSection";
import CustomerSection from "../components/invoice/CustomerSection";
import ItemsSection from "../components/invoice/ItemsSection";
import TotalsSection from "../components/invoice/TotalsSection";
import { saveInvoice } from "../lib/db/invoiceRepo";
import InvoiceList from "../components/invoice/InvoiceList";
import { generateInvoiceNumber } from "../utils/generateInvoiceNumber";
import { Link, useNavigate } from "react-router-dom";

export default function InvoiceCreatePage() {
  const [presetKey, setPresetKey] = useState<InvoicePresetKey>("INDIA_GST");
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<Invoice>(
    createEmptyInvoice("INDIA_GST")
  );

  const [errors, setErrors] = useState<ValidationErrors>({});

  /* ✅ Preset change handler (NO useEffect) */
  const handlePresetChange = (key: InvoicePresetKey) => {
    setPresetKey(key);
    setInvoice(createEmptyInvoice(key));
    setErrors({});
  };

  /* ✅ Centralized invoice updater */
  const updateInvoice = (updater: (prev: Invoice) => Invoice) => {
    setInvoice((prev) => {
      const updated = updater(prev);
      return {
        ...updated,
        totals: calculateTotals(updated),
      };
    });
  };

  /* ✅ Generate */
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

    // ALWAYS absolute path
    navigate(`/invoice/view/${inv.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="flex gap-3">
        <Link
          to="/"
          className="rounded-lg bg-sky-600 px-4 py-2 text-sm text-white hover:bg-sky-700"
        >
          Back
        </Link>
      </div>
      <div className="invoiceList mt-4 mb-10">
        <InvoiceList />
      </div>

      <div className="mx-auto max-w-4xl space-y-6">
        <InvoiceHeader invoice={invoice} setInvoice={updateInvoice} />

        <PresetSelector value={presetKey} onChange={handlePresetChange} />

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

        <div className="flex  justify-end gap-3">
          <button className="rounded border px-4 py-2 cursor-pointer">
            Cancel
          </button>
          <button
            onClick={handleGenerate}
            className="rounded cursor-pointer bg-blue-800 px-4 py-2 text-white"
          >
            Generate Invoice
          </button>
        </div>
      </div>
    </div>
  );
}
