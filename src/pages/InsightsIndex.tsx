import { Link } from "react-router-dom";
import { ArrowUpRight, FileText } from "lucide-react";
import Layout from "@/components/Layout";
import SeoHead from "@/components/SeoHead";
import Reveal from "@/components/marketing/Reveal";
import { Section, SectionHeading } from "@/components/marketing/primitives";
import { insights } from "@/content/insights.generated";

/* Format a YYYY-MM-DD date as e.g. "April 15, 2026" with month/day/year
   columns kept stable for the journal layout. */
const formatDate = (iso: string) => {
  const d = new Date(iso + "T12:00:00Z"); // noon UTC avoids tz drift
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
};

const formatSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(0)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
};

const InsightsIndex = () => (
  <Layout>
    <SeoHead
      title="Insights — ClaimARC Research & Whitepapers"
      description="Research papers, regulatory updates, and revenue cycle insights from the ClaimARC team."
      path="/insights"
    />

    <Section tone="light" className="pt-24 md:pt-28">
      <SectionHeading
        as="h1"
        eyebrow="Insights"
        title={<>Research, regulatory notes, and <span className="arc-text">revenue cycle reads.</span></>}
        intro="Periodic papers from the ClaimARC research team — quantitative reads on payer behavior, denial trends, and where AI is reshaping the revenue cycle. Open the PDF for the full analysis."
      />
    </Section>

    {/* Journal-style list */}
    <Section tone="light" className="pt-0">
      {insights.length === 0 ? (
        <p className="max-w-xl text-[var(--text-mid)]">
          We're publishing our first paper shortly. Check back soon, or{" "}
          <Link to="/contact" className="font-semibold text-[var(--arc-1)] underline underline-offset-4">
            ask us what's in the queue
          </Link>
          .
        </p>
      ) : (
        <ul className="divide-y divide-white/[0.06] border-y border-white/[0.06]">
          {insights.map((p, i) => (
            <Reveal key={p.slug} delay={i * 60} as="li" className="block">
              <Link
                to={`/insights/${p.slug}`}
                className="group grid items-baseline gap-x-8 gap-y-3 py-7 md:grid-cols-[180px_1fr_auto] md:gap-x-12"
              >
                {/* Left column: date + tags */}
                <div className="flex flex-col gap-1.5">
                  <time
                    dateTime={p.date}
                    className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--text-lo)]"
                  >
                    {formatDate(p.date)}
                  </time>
                  {p.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {p.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-white/10 px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-[var(--text-mid)]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Center column: title + summary */}
                <div>
                  <h2 className="display text-balance text-2xl leading-[1.2] tracking-tight text-[var(--text-hi)] transition-colors group-hover:text-[var(--arc-1)] md:text-3xl">
                    {p.title}
                  </h2>
                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--text-mid)] md:text-base">
                    {p.summary}
                  </p>
                  <p className="mt-3 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[var(--text-lo)]">
                    {p.author} · PDF · {formatSize(p.sizeBytes)}
                  </p>
                </div>

                {/* Right column: open arrow */}
                <div className="hidden self-center md:flex">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-[var(--text-mid)] transition-all group-hover:border-[var(--arc-1)] group-hover:text-[var(--arc-1)]">
                    <ArrowUpRight size={18} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </ul>
      )}
    </Section>

    <Section tone="mist">
      <div className="flex flex-col items-start gap-4">
        <FileText size={20} className="text-[var(--arc-1)]" />
        <h2 className="display text-2xl leading-tight text-[var(--text-hi)] md:text-3xl">
          Want a paper on a specific question?
        </h2>
        <p className="max-w-xl text-[var(--text-mid)]">
          Tell us what you'd find useful — the research team prioritizes topics that
          come up repeatedly in conversations with customers.
        </p>
        <Link
          to="/contact"
          className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--arc-1)] underline underline-offset-4"
        >
          Suggest a topic →
        </Link>
      </div>
    </Section>
  </Layout>
);

export default InsightsIndex;
