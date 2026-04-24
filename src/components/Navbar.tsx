import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import AI3 from "./AI3";

const navLinks = [
  { to: "/platform", label: "Platform" },
  { to: "/solutions", label: "Solutions" },
  { to: "/blog", label: "Intelligence Center" },
  { to: "/pricing", label: "Pricing" },
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

        <div className="hidden lg:flex items-center gap-4">
          <Link
            to="/contact"
            className="plausible-event-name=CTA_Click plausible-event-location=navbar plausible-event-cta=book_demo bg-[var(--emerald)] text-white px-4 py-2 rounded text-sm font-semibold hover:bg-emerald-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--emerald)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--navy)]"
          >
            Book a Demo
          </Link>
          <Link
            to="/contact?offer=trial"
            className="plausible-event-name=CTA_Click plausible-event-location=navbar plausible-event-cta=start_trial text-[var(--emerald)] text-sm underline hover:text-emerald-400 transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--emerald)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--navy)] rounded"
          >
            30-Day Evaluation →
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
