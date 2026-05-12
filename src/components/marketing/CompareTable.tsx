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
  <div className="mt-12 overflow-hidden rounded-2xl border border-[var(--line)]">
    <table className="w-full border-collapse text-left text-sm">
      <thead>
        <tr>
          <th className="w-1/3 bg-[var(--mist)] px-5 py-4" />
          <th className="bg-[var(--mist)] px-5 py-4 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[var(--slate)]">
            {themHeading}
          </th>
          <th className="bg-[var(--navy)] px-5 py-4 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[var(--cyan)]">
            {usHeading}
          </th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={row.label} className={i % 2 ? "bg-[var(--mist)]/40" : "bg-white"}>
            <td className="px-5 py-4 font-semibold text-[var(--navy)]">{row.label}</td>
            <td className="px-5 py-4 align-top text-[var(--slate)]">
              <span className="inline-flex items-start gap-2">
                <Minus size={16} className="mt-0.5 shrink-0 text-[var(--slate)]/60" />
                <span className="italic">{row.them}</span>
              </span>
            </td>
            <td className="bg-[var(--navy)]/[0.03] px-5 py-4 align-top text-[var(--navy)]">
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
