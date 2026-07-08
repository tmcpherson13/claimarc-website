import { ShieldCheck, Lock, FileBadge, Sparkles } from "lucide-react";

type Badge = {
  label: string;
  sub: string;
  Icon: typeof ShieldCheck;
  accent: string;
};

const badges: Badge[] = [
  {
    label: "SOC 2 Type II",
    sub: "Continuously audited",
    Icon: ShieldCheck,
    accent: "var(--arc-1)",
  },
  {
    label: "HIPAA Compliant",
    sub: "PHI safeguarded end-to-end",
    Icon: Lock,
    accent: "var(--lime)",
  },
  {
    label: "Patent Pending",
    sub: "Proprietary AI valuation",
    Icon: Sparkles,
    accent: "var(--arc-2)",
  },
  {
    label: "Healthcare-Native",
    sub: "Built for revenue cycle",
    Icon: FileBadge,
    accent: "var(--arc-3)",
  },
];

/** Bespoke trust strip — sits directly under a dark hero. */
const ComplianceStrip = () => (
  <div className="relative border-y border-white/[0.06] bg-white/[0.015] backdrop-blur-xl">
    <div className="shell-wide py-7">
      <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2 md:grid-cols-4">
        {badges.map(({ label, sub, Icon, accent }) => (
          <div key={label} className="flex items-center gap-3">
            <span
              className="relative inline-flex h-10 w-10 flex-none items-center justify-center rounded-xl"
              style={{
                background: `linear-gradient(135deg, ${accent}26, ${accent}05)`,
                border: `1px solid ${accent}40`,
              }}
            >
              <Icon size={18} color={accent} strokeWidth={2} />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-[var(--text-hi)]">
                {label}
              </p>
              <p className="truncate text-xs text-[var(--text-lo)]">{sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default ComplianceStrip;
