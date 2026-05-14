import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft, Download, FileText } from "lucide-react";
import Layout from "@/components/Layout";
import SeoHead from "@/components/SeoHead";
import Reveal from "@/components/marketing/Reveal";
import { Section } from "@/components/marketing/primitives";
import { insights } from "@/content/insights.generated";

const formatDate = (iso: string) => {
  const d = new Date(iso + "T12:00:00Z");
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

const InsightsDetail = () => {
  const { slug } = useParams();
  const paper = insights.find((p) => p.slug === slug);

  if (!paper) {
    return <Navigate to="/insights" replace />;
  }

  return (
    <Layout>
      <SeoHead
        title={`${paper.title} | ClaimARC Insights`}
        description={paper.summary}
        image={paper.ogImage}
        path={`/insights/${paper.slug}`}
      />

      <Section tone="light" className="pt-24 md:pt-28">
        <Link
          to="/insights"
          className="inline-flex items-center gap-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[var(--text-lo)] hover:text-[var(--arc-1)]"
        >
          <ArrowLeft size={14} />
          All insights
        </Link>

        <Reveal className="mt-8">
          <div className="flex flex-wrap items-center gap-3 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[var(--text-lo)]">
            <time dateTime={paper.date} className="font-mono">
              {formatDate(paper.date)}
            </time>
            <span className="text-white/15">·</span>
            <span>{paper.author}</span>
            {paper.tags.length > 0 && (
              <>
                <span className="text-white/15">·</span>
                {paper.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/10 px-2 py-0.5 text-[0.58rem] text-[var(--text-mid)]"
                  >
                    {tag}
                  </span>
                ))}
              </>
            )}
          </div>
          <h1 className="display mt-5 text-balance text-4xl leading-[1.08] tracking-tight md:text-5xl">
            {paper.title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--text-mid)]">
            {paper.summary}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={paper.pdf}
              download
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[var(--arc-1)] via-[var(--arc-2)] to-[var(--arc-3)] bg-[length:200%_100%] bg-left px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_0_1px_rgba(255,255,255,0.10)_inset] transition-all hover:bg-right"
            >
              <Download size={16} />
              Download PDF · {formatSize(paper.sizeBytes)}
            </a>
            <a
              href={paper.pdf}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/[0.03] px-5 py-2.5 text-sm font-semibold text-[var(--text-hi)] hover:border-white/30 hover:bg-white/[0.06]"
            >
              <FileText size={16} />
              Open in new tab
            </a>
          </div>
        </Reveal>
      </Section>

      {/* In-page PDF preview — wide-aspect glass frame. Browsers with no
          inline PDF support fall back to a download prompt automatically. */}
      <Section tone="light" className="pt-0">
        <Reveal>
          <div className="glass relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-3 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-[var(--text-mid)]">
              <span className="inline-flex items-center gap-2">
                <FileText size={12} />
                Document preview
              </span>
              <span className="font-mono text-[var(--text-lo)]">{paper.pdf.split("/").pop()}</span>
            </div>
            <object
              data={`${paper.pdf}#toolbar=1&navpanes=0`}
              type="application/pdf"
              className="block h-[80vh] w-full bg-[var(--ink-1)]"
              aria-label={paper.title}
            >
              <div className="flex h-[40vh] flex-col items-center justify-center gap-4 p-8 text-center">
                <FileText size={28} className="text-[var(--text-mid)]" />
                <p className="text-sm text-[var(--text-mid)]">
                  Your browser can't display PDFs inline.
                </p>
                <a
                  href={paper.pdf}
                  download
                  className="inline-flex items-center gap-2 rounded-lg bg-[var(--cyan-dk)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--navy)]"
                >
                  <Download size={15} />
                  Download the PDF
                </a>
              </div>
            </object>
          </div>
        </Reveal>
      </Section>

      <Section tone="mist">
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[var(--text-lo)]">
          More from the research team
        </p>
        <ul className="mt-6 divide-y divide-white/[0.06] border-y border-white/[0.06]">
          {insights
            .filter((p) => p.slug !== paper.slug)
            .slice(0, 3)
            .map((p) => (
              <li key={p.slug}>
                <Link
                  to={`/insights/${p.slug}`}
                  className="grid items-baseline gap-x-8 gap-y-2 py-5 md:grid-cols-[160px_1fr]"
                >
                  <time
                    dateTime={p.date}
                    className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--text-lo)]"
                  >
                    {formatDate(p.date)}
                  </time>
                  <h3 className="display text-lg leading-tight text-[var(--text-hi)] hover:text-[var(--arc-1)]">
                    {p.title}
                  </h3>
                </Link>
              </li>
            ))}
        </ul>
        {insights.length <= 1 && (
          <p className="mt-6 text-[var(--text-mid)]">
            More papers coming soon. <Link to="/insights" className="font-semibold text-[var(--arc-1)] underline underline-offset-4">Back to all insights</Link>.
          </p>
        )}
      </Section>
    </Layout>
  );
};

export default InsightsDetail;
