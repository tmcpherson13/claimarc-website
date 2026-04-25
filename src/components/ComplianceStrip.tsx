import { useNavigate, useLocation } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

/**
 * Executive-facing compliance row.
 *
 * Each pill links to the matching certification card in the
 * "Built to Pass Any Security Review" section on /why-zdefense.
 * On hover, a short tooltip explains what the certification means
 * and why it matters to customers.
 */
const CERTS = [
  {
    label: "SOC 2 Type II Certified",
    anchor: "compliance-soc2",
    tooltip:
      "Independently audited over time against the AICPA SOC 2 Type II framework. The hardest of the three to earn — proves controls actually work day after day, not just on paper.",
  },
  {
    label: "ISO/IEC 27001:2022",
    anchor: "compliance-iso",
    tooltip:
      "Global gold standard for information security management. Required baseline for most enterprise health-system security reviews.",
  },
  {
    label: "HIPAA Compliant",
    anchor: "compliance-hipaa",
    tooltip:
      "Administrative, technical, and physical safeguards aligned to HIPAA for all ePHI handling. BAA available for full-platform engagements.",
  },
];

const ComplianceStrip = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Total cycle = 9s; each badge holds the glow for ~3s then fades.
  const cycle = CERTS.length * 3;

  const goTo = (anchor: string) => {
    if (location.pathname === "/why-zdefense") {
      const el = document.getElementById(anchor);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }
    }
    navigate(`/why-zdefense#${anchor}`);
  };

  return (
    <TooltipProvider delayDuration={150}>
      <div
        className="flex gap-4 flex-wrap text-sm"
        role="region"
        aria-label="Compliance certifications"
      >
        {CERTS.map((cert, i) => (
          <Tooltip key={cert.label}>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() => goTo(cert.anchor)}
                aria-label={`${cert.label} — view details`}
                className="compliance-glow inline-flex items-center rounded-md border border-slate-700 px-3 py-1.5 text-slate-400 cursor-pointer transition-transform hover:-translate-y-0.5 hover:border-emerald-400/70 hover:text-white hover:shadow-[0_0_14px_hsl(var(--emerald)/0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--emerald)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--navy)]"
                style={{
                  animationDuration: `${cycle}s`,
                  animationDelay: `${i * 3}s`,
                }}
              >
                ✓ {cert.label}
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-xs text-xs leading-relaxed">
              {cert.tooltip}
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
};

export default ComplianceStrip;
