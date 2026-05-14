import { Check, X } from "lucide-react";

export interface CompareRow {
  label: string;
  them: string;
  us: string;
}

/**
 * CompareTable — legacy approach vs. ClaimARC.
 *
 * Treatment: the "them" column reads in a faded red wash with X marks;
 * the "us" column glows lime with check marks. A footer pull-out
 * summarizes the bottom-line difference so the table earns its space.
 */
const CompareTable = ({
  themHeading,
  usHeading,
  rows,
  footer,
}: {
  themHeading: string;
  usHeading: string;
  rows: CompareRow[];
  /** Optional bottom-line summary rendered as a pull-out at the foot of
      the table. Pass JSX so a dollar/time delta can be set in arc-text. */
  footer?: React.ReactNode;
}) => (
  <div className="mt-12 overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-xl">
    <table className="w-full border-collapse text-left text-sm">
      <thead>
        <tr>
          <th className="w-1/3 bg-white/[0.02] px-5 py-4" />
          <th
            className="px-5 py-4 text-[0.7rem] font-semibold uppercase tracking-[0.14em]"
            style={{
              background:
                "linear-gradient(135deg, rgba(220, 38, 38, 0.10), rgba(220, 38, 38, 0.04))",
              color: "#F87171",
            }}
          >
            {themHeading}
          </th>
          <th
            className="px-5 py-4 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[var(--lime)]"
            style={{
              background:
                "linear-gradient(135deg, rgba(126,217,87,0.14), rgba(0,200,230,0.10))",
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
            <td
              className="px-5 py-4 align-top"
              style={{ background: "rgba(220, 38, 38, 0.04)" }}
            >
              <span className="inline-flex items-start gap-2">
                <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-red-500/15">
                  <X size={11} className="text-red-400" strokeWidth={3} />
                </span>
                <span className="italic text-[var(--text-mid)]">{row.them}</span>
              </span>
            </td>
            <td
              className="px-5 py-4 align-top text-[var(--text-hi)]"
              style={{
                background:
                  "linear-gradient(135deg, rgba(126,217,87,0.08), rgba(0,200,230,0.06))",
              }}
            >
              <span className="inline-flex items-start gap-2">
                <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[var(--lime)]/20">
                  <Check size={11} className="text-[var(--lime)]" strokeWidth={3} />
                </span>
                <span className="font-medium">{row.us}</span>
              </span>
            </td>
          </tr>
        ))}
      </tbody>
      {footer && (
        <tfoot>
          <tr>
            <td
              colSpan={3}
              className="px-5 py-5 text-sm text-[var(--text-mid)]"
              style={{
                background:
                  "linear-gradient(180deg, transparent, rgba(126,217,87,0.06))",
                borderTop: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              {footer}
            </td>
          </tr>
        </tfoot>
      )}
    </table>
  </div>
);

export default CompareTable;
