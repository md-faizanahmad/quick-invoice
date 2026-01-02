// src/components/Footer.tsx
import { Mail, ExternalLink, Users, Shield, Zap } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const yourEmail = "md.faizan.ahmad.web@gmail.com";

  return (
    <footer className="bg-white border-t border-gray-200 pt-16 pb-8 mt-20">
      <div className="container mx-auto px-6 text-gray-600">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12 text-center md:text-left">
          {/* Column 1: Quick Community Branding */}
          <div className="space-y-4">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-100">
                <Users size={20} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 tracking-tight">
                Quick Community
              </h3>
            </div>
            <p className="text-sm leading-relaxed max-w-sm">
              We provide professional financial tools like this{" "}
              <strong>Offline Invoice Generator</strong> for free. As part of
              the Quick Community, we prioritize your privacy—your data never
              leaves your device.
            </p>
          </div>

          {/* Column 2: Our Free Services (Cross-Linking) */}
          <div className="space-y-4">
            <h4 className="font-bold text-gray-900 text-lg underline decoration-blue-500 underline-offset-8">
              Free Services
            </h4>
            <ul className="space-y-4 text-sm">
              <li className="group">
                <a
                  href="https://quicksuite.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-gray-700 hover:text-blue-600 font-semibold text-sm transition-colors"
                >
                  <ExternalLink
                    size={16}
                    className="text-blue-600 group-hover:text-blue-600"
                  />
                  <span className="text-blue-600 font-bold">
                    1. Quick Suite
                  </span>
                </a>
                <p className="text-xs  text-blue-600 ml-7">
                  PDF, Images & OCR Engine
                </p>
              </li>
              {/* Tool 1: Current Site */}
              <li className="flex flex-col">
                <a
                  href="https://quickinvoices.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-center md:justify-start gap-2 hover:text-blue-600 transition-colors font-semibold text-gray-700"
                >
                  <Zap
                    size={14}
                    className="text-gray-400 group-hover:text-blue-600"
                  />
                  <span>2. QuickInvoice (Invoice)</span>
                </a>
                <span className="text-xs text-gray-400 ml-5">
                  Professional PDF Invoicing
                </span>
              </li>

              {/* Tool 2: Link back to Expense Tracker */}
              <li>
                <a
                  href="https://quicktrack-navy.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-center md:justify-start gap-2 hover:text-blue-600 transition-colors font-semibold text-gray-700"
                >
                  <ExternalLink
                    size={14}
                    className="text-gray-400 group-hover:text-blue-600"
                  />
                  <span>3. QuickTrack (Expense Tracker)</span>
                </a>
                <p className="text-xs text-gray-400 ml-5 mt-1">
                  Manage daily spending offline.
                </p>
              </li>
            </ul>
          </div>

          {/* Column 3: Support & Contact */}
          <div className="space-y-4">
            <h4 className="font-bold text-gray-900 text-lg">
              Community Support
            </h4>
            <p className="text-sm">
              Need help or have a feature request? Reach out to our community
              developer.
            </p>
            <div className="flex justify-center md:justify-start">
              <a
                href={`mailto:${yourEmail}`}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md shadow-blue-100 active:scale-95"
              >
                <Mail size={18} />
                Email Support
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">
          <div className="flex items-center gap-2">
            <Shield size={12} className="text-blue-500" />
            <span>Privacy First • Local Storage • No Tracking</span>
          </div>
          <p>© {currentYear} Quick Community. Built for Privacy.</p>
        </div>
      </div>
    </footer>
  );
}
