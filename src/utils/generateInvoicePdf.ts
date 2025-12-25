import { jsPDF } from "jspdf";
import "jspdf-autotable";
import autoTable, { type UserOptions } from "jspdf-autotable";

import QRCode from "qrcode";
import type { Invoice, InvoiceItem } from "../types/invoice";
interface jsPDFWithPlugin extends jsPDF {
  autoTable: (options: UserOptions) => jsPDF;
  lastAutoTable: {
    finalY: number;
  };
}

export async function generateInvoicePdf(invoice: Invoice): Promise<Blob> {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: "a4",
  }) as jsPDFWithPlugin;

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 35;
  const currY_start = 35;
  let currY = currY_start;

  const { currency, seller, customer, totals } = invoice;
  const symbol = currency.code === "INR" ? "Rs. " : `${currency.code} `;

  // ===================== HEADER =====================
  // Company Info (Seller)
  doc.setFont("times", "normal").setFontSize(20).setTextColor(26, 26, 26);
  doc.text(seller.name, margin, currY + 20);

  doc.setFont("helvetica", "normal").setFontSize(9).setTextColor(68, 68, 68);
  doc.text(seller.address, margin, currY + 35, { maxWidth: 250 });
  if (seller.taxId) {
    doc.text(`Tax ID: ${seller.taxId}`, margin, currY + 65);
  }

  // TAX INVOICE Box (Right Aligned)
  const rightBoxWidth = 180;
  const rightBoxX = pageWidth - margin - rightBoxWidth;
  doc
    .setFillColor(248, 249, 250)
    .setDrawColor(224, 224, 224)
    .rect(rightBoxX, currY, rightBoxWidth, 80, "FD");

  doc.setFont("courier", "bold").setFontSize(16).setTextColor(211, 47, 47);
  doc.text("TAX INVOICE", rightBoxX + 10, currY + 20);

  doc.setFont("helvetica", "bold").setFontSize(9).setTextColor(51, 51, 51);
  doc.text("Invoice No:", rightBoxX + 10, currY + 45);
  doc.text("Date:", rightBoxX + 10, currY + 60);

  doc.setFont("helvetica", "normal").setTextColor(0, 0, 0);
  doc.text(invoice.invoiceNumber, pageWidth - margin - 10, currY + 45, {
    align: "right",
  });
  doc.text(
    new Date(invoice.createdAt).toLocaleDateString(currency.locale),
    pageWidth - margin - 10,
    currY + 60,
    { align: "right" }
  );

  currY += 100;
  doc
    .setDrawColor(25, 118, 210)
    .setLineWidth(2)
    .line(margin, currY, pageWidth - margin, currY);

  // ===================== CUSTOMER DETAILS =====================
  autoTable(doc, {
    startY: currY + 15,
    margin: { left: margin, right: margin },
    head: [["Bill To", "Details"]],
    body: [
      [
        `${customer.name}\n${customer.address}`,
        `Tax ID: ${customer.taxId || "N/A"}\nCurrency: ${currency.code}`,
      ],
    ],
    theme: "grid",
    headStyles: { fillColor: [25, 118, 210] },
    styles: { fontSize: 9, cellPadding: 8, font: "helvetica" },
  });

  // ===================== ITEMS TABLE =====================
  const itemsRows = invoice.items.map((item: InvoiceItem, i: number) => [
    (i + 1).toString(),
    item.name,
    item.hsn || "-",
    item.qty.toString(),
    `${symbol}${item.price.toLocaleString(currency.locale)}`,
    `${symbol}${(item.qty * item.price).toLocaleString(currency.locale)}`,
  ]);

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 20,
    margin: { left: margin, right: margin },
    head: [["S.No", "Description", "HSN/SAC", "Qty", "Rate", "Amount"]],
    body: itemsRows,
    theme: "striped",
    headStyles: { fillColor: [21, 101, 192] },
    columnStyles: {
      0: { halign: "center", cellWidth: 30 },
      3: { halign: "center", cellWidth: 40 },
      4: { halign: "right" },
      5: { halign: "right" },
    },
    styles: { fontSize: 9 },
  });

  // ===================== SUMMARY & QR =====================
  // Totals Table (Right Side)
  currY = doc.lastAutoTable.finalY + 20;
  autoTable(doc, {
    startY: currY,
    margin: { left: pageWidth - margin - 200 },
    body: [
      [
        "Subtotal",
        `${symbol}${totals.subtotal.toLocaleString(currency.locale)}`,
      ],
      [
        `Tax (${invoice.presetKey})`,
        `${symbol}${
          totals.taxAmount?.toLocaleString(currency.locale) || "0.00"
        }`,
      ],
      [
        "Grand Total",
        `${symbol}${totals.total.toLocaleString(currency.locale)}`,
      ],
    ],
    theme: "grid",
    styles: { fontSize: 10, halign: "right" },
    columnStyles: { 0: { fontStyle: "bold", halign: "left" } },
    didParseCell: (data) => {
      if (data.row.index === 2) {
        // Grand Total Row
        data.cell.styles.fillColor = [255, 248, 248];
        data.cell.styles.textColor = [211, 47, 47];
        data.cell.styles.fontSize = 12;
      }
    },
  });

  // QR Code (Left Side)
  if (invoice.qrEnabled) {
    try {
      // Logic for UPI (India) or Generic Link
      const qrValue = `Invoice:${invoice.invoiceNumber}|Total:${totals.total}`;
      const qrData = await QRCode.toDataURL(qrValue);
      doc.addImage(qrData, "PNG", margin, currY, 150, 150);
      doc
        .setFontSize(8)
        .setTextColor(100)
        .text("Verify Invoice", margin + 75, currY + 150, { align: "center" });
    } catch (err) {
      console.error("QR Generation failed", err);
    }
  }

  // ===================== FOOTER =====================
  const footerY = doc.internal.pageSize.getHeight() - 40;
  doc
    .setFontSize(8)
    .setTextColor(150)
    .text(
      "This is a computer-generated document. No signature is required.",
      pageWidth / 2,
      footerY,
      { align: "center" }
    );

  // Trigger Download
  return doc.output("blob");
}
