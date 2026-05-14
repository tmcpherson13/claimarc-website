import { useEffect, useState } from "react";
import { Banknote, Brain, FileText, Layers, type LucideIcon } from "lucide-react";

/**
 * HeroDataViz
 *
 * Bespoke claim-lifecycle visualization for the home hero. Four nodes laid
 * out diagonally to read as a flow from inbound paper remittance → cash:
 *
 *   1. Paper EOB / ERA   (slate)
 *   2. 835 Conversion    (cyan)
 *   3. AI Scoring        (mid-blue)
 *   4. Cash in 1–2 Days  (lime)
 *
 * Connectors animate with the existing .arc-dash-fast class, with a small
 * floating micro-label captioning each leg. A 45 → 1 countdown lands under
 * the flow on mount, mirroring ClaimARC's DSO promise.
 *
 * Hidden below md so we don't compress the layout on mobile.
 */
interface NodeSpec {
  Icon: LucideIcon;
  label: string;
  accent: string;
  tone: string; // text + accent color for the icon ring
}

const NODES: NodeSpec[] = [
  { Icon: FileText, label: "Paper EOB / ERA", tone: "#9AA5C0", accent: "#9AA5C0" },
  { Icon: Layers,   label: "835 Conversion",  tone: "#00C8E6", accent: "#00C8E6" },
  { Icon: Brain,    label: "AI Scoring",       tone: "#1474B4", accent: "#1474B4" },
  { Icon: Banknote, label: "Cash in 1–2 Days", tone: "#7ED957", accent: "#7ED957" },
];

const MICRO_LABELS = [
  "99.7% accuracy",
  "Propensity scored",
  "Bi-directional true-up",
];

/* Hand-tuned positions for the four nodes inside the SVG/grid plane.
   x/y are percentages of the container so the layout scales fluidly. */
const POSITIONS = [
  { x: 6,  y: 8  }, // 1 — top-left
  { x: 62, y: 22 }, // 2
  { x: 18, y: 58 }, // 3
  { x: 70, y: 78 }, // 4 — bottom-right
];

/** Frame-driven countdown from 45 → 1 over 2 seconds. */
const useDsoCountdown = () => {
  const [value, setValue] = useState(45);
  useEffect(() => {
    const FROM = 45;
    const TO = 1;
    const DURATION = 2000;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / DURATION);
      // Ease-out so the number slows as it approaches 1, like a wheel settling.
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(FROM + (TO - FROM) * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return value;
};

const HeroDataViz = ({ className = "" }: { className?: string }) => {
  const dso = useDsoCountdown();

  return (
    <div
      className={`relative hidden h-[440px] w-full md:flex ${className}`}
      aria-hidden="true"
    >
      {/* SVG layer: connectors + animated dashes + micro-labels.
          viewBox uses a 100x100 plane so node x/y percentages map 1:1. */}
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
        fill="none"
      >
        <defs>
          <linearGradient id="hvLeg1" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#9AA5C0" stopOpacity="0.5" />
            <stop offset="1" stopColor="#00C8E6" stopOpacity="0.7" />
          </linearGradient>
          <linearGradient id="hvLeg2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#00C8E6" stopOpacity="0.7" />
            <stop offset="1" stopColor="#1474B4" stopOpacity="0.7" />
          </linearGradient>
          <linearGradient id="hvLeg3" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#1474B4" stopOpacity="0.7" />
            <stop offset="1" stopColor="#7ED957" stopOpacity="0.85" />
          </linearGradient>
        </defs>

        {/* Static base lines for each leg of the journey. */}
        <path d="M 12 14 C 30 14, 40 18, 64 26" stroke="url(#hvLeg1)" strokeWidth="0.5" strokeLinecap="round" />
        <path d="M 64 26 C 50 36, 32 48, 22 60"  stroke="url(#hvLeg2)" strokeWidth="0.5" strokeLinecap="round" />
        <path d="M 22 60 C 38 68, 56 76, 72 80"  stroke="url(#hvLeg3)" strokeWidth="0.5" strokeLinecap="round" />

        {/* Animated white dashes traveling along each leg. */}
        <path className="arc-dash-fast" d="M 12 14 C 30 14, 40 18, 64 26" stroke="#FFFFFF" strokeOpacity="0.7" strokeWidth="0.45" strokeLinecap="round" />
        <path className="arc-dash-fast" style={{ animationDelay: "0.6s" }} d="M 64 26 C 50 36, 32 48, 22 60" stroke="#FFFFFF" strokeOpacity="0.7" strokeWidth="0.45" strokeLinecap="round" />
        <path className="arc-dash-fast" style={{ animationDelay: "1.2s" }} d="M 22 60 C 38 68, 56 76, 72 80" stroke="#FFFFFF" strokeOpacity="0.7" strokeWidth="0.45" strokeLinecap="round" />
      </svg>

      {/* Micro-labels floating beside each connector. Positioned in HTML
          (not SVG) so they use the real display/body type system. */}
      {MICRO_LABELS.map((text, i) => {
        const pos = [
          { top: "14%", left: "30%" },
          { top: "44%", left: "30%" },
          { top: "70%", left: "44%" },
        ][i];
        return (
          <span
            key={text}
            className="hero-viz-label absolute inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-[var(--ink-1)]/80 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-[var(--text-mid)] backdrop-blur"
            style={{ ...pos, animationDelay: `${600 + i * 220}ms` }}
          >
            <span className="h-1 w-1 rounded-full bg-[var(--arc-1)]" />
            {text}
          </span>
        );
      })}

      {/* Four node cards. Each fades + slides in with a stagger. */}
      {NODES.map((node, i) => {
        const pos = POSITIONS[i];
        const { Icon } = node;
        return (
          <div
            key={node.label}
            className="hero-viz-node glass absolute flex items-center gap-3 px-4 py-3"
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              animationDelay: `${i * 150}ms`,
              boxShadow: `0 0 0 1px ${node.accent}33, 0 18px 40px -22px ${node.accent}99`,
            }}
          >
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
              style={{
                background: `linear-gradient(135deg, ${node.accent}33, ${node.accent}08)`,
                border: `1px solid ${node.accent}66`,
                color: node.tone,
              }}
            >
              <Icon size={18} strokeWidth={1.75} />
            </span>
            <div className="flex flex-col">
              <span className="text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-[var(--text-lo)]">
                Step {i + 1}
              </span>
              <span
                className="text-sm leading-snug text-[var(--text-hi)]"
                style={{ fontFamily: "var(--font-display)", fontWeight: 700, letterSpacing: "-0.01em" }}
              >
                {node.label}
              </span>
            </div>
          </div>
        );
      })}

      {/* DSO countdown — the punchline of the visualization. */}
      <div
        className="hero-viz-node glass absolute bottom-1 left-1/2 -translate-x-1/2 flex items-center gap-4 px-5 py-3"
        style={{
          animationDelay: "750ms",
          boxShadow: "0 0 0 1px #7ED95733, 0 24px 48px -24px #7ED95766",
        }}
      >
        <span className="text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-[var(--text-lo)]">
          DSO
        </span>
        <span className="flex items-baseline gap-2">
          <span
            className="text-[var(--text-lo)] line-through"
            style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}
          >
            45
          </span>
          <span className="text-[var(--text-mid)]">→</span>
          <span
            className="tabular-nums text-[var(--lime)]"
            style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.4rem", letterSpacing: "-0.02em" }}
          >
            {dso}
          </span>
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-mid)]">
            day{dso === 1 ? "" : "s"}
          </span>
        </span>
      </div>
    </div>
  );
};

export default HeroDataViz;
