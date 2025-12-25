// src/App.tsx
import { Routes, Route, Navigate } from "react-router-dom";

import Header from "./components/Header";
import InstallPrompt from "./components/InstallPrompt";

import InvoiceCreatePage from "./pages/InvoiceCreatePage";
import InvoiceEditPage from "./components/invoice/InvoiceEditPage";
import Home from "./pages/HomePage";
import InvoiceViewPage from "./pages/InvoiceViewPage";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Header />

      <main className="container mx-auto px-4 py-6 lg:py-8">
        <InstallPrompt />

        <Routes>
          {/* Home */}
          <Route path="/" element={<Home />} />

          {/* Create */}
          <Route path="/invoice/new" element={<InvoiceCreatePage />} />

          {/* Edit */}
          <Route path="/invoice/edit/:id" element={<InvoiceEditPage />} />
          <Route path="/invoice/view/:id" element={<InvoiceViewPage />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
