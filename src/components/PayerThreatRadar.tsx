import { useEffect, useRef, useState } from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

/**
 * PayerThreatRadar — illustrative behavioral comparison of major payers
 * across 5 threat dimensions. Decorative + narrative; values are illustrative.
 */

const data = [
  { axis: "Denial Rate", UHC: 88, BCBS: 62, Aetna: 71, Cigna: 65, Humana: 58, Molina: 74 },
  { axis: "Auth Requirements", UHC: 82, BCBS: 55, Aetna: 68, Cigna: 60, Humana: 52, Molina: 70 },
  { axis: "Days to Pay", UHC: 75, BCBS: 48, Aetna: 60, Cigna: 55, Humana: 45, Molina: 65 },
  { axis: "Policy Volatility", UHC: 90, BCBS: 58, Aetna: 72, Cigna: 62, Humana: 50, Molina: 68 },
  { axis: "Appeal Difficulty", UHC: 85, BCBS: 60, Aetna: 70, Cigna: 58, Humana: 55, Molina: 72 },
];

const payers = [
  { key: "UHC", color: "#EF4444", fillOpacity: 0.08 },
  { key: "BCBS", color: "#3B82F6", fillOpacity: 0.06 },
  { key: "Aetna", color: "#F59E0B", fillOpacity: 0.06 },
  { key: "Cigna", color: "#10B981", fillOpacity: 0.06 },
  { key: "Humana", color: "#8B5CF6", fillOpacity: 0.06 },
  { key: "Molina", color: "#64748B", fillOpacity: 0.06 },
];

const PayerThreatRadar = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="bg-[var(--navy)] py-20 px-6 md:px-12 lg:px-16">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        {/* Left column */}
        <div>
          <p className="text-[var(--amber)] text-xs font-semibold uppercase tracking-[0.2em]">
            Payer Threat Intelligence
          </p>
          <h2 className="text-white text-3xl font-bold mt-3">
            Not all payers behave the same way.
          </h2>
          <p className="text-slate-400 mt-5 leading-relaxed">
            Sentinel tracks behavioral patterns across every major payer in
            real time. The difference between UHC and Humana isn't just denial
            rate — it's the combination of aggression signals that predicts
            your next 90 days.
          </p>
        </div>

        {/* Right column — chart */}
        <div
          ref={ref}
          className={`transition-all duration-700 ease-out ${
            inView
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          }`}
        >
          <div className="w-full h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={data} outerRadius="75%">
                <PolarGrid gridType="polygon" stroke="#1E3A5F" />
                <PolarAngleAxis
                  dataKey="axis"
                  tick={{ fill: "#64748B", fontSize: 12 }}
                />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 100]}
                  axisLine={false}
                  tick={false}
                />
                {payers.map((p) => (
                  <Radar
                    key={p.key}
                    name={p.key}
                    dataKey={p.key}
                    stroke={p.color}
                    fill={p.color}
                    fillOpacity={p.fillOpacity}
                    strokeWidth={2}
                    isAnimationActive={inView}
                    animationDuration={900}
                  />
                ))}
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <ul className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-2">
            {payers.map((p) => (
              <li
                key={p.key}
                className="flex items-center gap-2 text-slate-300 text-sm"
              >
                <span
                  className="inline-block w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: p.color }}
                />
                {p.key}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default PayerThreatRadar;
