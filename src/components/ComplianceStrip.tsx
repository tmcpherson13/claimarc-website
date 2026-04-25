import { ShieldCheck, Lock, FileCheck2 } from "lucide-react";

/**
 * Executive-facing compliance trust strip.
 *
 * SOC 2 Type II is the headline achievement (difficult to attain, annual
 * audit). ISO/IEC 27001:2022 and HIPAA are positioned as the expected
 * baseline. Subtle fade-in + soft pulse on the SOC 2 badge — restrained,
 * not gaudy.
 */
const ComplianceStrip = () => {
  return (
    <div
      className="animate-fade-in rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-sm px-5 py-4 flex flex-wrap items-center gap-x-6 gap-y-3"
      role="region"
      aria-label="Compliance certifications"
    >
      {/* Headline: SOC 2 Type II */}
      <div className="flex items-center gap-2.5 group">
        <span className="relative flex items-center justify-center w-9 h-9 rounded-md bg-[var(--emerald)]/15 ring-1 ring-[var(--emerald)]/40">
          <span
            className="absolute inset-0 rounded-md bg-[var(--emerald)]/20 animate-ping"
            style={{ animationDuration: "3.5s" }}
            aria-hidden="true"
          />
          <ShieldCheck size={18} className="relative text-[var(--emerald)]" />
        </span>
        <div className="leading-tight">
          <p className="text-white text-sm font-semibold tracking-tight">
            SOC 2 Type II
          </p>
          <p className="text-[var(--emerald)] text-[11px] uppercase tracking-wider font-medium">
            Independently Audited
          </p>
        </div>
      </div>

      <span className="hidden sm:block h-8 w-px bg-white/10" aria-hidden="true" />

      {/* Baseline: ISO + HIPAA */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
        <div className="flex items-center gap-2 text-slate-300 text-sm">
          <Lock size={14} className="text-slate-400" />
          <span className="font-medium">ISO/IEC 27001:2022</span>
        </div>
        <div className="flex items-center gap-2 text-slate-300 text-sm">
          <FileCheck2 size={14} className="text-slate-400" />
          <span className="font-medium">HIPAA Compliant</span>
        </div>
        <span className="text-slate-500 text-xs italic hidden md:inline">
          Baseline expected — SOC 2 Type II is the differentiator
        </span>
      </div>
    </div>
  );
};

export default ComplianceStrip;
