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

          {/* Intelligence Center — inline with nav links, visually distinct */}
          <Link
            to="/blog"
            className="group relative inline-flex items-center gap-2 px-4 py-1.5 rounded-full font-semibold text-sm text-white overflow-hidden transition-all duration-300 hover:shadow-md hover:shadow-emerald-500/20"
            style={{
              background:
                'linear-gradient(135deg, #1E3A5F 0%, #10B981 100%)',
            }}
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-60" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white" />
            </span>
            <span className="relative tracking-wide text-xs uppercase">Intelligence Center</span>
          </Link>
        </div>

        <div className="hidden lg:flex items-center gap-2">
          <Link
            to="/contact?offer=demo"
            className="plausible-event-name=CTA_Click plausible-event-location=navbar plausible-event-cta=book_demo plausible-event-offer=demo bg-[var(--emerald)] hover:bg-emerald-500 text-white text-xs font-semibold px-3 py-2 rounded-md text-center transition-colors whitespace-nowrap"
          >
            Book a Demo
          </Link>
          <Link
            to="/contact?offer=trial"
            className="plausible-event-name=CTA_Click plausible-event-location=navbar plausible-event-cta=start_trial plausible-event-offer=trial border border-[var(--emerald)] text-[var(--emerald)] hover:bg-emerald-500/10 text-xs font-semibold px-3 py-2 rounded-md text-center transition-colors whitespace-nowrap"
          >
            30-Day Eval
          </Link>
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
              to="/blog"
              onClick={closeMenu}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-full font-semibold text-xs text-white uppercase tracking-wide"
              style={{
                background:
                  'linear-gradient(135deg, #1E3A5F 0%, #10B981 100%)',
              }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-ping" />
              Intelligence Center
            </Link>
            <Link
              to="/contact?offer=demo"
              onClick={closeMenu}
              className="plausible-event-name=CTA_Click plausible-event-location=navbar_mobile plausible-event-cta=book_demo plausible-event-offer=demo bg-[var(--emerald)] text-white px-4 py-2.5 rounded-md text-sm font-semibold text-center hover:bg-emerald-600 transition-colors"
            >
              Book a Demo
            </Link>
            <Link
              to="/contact?offer=trial"
              onClick={closeMenu}
              className="plausible-event-name=CTA_Click plausible-event-location=navbar_mobile plausible-event-cta=start_trial plausible-event-offer=trial border border-[var(--emerald)] text-[var(--emerald)] text-sm font-semibold text-center px-4 py-2.5 rounded-md hover:bg-emerald-500/10 transition-colors"
            >
              30-Day Evaluation
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
