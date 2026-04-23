import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import TrialCallout from "@/components/TrialCallout";
import CTABand from "@/components/CTABand";
import HeroAccent from "@/components/HeroAccent";
import SeoHead from "@/components/SeoHead";

interface Tier {
  name: string;
  price: string;
  recovery: string;
  modules: string[];
  bestFor: string;
  ctaText: string;
  ctaHref: string;
  highlighted?: boolean;
  badge?: string;
}

const tiers: Tier[] = [
  { name: "INSIGHT", price: "$1,500/mo", recovery: "Platform access only", modules: ["Sentinel", "Ledger", "Forecast"], bestFor: "Starting with financial intelligence and visibility", ctaText: "Request Pricing", ctaHref: "/contact?tier=insight" },
  { name: "DEFEND", price: "$3,500/mo", recovery: "+ 1.5% recovery share", modules: ["All Insight modules +", "Triage", "Shield", "Prevent"], bestFor: "Adding denial prevention and triage", ctaText: "Request Pricing", ctaHref: "/contact?tier=defend" },
  { name: "RECOVER", price: "$5,000/mo", recovery: "+ 3% recovery share", modules: ["All Defend modules +", "Evidence", "Resolve"], bestFor: "Bulk appeal generation and maximum recovery", ctaText: "Request Pricing", ctaHref: "/contact?tier=recover" },
  { name: "INTELLIGENCE", price: "$8,500/mo", recovery: "+ 5% recovery + 3% underpayment", modules: ["All 9 modules"], bestFor: "Full-platform defense with FHIR integration", ctaText: "Request Pricing", ctaHref: "/contact?tier=intelligence" },
  { name: "ENTERPRISE", price: "$15,000/mo", recovery: "+ 7% recovery + 3% underpayment", modules: ["All 9 modules", "Custom integrations", "BAA active + dedicated support"], bestFor: "Health systems, IDNs, and clearinghouses", ctaText: "Talk to Sales", ctaHref: "/contact?tier=enterprise", highlighted: true, badge: "Most Complete" },
];

const PricingPage = () => {
  return (
    <Layout>
      <SeoHead
        title="ZDefense Pricing — Performance-Based Revenue Cycle Intelligence"
        description="Five ZDefense tiers with platform fees plus performance-based recovery share. Available across all three AI³ delivery models."
        path="/pricing"
      />

      {/* SECTION 1: HERO */}
      <section className="relative overflow-hidden bg-[var(--navy)] py-24 px-6 md:px-12 lg:px-16">
        <HeroAccent />
        <div className="relative max-w-7xl mx-auto">
          <h1 className="text-white text-3xl md:text-4xl lg:text-5xl font-bold">
            We Only Earn When You Win
          </h1>
          <p className="text-slate-300 text-lg md:text-xl max-w-2xl mt-4">
            ZDefense combines a platform access fee with a performance-based
            recovery share. Our incentives are perfectly aligned with yours. If
            we do not recover it, you do not pay for it.
          </p>
          <div className="mt-8 flex gap-4 flex-wrap">
            <Link to="/contact" className="bg-[var(--emerald)] text-white px-6 py-3 rounded font-semibold hover:bg-emerald-600 transition-colors">
              Book a Demo
            </Link>
            <Link to="/contact?intent=pricing" className="border-2 border-white text-white px-6 py-3 rounded font-semibold hover:bg-white hover:text-[var(--navy)] transition-colors">
              Request Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 2: RECOVERY MODEL EXPLAINER */}
      <section className="bg-[var(--emerald)] py-14 px-6 md:px-12 lg:px-16 text-center">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-[var(--navy)] text-3xl font-bold">
            Performance-Based Intelligence. Not Managed Services.
          </h2>
          <p className="text-[var(--navy)]/80 text-lg max-w-2xl mx-auto mt-3">
            When ZDefense recovers underpayments or overturns denials on your
            behalf, we take a small percentage of what we recover. Nothing more.
            This is not a managed services retainer. This is aligned incentives
            at every level of the engagement.
          </p>
        </div>
      </section>

      {/* SECTION 3: AI³ DEPLOYMENT MODELS */}
      <section className="bg-white py-24 px-6 md:px-12 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-[var(--navy)] text-3xl md:text-4xl font-bold">
            AI³ = three ways to deploy the intelligence — not three different products.
          </h2>
          <p className="text-slate-600 text-lg mt-3 max-w-2xl">
            Same platform. Same nine modules. Three delivery models: Actionable AI¹, Augmented AI², Automated AI³. Every pricing tier is available through any delivery model.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-14">
            <div className="rounded-xl p-8 border-2 border-[var(--lgray)]">
              <p className="text-[var(--emerald)] text-xs font-semibold uppercase tracking-widest">ACTIONABLE AI¹</p>
              <h3 className="text-[var(--navy)] font-bold text-xl mt-2">Your Team. Our Platform.</h3>
              <p className="text-slate-600 text-sm mt-3">
                Self-serve dashboards, alerts, and analytics. Your team uses
                ZDefense and acts on the intelligence. Full visibility, full
                control. Best for tech-savvy revenue cycle teams with strong
                internal capacity.
              </p>
              <span className="bg-[var(--lgray)] rounded px-3 py-1 text-xs text-slate-600 inline-block mt-4">
                Best for: Tech-savvy RC teams
              </span>
            </div>

            <div className="rounded-xl p-8 border-2 border-[var(--emerald)]">
              <span className="bg-[var(--emerald)] text-white text-xs px-3 py-1 rounded-full inline-block mb-3">
                Most Popular
              </span>
              <p className="text-[var(--emerald)] text-xs font-semibold uppercase tracking-widest">AUGMENTED AI²</p>
              <h3 className="text-[var(--navy)] font-bold text-xl mt-2">Co-Piloted by ZTech Specialists.</h3>
              <p className="text-slate-600 text-sm mt-3">
                A ZTech specialist works alongside your team — completing
                individual workflows 10x faster because AI handles volume and
                surfaces exceptions that need human judgment. Best for mid-size
                hospitals wanting guidance without full outsourcing.
              </p>
              <span className="bg-[var(--lgray)] rounded px-3 py-1 text-xs text-slate-600 inline-block mt-4">
                Best for: Mid-size hospitals seeking guidance
              </span>
            </div>

            <div className="rounded-xl p-8 border-2 border-[var(--lgray)]">
              <p className="text-[var(--emerald)] text-xs font-semibold uppercase tracking-widest">AUTOMATED AI³</p>
              <h3 className="text-[var(--navy)] font-bold text-xl mt-2">Fire and Forget.</h3>
              <p className="text-slate-600 text-sm mt-3">
                ZTech runs everything end-to-end. You see recovered revenue. Not
                managed services — automated intelligence. Best for
                organizations outsourcing RCM functions.
              </p>
              <span className="bg-[var(--lgray)] rounded px-3 py-1 text-xs text-slate-600 inline-block mt-4">
                Best for: Organizations outsourcing RCM
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: FIVE TIERS */}
      <section className="bg-[var(--lgray)] py-24 px-6 md:px-12 lg:px-16 border-t border-slate-200">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-[var(--navy)] text-3xl md:text-4xl font-bold text-center">
            Five Tiers. One Recovery Model.
          </h2>
          <p className="text-slate-600 text-center mt-2">
            Start where your pain is greatest. Add modules as your organization grows.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mt-14">
            {tiers.map((t) => (
              <div
                key={t.name}
                className={`bg-white rounded-xl p-6 border-2 ${
                  t.highlighted ? "border-[var(--emerald)]" : "border-transparent hover:border-emerald-200"
                } transition-colors flex flex-col`}
              >
                {t.badge && (
                  <span className="bg-[var(--emerald)] text-white text-xs px-3 py-1 rounded-full inline-block mb-2 self-start">
                    {t.badge}
                  </span>
                )}
                <h3 className="text-[var(--navy)] font-bold text-xl">{t.name}</h3>
                <p className="text-[var(--navy)] text-2xl font-bold mt-2">{t.price}</p>
                <p className="text-[var(--emerald)] text-sm font-medium mt-1">{t.recovery}</p>
                <div className="border-t border-[var(--lgray)] my-4" />
                <p className="text-slate-500 text-xs uppercase tracking-widest">MODULES</p>
                <ul className="text-slate-700 text-sm mt-1 space-y-0.5">
                  {t.modules.map((m) => <li key={m}>· {m}</li>)}
                </ul>
                <div className="border-t border-[var(--lgray)] my-4 mt-auto" />
                <p className="text-slate-500 text-xs uppercase tracking-widest">BEST FOR</p>
                <p className="text-slate-600 text-xs mt-1">{t.bestFor}</p>
                <Link
                  to={t.ctaHref}
                  className={`plausible-event-name=Pricing_CTA_Click plausible-event-tier=${t.name.toLowerCase()} w-full text-center py-2 rounded text-sm mt-4 transition-colors ${
                    t.highlighted ? "bg-[var(--emerald)] text-white hover:bg-emerald-600" : "bg-[var(--navy)] text-white hover:bg-[var(--navy-dk)]"
                  }`}
                >
                  {t.ctaText}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: TRIAL + CTA */}
      <section className="px-6 md:px-12 lg:px-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <TrialCallout />
        </div>
      </section>
      <CTABand
        headline="Want a Custom Recovery Projection?"
        subhead="Final pricing depends on organization size, claim volume, and module selection. Request a demo and we'll model the recovery economics for your specific situation."
        primaryText="Request Pricing & Demo"
        primaryHref="/contact?intent=pricing"
        secondaryText="Start Your 30-Day Evaluation — No BAA Required"
        secondaryHref="/contact?offer=trial"
      />
    </Layout>
  );
};

export default PricingPage;
