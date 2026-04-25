import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import AI3 from "./AI3";

const navLinks = [
  { to: "/platform",     label: "Platform" },
  { to: "/solutions",    label: "Solutions" },
  { to: "/why-zdefense", label: "Why ZDefense" },
  { to: "/pricing",      label: "Pricing" },
  { to: "/about",        label: "About" },
];

const Navbar = () => {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  const closeMenu = () => setOpen(false);

  return (
    <nav className="sticky top-0 z-50 bg-[var(--navy)]">
      <div className="px-6 md:px-12 lg:px-16 py-4 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center" onClick={closeMenu}>
          <span className="text-white font-bold text-xl">
            ZDefense <AI3 />
          </span>
        </Link>

        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => {
            const active =
              pathname === link.to ||
              (link.to !== "/" && pathname.startsWith(link.to + "/"));
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm transition-colors ${
                  active
                    ? "text-[var(--emerald)] font-semibold"
                    : "text-white/80 hover:text-[var(--emerald)] font-medium"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="hidden lg:flex flex-col items-end gap-1.5">
          {/* INTELLIGENCE CENTER — primary hero button */}
          <Link
            to="/blog"
            className="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm text-white overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/25"
            style={{
              background:
                'linear-gradient(135deg, #0F172A 0%, #1E3A5F 50%, #10B981 100%)',
            }}
          >
            {/* Shimmer sweep animation */}
            <span
              className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"
              style={{
                background:
                  'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)',
              }}
            />
            {/* Pulse ring */}
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--emerald)] opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--emerald)]" />
            </span>
            <span className="relative tracking-wide">Intelligence Center</span>
            <span className="relative text-[var(--emerald)] group-hover:translate-x-0.5 transition-transform duration-200">
              →
            </span>
          </Link>

          {/* Secondary CTAs — subtle, below the IC button */}
          <div className="flex items-center gap-3 px-1">
            <Link
              to="/contact"
              className="plausible-event-name=CTA_Click plausible-event-location=navbar plausible-event-cta=book_demo text-white/50 text-xs hover:text-white transition-colors"
            >
              Book a Demo
            </Link>
            <span className="text-white/20 text-xs">·</span>
            <Link
              to="/contact?offer=trial"
              className="plausible-event-name=CTA_Click plausible-event-location=navbar plausible-event-cta=start_trial text-white/50 text-xs hover:text-white transition-colors"
            >
              30-Day Evaluation
            </Link>
          </div>
        </div>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className="lg:hidden text-white p-2 -mr-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--emerald)] rounded"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-slate-800 bg-[var(--navy)] px-6 md:px-12 py-4">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => {
              const active =
                pathname === link.to ||
                (link.to !== "/" && pathname.startsWith(link.to + "/"));
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={closeMenu}
                  className={`text-base py-2 transition-colors ${
                    active
                      ? "text-[var(--emerald)] font-semibold"
                      : "text-white/80 hover:text-[var(--emerald)] font-medium"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
          <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-slate-800">
            <Link
              to="/contact"
              onClick={closeMenu}
              className="plausible-event-name=CTA_Click plausible-event-location=navbar_mobile plausible-event-cta=book_demo bg-[var(--emerald)] text-white px-4 py-2.5 rounded text-sm font-semibold text-center hover:bg-emerald-600 transition-colors"
            >
              Book a Demo
            </Link>
            <Link
              to="/contact?offer=trial"
              onClick={closeMenu}
              className="plausible-event-name=CTA_Click plausible-event-location=navbar_mobile plausible-event-cta=start_trial text-[var(--emerald)] text-sm underline text-center"
            >
              30-Day Evaluation →
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
