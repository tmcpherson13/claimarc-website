import { Link } from "react-router-dom";
import Logo from "./Logo";
import { COMPANY, compliance, primaryNav, services } from "@/config/site";

const year = new Date().getFullYear();

const Footer = () => {
  return (
    <footer className="bg-[var(--navy-dk)] text-white">
      <div className="shell-wide py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo variant="light" kind="horiz" height={44} />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/55">
              The complete revenue intelligence platform — EOB conversion, ERA
              processing, and AI-powered claim payment acceleration.
            </p>
            <p className="mt-4 text-sm italic text-[var(--cyan)]">{COMPANY.tagline}</p>
          </div>

          <div>
            <p className="mb-4 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-white/40">
              Services
            </p>
            <ul className="space-y-2.5">
              {services.map((s) => (
                <li key={s.to}>
                  <Link to={s.to} className="text-sm text-white/65 transition-colors hover:text-white">
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
                  <Link to={item.to} className="text-sm text-white/65 transition-colors hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href={`mailto:${COMPANY.email}`}
                  className="text-sm text-white/65 transition-colors hover:text-white"
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
                  className="rounded-md border border-white/15 px-2.5 py-1 text-[0.7rem] font-medium text-white/60"
                >
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-white/40 md:flex-row md:items-center md:justify-between">
          <span>
            © {year} {COMPANY.legal}. Patent Pending. All rights reserved.
          </span>
          <span>{COMPANY.arc}</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
