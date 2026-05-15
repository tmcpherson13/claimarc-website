import { useEffect, useRef, useState } from "react";
import { Archive, Clock, FileCheck, RefreshCw, type LucideIcon } from "lucide-react";

type Stat = {
  icon: LucideIcon;
  prefix: string;
  target: number;
  suffix: string;
  decimals: number;
  label: string;
  ariaLabel: string;
};

const stats: Stat[] = [
  {
    icon: RefreshCw,
    prefix: "",
    target: 100,
    suffix: "%",
    decimals: 0,
    label: "Bi-directional true-up",
    ariaLabel: "One hundred percent bi-directional true-up — overage on every advance returned to you",
  },
  {
    icon: Archive,
    prefix: "",
    target: 10,
    suffix: "yr",
    decimals: 0,
    label: "Audit-ready archive",
    ariaLabel: "Ten year audit-ready remittance archive option",
  },
  {
    icon: Clock,
    prefix: "<",
    target: 24,
    suffix: "hr",
    decimals: 0,
    label: "Average processing",
    ariaLabel: "Under 24 hours average processing",
  },
  {
    icon: FileCheck,
    prefix: "",
    target: 500,
    suffix: "K+",
    decimals: 0,
    label: "Claims processed annually",
    ariaLabel: "500 thousand plus claims processed annually",
  },
];

const DURATION_MS = 1200;

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

const StatCard = ({ stat }: { stat: Stat }) => {
  const Icon = stat.icon;
  const [value, setValue] = useState(0);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const fired = useRef(false);

  useEffect(() => {
    const node = cardRef.current;
    if (!node) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setValue(stat.target);
      fired.current = true;
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !fired.current) {
            fired.current = true;
            const start = performance.now();
            const tick = (now: number) => {
              const elapsed = now - start;
              const t = Math.min(elapsed / DURATION_MS, 1);
              setValue(stat.target * easeOut(t));
              if (t < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
            observer.disconnect();
          }
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [stat.target]);

  const display =
    stat.decimals > 0 ? value.toFixed(stat.decimals) : Math.round(value).toString();
  const finalDisplay =
    stat.decimals > 0 ? stat.target.toFixed(stat.decimals) : stat.target.toString();

  return (
    <div
      ref={cardRef}
      className="min-h-[200px] rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-colors hover:border-brand-primary/40"
      aria-label={stat.ariaLabel}
    >
      <Icon size={32} className="text-brand-primary" aria-hidden="true" />
      <div
        className="display mt-5 text-4xl leading-none tracking-tight text-[var(--text-hi)] tabular-nums"
        aria-hidden="true"
      >
        <span>{stat.prefix}</span>
        <span
          style={{ display: "inline-block", minWidth: `${finalDisplay.length}ch` }}
        >
          {display}
        </span>
        <span>{stat.suffix}</span>
      </div>
      <p className="mt-3 text-sm text-white/60">{stat.label}</p>
    </div>
  );
};

const StatCallouts = () => (
  <section className="relative py-12 md:py-16">
    <div className="shell">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} stat={stat} />
        ))}
      </div>
    </div>
  </section>
);

export default StatCallouts;
