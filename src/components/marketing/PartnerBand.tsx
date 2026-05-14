import { Briefcase, Building2, Cpu, Hospital } from "lucide-react";

/**
 * PartnerBand
 *
 * A "who runs on this" band that sits between the hero and the data
 * proof sections. Because specific client logos aren't yet public-listed,
 * this surfaces partner *categories* rather than named accounts — still
 * a real credibility signal, no fake logos.
 *
 * Visually: small icon + bold name + a one-line context tag, in a
 * four-column row with hairline column separators. Quiet, but it answers
 * the "who else uses this" question that an empty page can't.
 */
const partners = [
  {
    Icon: Cpu,
    name: "Leading EHR platforms",
    tag: "Embedded acceleration partner",
  },
  {
    Icon: Hospital,
    name: "Regional hospital systems",
    tag: "Multi-facility revenue cycle",
  },
  {
    Icon: Building2,
    name: "Multi-specialty groups",
    tag: "High-volume claim shops",
  },
  {
    Icon: Briefcase,
    name: "RCM service providers",
    tag: "White-labeled into existing workflows",
  },
];

const PartnerBand = () => (
  <section className="relative border-y border-white/[0.06] bg-white/[0.015]" aria-label="Built for">
    <div className="shell-wide py-10">
      <p className="mb-6 text-center text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-[var(--text-lo)]">
        Built for healthcare revenue cycle teams
      </p>
      <div className="grid grid-cols-2 gap-y-6 md:grid-cols-4 md:divide-x md:divide-white/[0.06]">
        {partners.map(({ Icon, name, tag }) => (
          <div
            key={name}
            className="flex flex-col items-center gap-1.5 px-6 text-center"
          >
            <Icon size={22} className="text-[var(--arc-1)] opacity-80" strokeWidth={1.5} />
            <p className="mt-1 text-sm font-semibold text-[var(--text-hi)]">{name}</p>
            <p className="text-[0.7rem] text-[var(--text-lo)]">{tag}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default PartnerBand;
