import { Link } from "react-router-dom";
import Logo from "./Logo";
import { COMPANY, compliance, primaryNav, services } from "@/config/site";

const Footer = () => {
  return (
    <footer className="relative border-t border-white/[0.06] bg-[var(--ink-0)]/80 text-white backdrop-blur-xl">
      {/* Top hairline accent — signature gradient */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, var(--arc-1), var(--arc-2), var(--arc-3), transparent)",
          opacity: 0.7,
        }}
      />

      <div className="shell-wide py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo variant="light" kind="horiz" height={44} />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-[var(--text-lo)]">
              The complete revenue intelligence platform — EOB conversion, ERA
              processing, and AI-powered claim payment acceleration.
            </p>
            <p className="mt-4 text-sm italic shimmer-text">{COMPANY.tagline}</p>
          </div>

          <div>
            <p className="mb-4 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-white/40">
              Services
            </p>
            <ul className="space-y-2.5">
              {services.map((s) => (
                <li key={s.to}>
                  <Link
                    to={s.to}
                    className="text-sm text-[var(--text-mid)] transition-colors hover:text-white"
                  >
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-4 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-white/40">
              Company
            </p>
            <ul className="space-y-2.5">
              {primaryNav.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="text-sm text-[var(--text-mid)] transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/leadership"
                  className="text-sm text-[var(--text-mid)] transition-colors hover:text-white"
                >
                  Leadership
                </Link>
              </li>
              <li>
                <a
                  href={`mailto:${COMPANY.email}`}
                  className="text-sm text-[var(--text-mid)] transition-colors hover:text-white"
                >
                  {COMPANY.email}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="mb-4 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-white/40">
              Trust & Compliance
            </p>
            <ul className="flex flex-wrap gap-2">
              {compliance.map((c) => (
                <li
                  key={c}
                  className="rounded-md border border-white/15 bg-white/[0.03] px-2.5 py-1 text-[0.7rem] font-medium text-[var(--text-mid)]"
                >
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-white/[0.06] pt-6 text-xs text-white/40 md:flex-row md:items-center md:justify-between">
          <span>
            © 2026 Retrieve Remit, LLC dba ClaimARC
          </span>
          <span>{COMPANY.arc}</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
