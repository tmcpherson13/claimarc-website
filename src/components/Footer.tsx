import { Link } from "react-router-dom";
import { ArrowUpRight, Mail } from "lucide-react";
import Logo from "./Logo";
import { COMPANY, compliance, primaryNav, services } from "@/config/site";

const Footer = () => {
  return (
    <footer className="relative border-t border-white/[0.06] bg-[var(--ink-0)]/85 text-white backdrop-blur-xl">
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

      {/* Sign-off slab — a decisive last word above the link columns. */}
      <div className="border-b border-white/[0.06]">
        <div className="shell-wide grid items-center gap-8 py-14 md:grid-cols-[1.4fr_1fr] md:py-20">
          <div>
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-[var(--lime)]">
              The last word
            </p>
            <h2 className="display mt-4 text-balance text-3xl leading-[1.08] tracking-tight text-white md:text-[2.6rem]">
              The money is already earned.{" "}
              <span className="arc-text">Let's get it to you.</span>
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-[var(--text-mid)]">
              ClaimARC partnerships are limited and require qualification. If
              the math works for both of us, we'll know in 30 minutes.
            </p>
          </div>
          <div className="flex flex-col items-start gap-3 md:items-end">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[var(--arc-1)] via-[var(--arc-2)] to-[var(--arc-3)] bg-[length:200%_100%] bg-left px-6 py-3 text-sm font-semibold text-white shadow-[0_0_0_1px_rgba(255,255,255,0.10)_inset,0_10px_30px_-10px_rgba(0,200,230,0.55)] transition-all hover:bg-right"
            >
              Talk to the team
              <ArrowUpRight size={16} />
            </Link>
            <a
              href={`mailto:${COMPANY.email}`}
              className="mono inline-flex items-center gap-2 text-sm text-[var(--text-mid)] underline-offset-4 hover:text-white hover:underline"
            >
              <Mail size={13} />
              {COMPANY.email}
            </a>
          </div>
        </div>
      </div>

      <div className="shell-wide py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo variant="light" kind="horiz" height={44} />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-[var(--text-lo)]">
              AI-powered claim payment acceleration — powered by claim-to-cash
              conversion, correspondence indexing, and ERA processing.
            </p>
            <p className="mt-4 text-sm italic shimmer-text">{COMPANY.tagline}</p>
          </div>

          <div>
            <p className="mb-4 text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-white/40">
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
            <p className="mb-4 text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-white/40">
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
            </ul>
          </div>

          <div>
            <p className="mb-4 text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-white/40">
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

        <div className="mono mt-12 flex flex-col gap-2 border-t border-white/[0.06] pt-6 text-xs text-white/40 md:flex-row md:items-center md:justify-between">
          <span>
            © 2026 Retrieve Remit, LLC dba ClaimARC. Patent Pending. All rights reserved.
          </span>
          <span>{COMPANY.arc}</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
