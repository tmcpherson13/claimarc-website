import { Check, Minus } from "lucide-react";

export interface CompareRow {
  label: string;
  them: string;
  us: string;
}

/** Two-column comparison table: legacy approach vs. ClaimARC. */
const CompareTable = ({
  themHeading,
  usHeading,
  rows,
}: {
  themHeading: string;
  usHeading: string;
  rows: CompareRow[];
}) => (
  <div className="mt-12 overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-xl">
    <table className="w-full border-collapse text-left text-sm">
      <thead>
        <tr>
          <th className="w-1/3 bg-white/[0.02] px-5 py-4" />
          <th className="bg-white/[0.02] px-5 py-4 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[var(--text-lo)]">
            {themHeading}
          </th>
          <th
            className="px-5 py-4 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[var(--arc-1)]"
            style={{
              background:
                "linear-gradient(135deg, rgba(0,200,255,0.10), rgba(110,91,255,0.10))",
            }}
          >
            {usHeading}
          </th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr
            key={row.label}
            className={i % 2 ? "bg-white/[0.015]" : "bg-transparent"}
          >
            <td className="px-5 py-4 font-semibold text-[var(--text-hi)]">{row.label}</td>
            <td className="px-5 py-4 align-top text-[var(--text-lo)]">
              <span className="inline-flex items-start gap-2">
                <Minus size={16} className="mt-0.5 shrink-0 text-[var(--text-lo)]/70" />
                <span className="italic">{row.them}</span>
              </span>
            </td>
            <td
              className="px-5 py-4 align-top text-[var(--text-hi)]"
              style={{
                background:
                  "linear-gradient(135deg, rgba(0,200,255,0.06), rgba(110,91,255,0.06))",
              }}
            >
              <span className="inline-flex items-start gap-2">
                <Check size={16} className="mt-0.5 shrink-0 text-[var(--lime)]" />
                <span className="font-medium">{row.us}</span>
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default CompareTable;
