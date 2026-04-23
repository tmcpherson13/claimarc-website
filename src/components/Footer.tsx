import { Link } from "react-router-dom";
import { Shield, Lock, FileCheck } from "lucide-react";
import AI3 from "./AI3";

const compliance = [
  { label: "SOC 2 Type II", Icon: Shield },
  { label: "ISO 27001:2022", Icon: Lock },
  { label: "HIPAA Compliant", Icon: FileCheck },
];

const Footer = () => {
  return (
    <footer className="bg-[var(--navy)] text-white px-6 md:px-12 lg:px-16 py-16">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Col 1 — Brand */}
          <div>
            <div className="text-white font-bold text-xl">
              ZDefense <AI3 />
            </div>
            <p className="text-slate-400 text-sm mt-1">
              Revenue Cycle Intelligence Platform
            </p>
            <p className="text-[var(--emerald)] italic mt-2">
              Predict. Protect. Recover.
            </p>
            <p className="text-slate-500 text-xs mt-6">© 2026 ZTech.</p>
          </div>

          {/* Col 2 — Platform */}
          <div>
            <p className="text-slate-500 text-xs uppercase tracking-wider mb-4">
              PLATFORM
            </p>
            <ul className="space-y-2">
              {[
                { label: "Why ZDefense", to: "/why-zdefense" },
                { label: "Solutions", to: "/solutions" },
                { label: "Platform", to: "/platform" },
                { label: "Pricing", to: "/pricing" },
              ].map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-slate-400 text-sm hover:text-white transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Company */}
          <div>
            <p className="text-slate-500 text-xs uppercase tracking-wider mb-4">
              COMPANY
            </p>
            <ul className="space-y-2">
              <li>
                <Link to="/contact" className="text-slate-400 text-sm hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-slate-400 text-sm hover:text-white transition-colors">
                  Book a Demo
                </Link>
              </li>
              <li>
                <Link
                  to="/contact?offer=trial"
                  className="text-slate-400 text-sm hover:text-white transition-colors"
                >
                  Start 30-Day Evaluation
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4 — Compliance */}
          <div>
            <p className="text-slate-500 text-xs uppercase tracking-wider mb-4">
              COMPLIANCE
            </p>
            <div className="flex flex-col items-start">
              {compliance.map(({ label, Icon }) => (
                <span
                  key={label}
                  className="border border-slate-600 rounded px-3 py-1 text-xs text-slate-400 inline-flex items-center gap-2 mb-2"
                >
                  <Icon size={12} className="text-[var(--emerald)]" />
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col md:flex-row justify-between text-slate-500 text-xs gap-2">
          <span>ZDefense is a product of ZTech</span>
          <span>Privacy Policy · Terms of Service</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
