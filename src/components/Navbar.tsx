import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, Menu, X } from "lucide-react";
import Logo from "./Logo";
import { primaryNav, services } from "@/config/site";

const Navbar = () => {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setServicesOpen(false);
  }, [pathname]);

  const isActive = (to: string) =>
    pathname === to || (to !== "/" && pathname.startsWith(to));
  const servicesActive = services.some((s) => isActive(s.to));

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
        scrolled
          ? "border-white/10 bg-[var(--navy)]/95 backdrop-blur"
          : "border-transparent bg-[var(--navy)]"
      }`}
    >
      <div className="shell-wide flex h-16 items-center justify-between gap-6">
        <Link to="/" aria-label="ClaimARC home" className="shrink-0">
          <Logo variant="light" kind="horiz" height={40} />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          <div
            className="relative"
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}
          >
            <button
              type="button"
              onClick={() => setServicesOpen((v) => !v)}
              aria-expanded={servicesOpen}
              className={`flex items-center gap-1 text-sm font-medium transition-colors ${
                servicesActive ? "text-[var(--cyan)]" : "text-white/80 hover:text-white"
              }`}
            >
              Services
              <ChevronDown
                size={15}
                className={`transition-transform ${servicesOpen ? "rotate-180" : ""}`}
              />
            </button>
            {servicesOpen && (
              <div className="absolute left-1/2 top-full w-72 -translate-x-1/2 pt-3">
                <div className="overflow-hidden rounded-xl border border-white/10 bg-[var(--navy-soft)] shadow-xl">
                  {services.map((s) => (
                    <Link
                      key={s.to}
                      to={s.to}
                      className={`block px-5 py-3.5 text-sm transition-colors ${
                        isActive(s.to)
                          ? "bg-white/5 text-[var(--cyan)]"
                          : "text-white/85 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      {s.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {primaryNav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`text-sm font-medium transition-colors ${
                isActive(item.to) ? "text-[var(--cyan)]" : "text-white/80 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Link
            to="/contact"
            className="rounded-md bg-[var(--cyan)] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--cyan-dk)]"
          >
            Book a Demo
          </Link>
        </div>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="-mr-2 rounded p-2 text-white lg:hidden"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-[var(--navy)] lg:hidden">
          <div className="shell-wide flex flex-col gap-1 py-4">
            <p className="px-1 pt-2 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-white/40">
              Services
            </p>
            {services.map((s) => (
              <Link
                key={s.to}
                to={s.to}
                className={`rounded-md px-1 py-2.5 text-base ${
                  isActive(s.to) ? "text-[var(--cyan)]" : "text-white/85"
                }`}
              >
                {s.label}
              </Link>
            ))}
            <div className="my-2 h-px bg-white/10" />
            {primaryNav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`rounded-md px-1 py-2.5 text-base ${
                  isActive(item.to) ? "text-[var(--cyan)]" : "text-white/85"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/contact"
              className="mt-3 rounded-md bg-[var(--cyan)] px-4 py-3 text-center text-sm font-semibold text-white"
            >
              Book a Demo
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
