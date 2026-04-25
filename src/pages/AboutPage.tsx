import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Layout from "@/components/Layout";
import SeoHead from "@/components/SeoHead";
import CTABand from "@/components/CTABand";
import { sitePageApi, SitePage } from "@/lib/sitePageApi";

const certs = [
  {
    badge: "SOC 2",
    sub: "Type II Certified",
    color: "from-emerald-500 to-emerald-700",
    glow: "shadow-emerald-500/30",
    body: "Independently audited against the AICPA SOC 2 Type II framework for security, availability, confidentiality, and data integrity. Annual audit cycle.",
    icon: "🛡",
  },
  {
    badge: "ISO 27001",
    sub: "IEC 27001:2022",
    color: "from-blue-500 to-blue-700",
    glow: "shadow-blue-500/30",
    body: "Information Security Management System aligned with ISO/IEC 27001:2022 — the global gold standard for healthcare data protection.",
    icon: "🔒",
  },
  {
    badge: "HIPAA",
    sub: "Compliant",
    color: "from-violet-500 to-violet-700",
    glow: "shadow-violet-500/30",
    body: "HIPAA-aligned administrative, technical, and physical safeguards for all ePHI handling. BAA available for all full-platform engagements.",
    icon: "✦",
  },
];

const AboutPage = () => {
  const [page, setPage] = useState<SitePage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    sitePageApi.get("about").then((p) => {
      setPage(p);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="bg-[var(--navy)] py-24 px-6">
          <div className="max-w-3xl mx-auto animate-pulse">
            <div className="h-3 w-24 bg-white/10 rounded" />
            <div className="h-12 w-full bg-white/10 rounded mt-4" />
            <div className="h-4 w-5/6 bg-white/10 rounded mt-6" />
            <div className="h-4 w-4/6 bg-white/10 rounded mt-2" />
          </div>
        </div>
        <div className="bg-white py-20 px-6">
          <div className="max-w-3xl mx-auto space-y-3">
            <div className="h-4 w-full bg-slate-100 rounded" />
            <div className="h-4 w-11/12 bg-slate-100 rounded" />
            <div className="h-4 w-10/12 bg-slate-100 rounded" />
          </div>
        </div>
      </Layout>
    );
  }

  if (!page) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto px-6 py-20 text-center">
          <h1 className="text-3xl font-bold text-[var(--navy)]">
            About page unavailable
          </h1>
          <p className="mt-3 text-slate-600">Please check back shortly.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SeoHead
        title={page.metaTitle?.trim() || page.title || "About ZDefense"}
        description={
          page.metaDescription?.trim() ||
          page.subheadline ||
          "About ZDefense — built on years of doing this work by hand."
        }
        path="/about"
      />

      {/* HERO */}
      <section className="bg-[var(--navy)] py-24 px-6 md:px-12 lg:px-16">
        <div className="max-w-3xl mx-auto">
          <p className="text-[var(--emerald)] text-sm font-semibold uppercase tracking-widest">
            OUR STORY
          </p>
          <h1 className="text-white text-5xl font-bold mt-2 leading-tight">
            {page.headline}
          </h1>
          <p className="text-slate-300 text-xl mt-4 leading-relaxed">
            {page.subheadline}
          </p>
        </div>
      </section>

      {/* BODY */}
      <section className="bg-white py-20 px-6 md:px-12 lg:px-16">
        <div className="max-w-3xl mx-auto">
          <div
            className="prose prose-slate max-w-none
              prose-headings:text-[var(--navy)]
              prose-headings:font-bold
              prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
              prose-p:text-slate-700 prose-p:leading-[1.85]
              prose-p:text-[17px]
              prose-strong:text-[var(--navy)]
              prose-blockquote:border-l-4
              prose-blockquote:border-[var(--emerald)]"
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {page.body}
            </ReactMarkdown>
          </div>

          {/* Mission block */}
          <div className="bg-[var(--lgray)] rounded-2xl p-8 mt-12">
            <p className="text-[var(--emerald)] text-xs uppercase tracking-widest font-semibold">
              OUR MISSION
            </p>
            <p className="text-[var(--navy)] text-xl font-bold mt-3 leading-relaxed italic">
              "While payers weaponize data and shifting rules against
              providers, ZDefense turns that same intelligence into your
              defense. We also catch compliance landmines before they
              explode."
            </p>
          </div>
        </div>
      </section>

      {/* CERTIFICATIONS */}
      <section className="bg-[var(--lgray)] py-16 px-6 md:px-12 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <p className="text-[var(--emerald)] text-sm font-semibold uppercase tracking-widest text-center">
            COMPLIANCE & SECURITY
          </p>
          <h2 className="text-[var(--navy)] text-3xl md:text-4xl font-bold text-center mt-2">
            Built to Pass Any Security Review
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {certs.map((c, i) => (
              <div
                key={c.badge}
                className="relative bg-white border border-slate-200 rounded-2xl p-8 text-center overflow-hidden hover:border-slate-300 transition-all duration-500 hover:-translate-y-1"
                style={{ animationDelay: `${i * 150}ms` }}
              >
                <div
                  className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full blur-2xl opacity-20 bg-gradient-to-br ${c.color}`}
                />
                <div
                  className={`relative inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br ${c.color} shadow-xl ${c.glow} mx-auto mb-5`}
                >
                  <span className="text-white text-2xl">{c.icon}</span>
                </div>
                <p className="text-[var(--navy)] font-bold text-2xl">
                  {c.badge}
                </p>
                <p className="text-slate-500 text-sm mt-0.5">{c.sub}</p>
                <p className="text-slate-600 text-sm mt-4 leading-relaxed">
                  {c.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTABand
        headline="See What ZDefense Finds in Your Market"
        subhead="Start with a 30-day no-obligation evaluation. Live payer data. No BAA required."
        primaryText="Book a Demo"
        primaryHref="/contact"
        secondaryText="Start 30-Day Evaluation"
        secondaryHref="/contact?offer=trial"
      />
    </Layout>
  );
};

export default AboutPage;
