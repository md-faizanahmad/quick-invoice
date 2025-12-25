import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Invoice } from "../types/invoice";
import { getInvoiceById, saveInvoice } from "../lib/db/invoiceRepo";
import { downloadBlob } from "../utils/downloadPdf";
import InvoicePreview from "../components/invoice/InvoicePreview";
import { generateInvoicePdf } from "../utils/generateInvoicePdf";

export default function InvoiceViewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    if (!id) return;

    getInvoiceById(id).then((inv) => {
      if (inv) {
        setInvoice(inv);
      } else {
        setInvoice(null);
      }
    });
  }, [id]);

  if (!invoice) {
    return <p className="text-slate-500">Loading invoice…</p>;
  }

  /* -------- Download PDF -------- */
  const handleDownloadPdf = async () => {
    try {
      const blob = await generateInvoicePdf(invoice);
      downloadBlob(blob, `Invoice_${invoice.invoiceNumber}.pdf`);
    } catch (err) {
      console.error("PDF generation failed", err);
      alert("Failed to generate PDF");
    }
  };

  /* -------- Duplicate -------- */
  const handleDuplicate = async () => {
    const copy: Invoice = {
      ...invoice,
      id: crypto.randomUUID(),
      invoiceNumber: "", // force regenerate
      createdAt: Date.now(),
    };
    await saveInvoice(copy);
    navigate(`/invoice/edit/${copy.id}`);
  };

  /* -------- Share -------- */
  const shareText = `Invoice ${invoice.invoiceNumber}
Amount: ${invoice.totals.total} ${invoice.currency.code}`;

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;

  const mailtoUrl = `mailto:?subject=Invoice ${
    invoice.invoiceNumber
  }&body=${encodeURIComponent(shareText)}`;

  return (
    <div className="space-y-6">
      {/* Action bar */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => navigate(`/`)}
          className="rounded-lg border px-4 py-2"
        >
          Back
        </button>
        <button
          onClick={handleDownloadPdf}
          className="rounded-lg bg-sky-600 px-4 py-2 text-white"
        >
          Download PDF
        </button>

        <button
          onClick={() => navigate(`/invoice/edit/${invoice.id}`)}
          className="rounded-lg border px-4 py-2"
        >
          Edit
        </button>

        <button
          onClick={handleDuplicate}
          className="rounded-lg border px-4 py-2"
        >
          Duplicate
        </button>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg border px-4 py-2"
        >
          WhatsApp
        </a>

        <a href={mailtoUrl} className="rounded-lg border px-4 py-2">
          Email
        </a>
      </div>

      {/* Read-only preview */}
      <InvoicePreview invoice={invoice} />
    </div>
  );
}
