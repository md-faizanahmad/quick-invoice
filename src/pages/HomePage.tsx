import { Link } from "react-router-dom";
import InvoiceList from "../components/invoice/InvoiceList";

export default function Home() {
  return (
    <div className="space-y-6">
      {/* Hero / Action */}
      <div className="rounded bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold">QuickInvoice</h1>
        <p className="mt-1 text-sm text-gray-600">
          Create invoices offline. No login. No tracking.
        </p>

        <Link
          to="/invoice/new"
          className="mt-4 inline-block rounded bg-blue-600 px-5 py-2 text-white"
        >
          + Create New Invoice
        </Link>
      </div>

      {/* Recent invoices */}
      <InvoiceList />
    </div>
  );
}
