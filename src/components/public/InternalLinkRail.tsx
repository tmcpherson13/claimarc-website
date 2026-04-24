import { Link } from "react-router-dom";

const links = [
  {
    to: "/platform",
    label: "Platform",
    blurb: "How AI³ scores, routes, and resolves denials at scale.",
  },
  {
    to: "/workflows",
    label: "Workflows",
    blurb: "Pre-built playbooks for the denials your team sees most.",
  },
  {
    to: "/why-zdefense",
    label: "Why ZDefense",
    blurb: "What makes our payer-behavior model different.",
  },
  {
    to: "/pricing",
    label: "Pricing",
    blurb: "Transparent plans aligned to recovered revenue.",
  },
];

const InternalLinkRail = () => (
  <section className="mt-16 not-prose">
    <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
      Explore the platform
    </p>
    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {links.map((l) => (
        <Link
          key={l.to}
          to={l.to}
          className="block p-4 border border-slate-200 rounded-lg hover:border-[var(--emerald)] hover:bg-emerald-50/30 transition-all group"
        >
          <p className="font-semibold text-[var(--navy)] group-hover:text-[var(--emerald)] flex items-center gap-1">
            {l.label}
            <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
          </p>
          <p className="mt-1 text-xs text-slate-600 leading-relaxed">{l.blurb}</p>
        </Link>
      ))}
    </div>
  </section>
);

export default InternalLinkRail;
