import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface Props {
  eyebrow?: string;
  title: string;
  description: string;
  to: string;
  cta?: string;
}

/**
 * NextPage
 *
 * "Continue reading" tile placed before the final CtaBand on each deep
 * page. Suggests the natural next surface in the narrative chain
 * (Home → Service → Why → Contact) so visitors don't have to hunt for
 * the next step in the nav.
 */
const NextPage = ({ eyebrow = "Continue reading", title, description, to, cta = "Read next" }: Props) => (
  <section className="relative py-14 md:py-20">
    <div className="shell">
      <Link
        to={to}
        className="group relative block overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] p-8 transition-all hover:border-[var(--arc-1)]/40 hover:bg-white/[0.04] md:p-10"
      >
        {/* Subtle gradient accent on hover */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(60% 80% at 100% 50%, rgba(0,200,230,0.10), transparent 60%)",
          }}
        />
        <div className="relative grid items-center gap-6 md:grid-cols-[1fr_auto]">
          <div>
            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-[var(--text-lo)]">
              {eyebrow}
            </p>
            <h3 className="display mt-2 text-balance text-2xl leading-tight tracking-tight text-[var(--text-hi)] md:text-3xl">
              {title}
            </h3>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--text-mid)]">
              {description}
            </p>
          </div>
          <span className="inline-flex items-center gap-2 self-start whitespace-nowrap rounded-lg border border-[var(--arc-1)]/30 bg-[var(--arc-1)]/10 px-5 py-3 text-sm font-semibold text-[var(--arc-1)] transition-all group-hover:border-[var(--arc-1)]/60 group-hover:bg-[var(--arc-1)]/20 md:self-center">
            {cta}
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </Link>
    </div>
  </section>
);

export default NextPage;
