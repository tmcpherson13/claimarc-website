/**
 * Executive-facing compliance row.
 *
 * Simple inline list of certifications with a slow, staggered glow that
 * cycles through each badge — chill, not gaudy.
 */
const CERTS = [
  "SOC 2 Type II Certified",
  "ISO/IEC 27001:2022",
  "HIPAA Compliant",
];

const ComplianceStrip = () => {
  // Total cycle = 9s; each badge holds the glow for ~3s then fades.
  const cycle = CERTS.length * 3;

  return (
    <div
      className="flex gap-4 flex-wrap text-sm"
      role="region"
      aria-label="Compliance certifications"
    >
      {CERTS.map((label, i) => (
        <span
          key={label}
          className="compliance-glow inline-flex items-center rounded-md border border-slate-700 px-3 py-1.5 text-slate-400"
          style={{
            animationDuration: `${cycle}s`,
            animationDelay: `${i * 3}s`,
          }}
        >
          ✓ {label}
        </span>
      ))}
    </div>
  );
};

export default ComplianceStrip;
