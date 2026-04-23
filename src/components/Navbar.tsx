import { Link, useLocation } from "react-router-dom";
import AI3 from "./AI3";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Platform", to: "/platform" },
  { label: "Why ZDefense", to: "/why-zdefense" },
  { label: "Solutions", to: "/solutions" },
  { label: "Pricing", to: "/pricing" },
  { label: "Contact", to: "/contact" },
];

const Navbar = () => {
  const { pathname } = useLocation();

  return (
    <nav className="sticky top-0 z-50 bg-[var(--navy)] px-4 md:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
      <Link to="/" className="flex items-center">
        <span className="text-white font-bold text-xl">
          ZDefense <AI3 />
        </span>
      </Link>

      <div className="hidden lg:flex items-center gap-8">
        {navLinks.map((link) => {
          const active = pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm transition ${
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

      <div className="flex items-center gap-3 flex-wrap">
        <Link
          to="/contact"
          className="bg-[var(--emerald)] text-white px-4 py-2 rounded text-sm font-semibold"
        >
          Book a Demo
        </Link>
        <Link
          to="/contact?offer=trial"
          className="border border-[var(--emerald)] text-[var(--emerald)] px-4 py-2 rounded text-sm"
        >
          Start 30-Day Evaluation
        </Link>
        <a
          href="https://zdefense.lovable.app/?demo=true"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/50 text-xs underline"
        >
          See Live Demo ↗
        </a>
      </div>

      <div className="flex lg:hidden w-full items-center gap-6 overflow-x-auto">
        {navLinks.map((link) => {
          const active = pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm whitespace-nowrap transition ${
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
    </nav>
  );
};

export default Navbar;
