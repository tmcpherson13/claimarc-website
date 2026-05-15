import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowRight, ChevronDown, Menu, X } from "lucide-react";
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

  // Always scroll to top on header nav click. ScrollToTop handles cross-page;
  // this handler additionally covers clicks on the link to the current page
  // (where pathname doesn't change and ScrollToTop wouldn't fire).
  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
        scrolled
          ? "border-[#D6E2EB] bg-white/95 backdrop-blur"
          : "border-transparent bg-white"
      }`}
    >
      <div className="shell-wide flex h-16 items-center justify-between gap-6">
        <Link
          to="/"
          aria-label="ClaimARC home"
          className="shrink-0"
          onClick={scrollTop}
        >
          <Logo variant="color" kind="horiz" height={40} />
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
                servicesActive ? "text-[var(--cyan-dk)]" : "text-[#0F1B2D] hover:text-[var(--cyan-dk)]"
              }`}
            >
              Services
              <ChevronDown
                size={15}
                className={`transition-transform ${servicesOpen ? "rotate-180" : ""}`}
              />
            </button>
            {servicesOpen && (
              <div className="absolute left-1/2 top-full w-[34rem] -translate-x-1/2 pt-3">
                <div className="overflow-hidden rounded-2xl border border-[#D6E2EB] bg-white shadow-[0_24px_60px_-30px_rgba(15,27,45,0.35)]">
                  <ul className="divide-y divide-[#EEF3F7]">
                    {services.map((s) => {
                      const Icon = s.icon;
                      const active = isActive(s.to);
                      return (
                        <li key={s.to}>
                          <Link
                            to={s.to}
                            onClick={scrollTop}
                            className={`group relative flex items-start gap-4 px-5 py-4 transition-colors ${
                              active ? "bg-[#F0F6FA]" : "hover:bg-[#F7FAFC]"
                            }`}
                          >
                            <span
                              aria-hidden="true"
                              className="absolute inset-y-0 left-0 w-[3px] origin-top scale-y-0 transition-transform duration-200 group-hover:scale-y-100"
                              style={{ background: s.accent }}
                            />
                            <span
                              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                              style={{
                                background: `linear-gradient(135deg, ${s.accent}22, ${s.accent}05)`,
                                border: `1px solid ${s.accent}55`,
                                color: s.accent,
                              }}
                            >
                              <Icon size={18} />
                            </span>
                            <span className="min-w-0 flex-1">
                              <span
                                className={`block text-sm font-semibold ${
                                  active ? "text-[var(--cyan-dk)]" : "text-[#0F1B2D] group-hover:text-[var(--cyan-dk)]"
                                }`}
                              >
                                {s.label}
                              </span>
                              <span className="mt-0.5 block text-xs leading-snug text-[#5A6C82]">
                                {s.blurb}
                              </span>
                            </span>
                            <ArrowRight
                              size={14}
                              className="mt-1 shrink-0 text-[#A5B4C6] transition-all group-hover:translate-x-0.5 group-hover:text-[var(--cyan-dk)]"
                            />
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                  <Link
                    to="/why-claimarc"
                    onClick={scrollTop}
                    className="flex items-center justify-between gap-3 border-t border-[#EEF3F7] bg-[#FAFCFE] px-5 py-3.5 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--cyan-dk)] transition-colors hover:bg-[#F0F6FA]"
                  >
                    <span>See how the platform fits together</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            )}
          </div>

          {primaryNav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={scrollTop}
              className={`text-sm font-medium transition-colors ${
                isActive(item.to) ? "text-[var(--cyan-dk)]" : "text-[#0F1B2D] hover:text-[var(--cyan-dk)]"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Link
            to="/contact"
            onClick={scrollTop}
            className="rounded-md bg-[var(--cyan-dk)] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--navy)]"
          >
            Contact Us
          </Link>
        </div>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="-mr-2 rounded p-2 text-[#0F1B2D] lg:hidden"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-[#D6E2EB] bg-white lg:hidden">
          <div className="shell-wide flex flex-col gap-1 py-4">
            <p className="px-1 pt-2 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[#6E7E94]">
              Services
            </p>
            {services.map((s) => {
              const Icon = s.icon;
              const active = isActive(s.to);
              return (
                <Link
                  key={s.to}
                  to={s.to}
                  onClick={scrollTop}
                  className={`flex items-start gap-3 rounded-md px-1 py-2.5 ${
                    active ? "text-[var(--cyan-dk)]" : "text-[#0F1B2D]"
                  }`}
                >
                  <span
                    className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                    style={{
                      background: `linear-gradient(135deg, ${s.accent}22, ${s.accent}05)`,
                      border: `1px solid ${s.accent}55`,
                      color: s.accent,
                    }}
                  >
                    <Icon size={15} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-base font-semibold">{s.label}</span>
                    <span className="mt-0.5 block text-xs leading-snug text-[#5A6C82]">
                      {s.blurb}
                    </span>
                  </span>
                </Link>
              );
            })}
            <div className="my-2 h-px bg-[#D6E2EB]" />
            {primaryNav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={scrollTop}
                className={`rounded-md px-1 py-2.5 text-base ${
                  isActive(item.to) ? "text-[var(--cyan-dk)]" : "text-[#0F1B2D]"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/contact"
              onClick={scrollTop}
              className="mt-3 rounded-md bg-[var(--cyan-dk)] px-4 py-3 text-center text-sm font-semibold text-white"
            >
              Contact Us
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
