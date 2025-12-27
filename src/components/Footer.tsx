// src/components/Footer.tsx
export default function Footer() {
  const currentYear = new Date().getFullYear();
  const yourEmail = "md.faizan.ahmad.web@gmail.com";
  return (
    <footer className="bg-slate-900 text-slate-300 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          {/* Brand / Logo Section */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Your Invoice App
            </h3>
            <p className="text-sm">Simple, fast, and beautiful invoicing.</p>
            <p>
              Create, manage and download professional invoices completely
              offline. No account. No tracking. Your data stays with you.
            </p>
            <p className="text-sm mt-3">
              Questions? Reach us at{" "}
              <a
                href={`mailto:${yourEmail}`}
                className="text-sky-400 hover:text-sky-300 underline transition-colors"
              >
                Send Email
              </a>
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-slate-200 mb-3">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm">
              <li></li>
              <li>
                <a
                  href="/invoices/new"
                  className="hover:text-sky-400 transition-colors"
                >
                  Create Invoice
                </a>
              </li>
              <li>
                <a
                  href="/invoice/history"
                  className="hover:text-sky-400 transition-colors"
                >
                  History
                </a>
              </li>
            </ul>
          </div>

          {/* Legal / Contact */}
          {/* <div>
            <h4 className="text-sm font-semibold text-slate-200 mb-3">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="/p"
                  className="hover:text-sky-400 transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="/terms"
                  className="hover:text-sky-400 transition-colors"
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </div> */}
        </div>

        {/* Copyright */}
        <div className="mt-10 pt-6 border-t border-slate-700 text-center text-sm">
          <p>&copy; {currentYear} QuickInvoice App. All rights reserved. </p>
        </div>
      </div>
    </footer>
  );
}
