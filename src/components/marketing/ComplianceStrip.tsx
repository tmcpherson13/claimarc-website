import { ShieldCheck } from "lucide-react";
import { compliance } from "@/config/site";

/** Slim trust strip — meant to sit directly under a dark hero. */
const ComplianceStrip = () => (
  <div className="border-t border-white/10 bg-[var(--navy)]">
    <div className="shell flex flex-wrap items-center gap-x-6 gap-y-2 py-4 text-xs">
      <span className="inline-flex items-center gap-1.5 font-semibold uppercase tracking-[0.16em] text-white/45">
        <ShieldCheck size={14} className="text-[var(--lime)]" />
        Built for healthcare
      </span>
      <ul className="flex flex-wrap gap-x-5 gap-y-1.5">
        {compliance.map((c) => (
          <li key={c} className="text-white/55">
            {c}
          </li>
        ))}
      </ul>
    </div>
  </div>
);

export default ComplianceStrip;
